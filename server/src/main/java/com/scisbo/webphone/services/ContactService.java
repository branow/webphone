package com.scisbo.webphone.services;

import static com.scisbo.webphone.repositories.ContactRepository.ENTITY_NAME;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.dtos.service.ContactDetailsDto;
import com.scisbo.webphone.dtos.service.ContactDto;
import com.scisbo.webphone.dtos.service.CreateContactDto;
import com.scisbo.webphone.dtos.service.NumberDto;
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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository repository;
    private final ContactMapper mapper;
    private final PhotoRepository photoRepository;


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
     * Retrieves the contact details DTO by its identifier.
     *
     * @param id the contact's identifier
     * @returns a {@link ContactDetailsDto} object
     * @throws EntityNotFoundException if no contact is found by the given identifier
     * */
    @LogBefore("Retrieving contact with ID=#{#id}")
    @LogAfter("Retrieved contacts with ID=#{#result.getId()}")
    @LogError("Failed to retrieve contact [#{#error.toString()}]")
    public ContactDetailsDto getDetailsById(String id) {
        return this.mapper.mapContactDetailsDto(this.repository.getById(id));
    }

    /**
     * Creates a new contact.
     *
     * @param user      the user creating the contact
     * @param createDto the data for the new contact
     * @return the created {@link ContactDetailsDto} object
     * @throws EntityAlreadyExistsException if a contact with the same name or
     *         or number already exists
     * @throws EntityNotFoundException if a photo is present and it does not
     *         match any existing record in the repository
     * */
    @LogBefore("Creating contact for user=#{#user}")
    @LogAfter("Created contact with ID=#{#result.getId()}")
    @LogError("Failed to create contact [#{#error.toString()}]")
    public ContactDetailsDto create(String user, CreateContactDto createDto) {
        validateNewContact(createDto, user);
        Contact contact = this.mapper.mapContact(createDto, user);
        this.repository.insert(contact);
        return this.mapper.mapContactDetailsDto(contact);
    }

    private void validateNewContact(CreateContactDto createDto, String user) {
        List<Contact> contacts = this.repository.findByUser(user);
        Contact contact = this.mapper.mapContact(createDto, user);
        checkNameUniqueness(contact, contacts);
        checkNumberUniqueness(contact, contacts);
        checkPhotoExisting(contact.getPhoto());
    }

    /**
     * Creates a list of contacts for a given user. All contacts are validated before
     * creation. If validation fails, none of the contacts will be persisted.
     * However, the persistence operation itself is not transactional, so if 
     * an exception occurs during insertion, partial persistence is possible.
     *
     * @param user       the user creating the contacts
     * @param createDtos the data for the new contacts
     * @return the list of successfully created {@link ContactDetailsDto} objects
     * @throws EntityAlreadyExistsException if a contact with the same name or
     *         or number already exists
     * @throws EntityNotFoundException if a photo is present and it does not
     *         match any existing record in the repository
     * */
    @LogBefore("Creating batch of contacts for user=#{#user} size=#{#createDtos.size()}")
    @LogAfter("Created batch of contacts for user=#{#user} size=#{#result.size()}")
    @LogError("Failed to create batch of contacts [#{#error.toString()}]")
    public List<ContactDetailsDto> create(String user, List<CreateContactDto> createDtos) {
        if (createDtos.isEmpty()) return List.of();

        validateNewContacts(createDtos, user);

        List<Contact> contacts = createDtos.stream()
            .map(dto -> this.mapper.mapContact(dto, user)).toList();

        return this.repository.insert(contacts).stream()
            .map(this.mapper::mapContactDetailsDto)
            .toList();
    }

    private void validateNewContacts(List<CreateContactDto> createContactDtos, String user) {
        if (createContactDtos.isEmpty()) return;
        createContactDtos.forEach(createContactDto -> checkNameUniqueness(createContactDto, createContactDtos));
        createContactDtos.forEach(createContactDto -> checkNumberUniqueness(createContactDto, createContactDtos));

        List<Contact> contacts = this.repository.findByUser(user);
        List<Contact> createContacts = createContactDtos.stream()
            .map(createContactDto -> this.mapper.mapContact(createContactDto, user))
            .toList();
        createContacts.forEach(contact -> checkNameUniqueness(contact, contacts));
        createContacts.forEach(contact -> checkNumberUniqueness(contact, contacts));
        createContacts.forEach(contact -> checkPhotoExisting(contact.getPhoto()));
    }

    private void checkNameUniqueness(CreateContactDto contact, List<CreateContactDto> contacts) {
        long count = contacts.stream()
            .filter((oldContact) -> oldContact.getName().equals(contact.getName()))
            .count();
        if (count > 1) {
            throw new EntityAlreadyExistsException(ENTITY_NAME, "name", contact.getName());
        }
    }

    private void checkNumberUniqueness(CreateContactDto newContact, List<CreateContactDto> contacts) {
        List<String> newNumbers = newContact.getNumbers().stream()
            .map(NumberDto::getNumber)
            .toList();

        long count = 0;
        for (CreateContactDto contact : contacts) {
            for (String newNumber : newNumbers) {
                count += contact.getNumbers().stream()
                    .map(NumberDto::getNumber)
                    .filter(number -> Objects.equals(newNumber, number))
                    .count();
                if (count > 1) {
                    throw new EntityAlreadyExistsException(ENTITY_NAME, "number", newNumber);
                }
            }
        }
    }

    /**
     * Updates the given contact. Fields updated: {@code name}, {@code bio}, 
     * {@code photo}, {@code numbers}. If {@code photo} has changed and is not 
     * {@code null}, it treats the new value as an image URL, attempts download it,
     * and deletes the old photo from the repository.
     *
     * @param updateDto the update data
     * @return the updated {@link ContactDetailsDto}
     * @throws EntityNotFoundException if no contact exists the given identifier
     * @throws EntityAlreadyExistsException if another contact with the same name 
     *         or number exists
     * @see PhotoService#download(String)
     * */
    @LogBefore("Updating contact for ID=#{#updateDto.getId()}")
    @LogAfter("Updated contact with ID=#{#result.getId()}")
    @LogError("Failed to udpate contact [#{#error.toString()}]")
    public ContactDetailsDto update(UpdateContactDto updateDto) {
        Contact oldContact = this.repository.getById(updateDto.getId());
        Contact newContact = this.mapper.mapContact(updateDto);
        
        if (!Objects.equals(oldContact.getPhoto(), newContact.getPhoto())) {
            deletePhotoIfPresent(oldContact.getPhoto());
        }

        mergeContactData(oldContact, newContact);
        validateUpdatedContact(oldContact);

        this.repository.save(oldContact);
        return this.mapper.mapContactDetailsDto(oldContact);
    }

    private void validateUpdatedContact(Contact contact) {
        List<Contact> contacts = this.repository.findByUser(contact.getUser()).stream()
            .filter(c -> !Objects.equals(c.getId(), contact.getId()))
            .toList();

        checkNameUniqueness(contact, contacts);
        checkNumberUniqueness(contact, contacts);
        checkPhotoExisting(contact.getPhoto());
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

    private void checkNameUniqueness(Contact contact, List<Contact> contacts) {
        contacts.stream()
            .filter((oldContact) -> oldContact.getName().equals(contact.getName()))
            .findAny()
            .ifPresent((oldContact) -> {
                throw new EntityAlreadyExistsException(ENTITY_NAME, "name", contact.getName());
            });
    }

    private void checkNumberUniqueness(Contact contact, List<Contact> contacts) {
        List<String> newNumbers = contact.getNumbers().stream()
            .map(Number::getNumber)
            .toList();

        for (Contact oldContact : contacts) {
            for (String number : newNumbers) {
                if (oldContact.hasNumber(number)) {
                    throw new EntityAlreadyExistsException(ENTITY_NAME, "number", number);
                }
            }
        }
    }

    private void checkPhotoExisting(String photo) {
        if (photo != null) {
            this.photoRepository.getById(photo);
        }
    }

    private void deletePhotoIfPresent(String photo) {
        if (photo != null) {
            this.photoRepository.deleteById(photo);
        }
    }

    private void mergeContactData(Contact oldContact, Contact newContact) {
        oldContact.setName(newContact.getName());
        oldContact.setBio(newContact.getBio());
        oldContact.setPhoto(newContact.getPhoto());
        oldContact.setNumbers(newContact.getNumbers());
    }

}
