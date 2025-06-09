package com.scisbo.webphone.services;

import static com.scisbo.webphone.repositories.ContactRepository.ENTITY_NAME;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.dtos.service.ContactDto;
import com.scisbo.webphone.dtos.service.CreateContactDto;
import com.scisbo.webphone.dtos.service.UpdateContactDto;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.PhotoRepository;
import com.scisbo.webphone.utils.validation.EntityValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository repository;
    private final ContactMapper mapper;
    private final PhotoRepository photoRepository;
    private final EntityValidator validator;


    /**
     * Retrieves a paginated list of contacts for the specified user and keyword
     * ordered by name.
     *
     * @param user      the user's identifier
     * @param keyword   the keyword to search
     * @param pageable  the pagination information
     * @return a page of {@link ContactDto}
     * */
    @LogBefore("Retrieving contacts for user=#{#user}, page=#{#pageable}")
    @LogAfter("Retrieved contacts: #{#result}")
    @LogError("Failed to retrieve contacts [#{#error.toString()}]")
    public Page<ContactDto> getByUser(String user, String keyword, Pageable pageable) {
        if (keyword == null || keyword.isEmpty()) {
            return this.repository.findByUserOrderByName(user, pageable)
                .map(this.mapper::mapContactDto);
        }
        return this.repository.findByUserAndKeywordOrderByName(user, keyword, pageable)
            .map(this.mapper::mapContactDto);
    }

    /**
     * Retrieves the contact DTO by its identifier.
     *
     * @param id the contact's identifier
     * @return a {@link ContactDto} object
     * @throws EntityNotFoundException if no contact is found by the given identifier
     * */
    @LogBefore("Retrieving contact with ID=#{#id}")
    @LogAfter("Retrieved contact with ID=#{#result.getId()}")
    @LogError("Failed to retrieve contact [#{#error.toString()}]")
    public ContactDto getById(String id) {
        return this.mapper.mapContactDto(this.repository.getById(id));
    }

    /**
     * Retrieves the contact DTO for the given user with the given number.
     *
     * @param user   the contact's user
     * @param number the contact's number
     * @return a {@link ContactDto} object
     * @throws EntityNotFoundException if no contact is found for the given user
     *         with the given number
     * */
    @LogBefore("Retrieving contact for user=#{#user} with number=#{#number}")
    @LogAfter("Retrieved contact with ID=#{#result.getId()}")
    @LogError("Failed to retrieve contact [#{#error.toString()}]")
    public ContactDto getByNumber(String user, String number) {
        return this.mapper.mapContactDto(this.repository.getByNumber(user, number));
    }

    /**
     * Creates a new contact.
     *
     * @param user      the user creating the contact
     * @param createDto the data for the new contact
     * @return the created {@link ContactDto} object
     * @throws EntityAlreadyExistsException if a contact with the same name or
     *         or number already exists
     * @throws EntityNotFoundException if a photo is present and it does not
     *         match any existing record in the repository
     * */
    @LogBefore("Creating contact for user=#{#user}")
    @LogAfter("Created contact with ID=#{#result.getId()}")
    @LogError("Failed to create contact [#{#error.toString()}]")
    public ContactDto create(String user, CreateContactDto createDto) {
        validateNewContact(createDto, user);
        Contact contact = this.mapper.mapContact(createDto, user);
        this.repository.insert(contact);
        return this.mapper.mapContactDto(contact);
    }

    private void validateNewContact(CreateContactDto createDto, String user) {
        Contact contact = this.mapper.mapContact(createDto, user);
        checkPhotoExisting(contact.getPhoto());

        List<Contact> contacts = this.repository.findByUser(user);
        contacts.add(contact);
        validateUniqueName(contacts);
        validateUniqueNumbers(contacts);
    }

    /**
     * Creates a list of contacts for a given user. All contacts are validated before
     * creation. If validation fails, none of the contacts will be persisted.
     * However, the persistence operation itself is not transactional, so if 
     * an exception occurs during insertion, partial persistence is possible.
     *
     * @param user       the user creating the contacts
     * @param createDtos the data for the new contacts
     * @return the list of successfully created {@link ContactDto} objects
     * @throws EntityAlreadyExistsException if a contact with the same name or
     *         or number already exists
     * @throws EntityNotFoundException if a photo is present and it does not
     *         match any existing record in the repository
     * */
    @LogBefore("Creating batch of contacts for user=#{#user} size=#{#createDtos.size()}")
    @LogAfter("Created batch of contacts for user=#{#user} size=#{#result.size()}")
    @LogError("Failed to create batch of contacts [#{#error.toString()}]")
    public List<ContactDto> create(String user, List<CreateContactDto> createDtos) {
        if (createDtos.isEmpty()) return List.of();

        validateNewContacts(createDtos, user);

        List<Contact> contacts = createDtos.stream()
            .map(dto -> this.mapper.mapContact(dto, user)).toList();

        return this.repository.insert(contacts).stream()
            .map(this.mapper::mapContactDto)
            .toList();
    }

    private void validateNewContacts(List<CreateContactDto> createContactDtos, String user) {
        if (createContactDtos.isEmpty()) return;

        List<Contact> createContacts = createContactDtos.stream()
            .map(createContactDto -> this.mapper.mapContact(createContactDto, user))
            .toList();
        createContacts.forEach(contact -> checkPhotoExisting(contact.getPhoto()));

        List<Contact> contacts = this.repository.findByUser(user);
        contacts.addAll(createContacts);
        validateUniqueName(contacts);
        validateUniqueNumbers(contacts);
    }

    /**
     * Updates the given contact. Fields updated: {@code name}, {@code bio},
     * {@code photo}, {@code numbers}. If the {@code photo} field has changed,
     * the previous photo will be deleted if present.
     *
     * @param updateDto the update data
     * @return the updated {@link ContactDto}
     * @throws EntityNotFoundException if no contact exists the given identifier
     * @throws EntityAlreadyExistsException if another contact with the same name 
     *         or number exists
     * */
    @LogBefore("Updating contact for ID=#{#updateDto.getId()}")
    @LogAfter("Updated contact with ID=#{#result.getId()}")
    @LogError("Failed to update contact [#{#error.toString()}]")
    public ContactDto update(UpdateContactDto updateDto) {
        Contact oldContact = this.repository.getById(updateDto.getId());
        Contact newContact = this.mapper.mapContact(updateDto);
        
        if (!Objects.equals(oldContact.getPhoto(), newContact.getPhoto())) {
            deletePhotoIfPresent(oldContact.getPhoto());
        }

        mergeContactData(oldContact, newContact);
        validateUpdatedContact(oldContact);

        this.repository.save(oldContact);
        return this.mapper.mapContactDto(oldContact);
    }

    private void validateUpdatedContact(Contact contact) {
        checkPhotoExisting(contact.getPhoto());

        List<Contact> contacts = this.repository.findByUser(contact.getUser()).stream()
            .filter(c -> !Objects.equals(c.getId(), contact.getId()))
            .collect(Collectors.toList());
        contacts.add(contact);
        validateUniqueName(contacts);
        validateUniqueNumbers(contacts);
    }

    private void mergeContactData(Contact oldContact, Contact newContact) {
        oldContact.setName(newContact.getName());
        oldContact.setBio(newContact.getBio());
        oldContact.setPhoto(newContact.getPhoto());
        oldContact.setNumbers(newContact.getNumbers());
    }

    /**
     * Deletes a contact by its identifier. Also deletes the associated photo,
     * if present. If contact does not exist, the method does nothing.
     *
     * @param id the contact's identifier
     * */
    @LogBefore("Deleting contact for ID=#{#id}")
    @LogAfter("Deleted contact with ID=#{#id}")
    @LogError("Failed to delete contact [#{#error.toString()}]")
    public void deleteById(String id) {
        this.repository.findById(id).ifPresent(this::delete);
    }

    /**
     * Deletes all contacts for the specified user and associated photos.
     *
     * @param user the user identifier
     * */
    @LogBefore("Deleting contacts for user=#{#user}")
    @LogAfter("Deleted contacts for user=#{#user}")
    @LogError("Failed to delete contacts [#{#error.toString()}]")
    public void deleteByUser(String user) {
        this.repository.findByUser(user).forEach(this::delete);
    }

    private void delete(Contact contact) {
        deletePhotoIfPresent(contact.getPhoto());
        this.repository.deleteById(contact.getId());
    }

    private void deletePhotoIfPresent(String photo) {
        if (photo != null) {
            this.photoRepository.deleteById(photo);
        }
    }

    private void validateUniqueName(List<Contact> contacts) {
        this.validator.validateUniqueField(contacts, Contact::getName, "name", ENTITY_NAME);
    }

    private void validateUniqueNumbers(List<Contact> contacts) {
        Function<Contact, Collection<String>> numbersExtractor =
            (c) -> c.getNumbers().stream().map(Number::getNumber).toList();
        this.validator.validateUniqueNestedField(contacts, numbersExtractor, "number", ENTITY_NAME);
    }

    private void checkPhotoExisting(String photo) {
        if (photo != null) {
            this.photoRepository.getById(photo);
        }
    }

}
