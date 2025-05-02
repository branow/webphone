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
import com.scisbo.webphone.dtos.service.UpdateContactDto;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.repositories.ContactRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository repository;
    private final ContactMapper mapper;
    private final PhotoService photoService;

    /**
     * Retrieves a paginated list of contacts for the specified user,
     * ordered by name.
     *
     * @param user      the user's identifier
     * @param pageable  the pagination information
     * @returns a page of {@link ContactDto}
     * */
    @LogBefore("Retrieving contacts for user=#{#user}, page=#{#pageable}")
    @LogAfter("Retrieved contacts: #{#result}")
    @LogError("Failed to retrieve contacts [#{#error.toString()}]")
    public Page<ContactDto> getPageByUser(String user, Pageable pageable) {
        return this.repository.findByUserOrderByName(user, pageable)
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
     * Creates a new contact. If {@code photoUrl} is not null, 
     * it will attempt to download image from the given URL.
     *
     * @params createDto the data for the new contact
     * @returns the created {@link ContactDetailsDto} object
     * @throws EntityAlreadyExistsException if a contact with the same name or 
     *         or number already exists.
     * @see PhotoService#download(String)
     * */
    @LogBefore("Creating contact for user=#{#createDto.getUser()}")
    @LogAfter("Created contact with ID=#{#result.getId()}")
    @LogError("Failed to create contact [#{#error.toString()}]")
    public ContactDetailsDto create(CreateContactDto createDto) {
        Contact contact = this.mapper.mapContact(createDto);
        validateNewContact(contact);
        uploadPhotoIfPresent(contact);
        this.repository.insert(contact);
        return this.mapper.mapContactDetailsDto(contact);
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
            uploadPhotoIfPresent(newContact);
            deletePhotoIfPresent(oldContact);
        }

        mergeContactData(oldContact, newContact);
        validateUpdatedContact(oldContact);

        this.repository.save(oldContact);
        return this.mapper.mapContactDetailsDto(oldContact);
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
        this.repository.findById(id).ifPresent(contact -> {
            deletePhotoIfPresent(contact);
            this.repository.deleteById(id);
        });
    }

    private void validateNewContact(Contact contact) {
        List<Contact> contacts = this.repository.findByUser(contact.getUser());
        checkNameUniqueness(contact, contacts);
        checkNumberUniqueness(contact, contacts);
    }

    private void validateUpdatedContact(Contact contact) {
        List<Contact> contacts = this.repository.findByUser(contact.getUser())
            .stream()
            .filter((oldContact) -> !oldContact.getId().equals(contact.getId()))
            .toList();

        checkNameUniqueness(contact, contacts);
        checkNumberUniqueness(contact, contacts);
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

    private void deletePhotoIfPresent(Contact contact) {
        if (contact.getPhoto() == null) return;
        String photoId = contact.getPhoto();
        this.photoService.deleteById(photoId);
    }

    private void uploadPhotoIfPresent(Contact contact) {
        String photoUrl = contact.getPhoto();
        if (photoUrl == null) return;
        String photoId = this.photoService.download(photoUrl).getId();
        this.photoService.optimize(photoId);
        contact.setPhoto(photoId);
    }

    private void mergeContactData(Contact oldContact, Contact newContact) {
        oldContact.setName(newContact.getName());
        oldContact.setBio(newContact.getBio());
        oldContact.setPhoto(newContact.getPhoto());
        oldContact.setNumbers(newContact.getNumbers());
    }

}
