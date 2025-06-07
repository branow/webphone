package com.scisbo.webphone.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.dtos.service.ContactDetailsDto;
import com.scisbo.webphone.dtos.service.ContactDto;
import com.scisbo.webphone.dtos.service.CreateContactDto;
import com.scisbo.webphone.dtos.service.NumberDto;
import com.scisbo.webphone.dtos.service.UpdateContactDto;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.models.converters.NumberTypeConverter;
import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.PhotoRepository;

@SpringJUnitConfig({
    ContactService.class,
    ContactMapper.class,
    PageMapper.class,
    NumberTypeConverter.class,
})
@ExtendWith(MockitoExtension.class)
public class ContactServiceTest {

    @Autowired
    private ContactService service;

    @Autowired
    private ContactMapper mapper;

    @MockitoBean
    private ContactRepository repository;

    @MockitoBean
    private PhotoRepository photoRepository;


    @Test
    public void testGetByUser_withKeyword() {
        String user = "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0";
        String keyword = "keyword";
        int totalPages = 1;
        Pageable pageable = PageRequest.of(0, 10);

        List<Contact> contacts = Stream
            .generate(() -> Contact.builder()
                .id(UUID.randomUUID().toString())
                .build())
            .limit(10)
            .toList();

        when(this.repository.findByUserAndKeywordOrderByName(user, keyword, pageable))
                .thenReturn(new PageImpl<>(contacts, pageable, totalPages));

        List<ContactDto> expected = contacts.stream()
            .map(this.mapper::mapContactDto)
            .toList();

        Page<ContactDto> actual = this.service.getByUser(user, keyword, pageable);

        assertEquals(totalPages, actual.getTotalPages());
        assertEquals(expected, actual.toList());
    }

    @Test
    public void testGetByUser_withoutKeyword() {
        String user = "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0";
        int totalPages = 1;
        Pageable pageable = PageRequest.of(0, 10);

        List<Contact> contacts = Stream
            .generate(() -> Contact.builder()
                .id(UUID.randomUUID().toString())
                .build())
            .limit(10)
            .toList();

        when(this.repository.findByUserOrderByName(user, pageable))
                .thenReturn(new PageImpl<>(contacts, pageable, totalPages));

        List<ContactDto> expected = contacts.stream()
            .map(this.mapper::mapContactDto)
            .toList();

        Page<ContactDto> actual = this.service.getByUser(user, "", pageable);

        assertEquals(totalPages, actual.getTotalPages());
        assertEquals(expected, actual.toList());
    }

    @Test
    public void testGetDetailsById() {
        String id = UUID.randomUUID().toString();

        Contact contact = Contact.builder()
            .id(id)
            .user("user123")
            .build();

        when(this.repository.getById(id)).thenReturn(contact);

        ContactDetailsDto expected = this.mapper.mapContactDetailsDto(contact);
        ContactDetailsDto actual = this.service.getDetailsById(id);

        assertEquals(expected, actual);
    }

    @Test
    public void testCreate() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        CreateContactDto createContact = CreateContactDto.builder()
            .name("contact123")
            .photo("photot123")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        Photo photo = Photo.builder().id(createContact.getPhoto()).build();
        Contact contact = this.mapper.mapContact(createContact, user);

        when(this.repository.findByUser(user)).thenReturn(contacts);
        when(this.photoRepository.getById(photo.getId())).thenReturn(photo);

        ContactDetailsDto expected = this.mapper.mapContactDetailsDto(contact);
        ContactDetailsDto actual = this.service.create(user, createContact);

        assertEquals(expected, actual);
        contact.setPhoto(expected.getPhoto());

        verify(this.repository).insert(contact);
    }

    @Test
    public void testCreate_withExistingName_throwException() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        CreateContactDto createContact = CreateContactDto.builder()
            .name(contacts.get(5).getName())
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        when(this.repository.findByUser(user)).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.service.create(user, createContact));
    }

    @Test
    public void testCreate_withExistingNumber_throwException() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        CreateContactDto createContact = CreateContactDto.builder()
            .name("contact123")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder()
                    .type("home")
                    .number(contacts.get(3).getNumbers().get(0).getNumber())
                    .build()
            ))
            .build();

        when(this.repository.findByUser(user)).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.service.create(user, createContact));
    }

    @Test
    public void testCreateBatch() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        List<CreateContactDto> dtos = List.of(
            CreateContactDto.builder()
                .name("contact1")
                .numbers(List.of(
                    NumberDto.builder().type("work").number("1111").build()
                )).build(),
            CreateContactDto.builder()
                .name("contact2")
                .numbers(List.of(
                    NumberDto.builder().type("home").number("2222").build()
                )).build()
        );

        List<Contact> newContacts = dtos.stream()
            .map(dto -> this.mapper.mapContact(dto, user))
            .toList();
        when(this.repository.insert(newContacts)).thenReturn(newContacts);
        when(this.repository.findByUser(user)).thenReturn(contacts);

        List<ContactDetailsDto> expected = newContacts.stream()
            .map(this.mapper::mapContactDetailsDto)
            .toList();
        List<ContactDetailsDto> actual = this.service.create(user, dtos);

        assertEquals(expected, actual);
    }

    @Test
    public void testCreateBatch_withDuplicateNamesInBatch_throwsException() {
        String user = UUID.randomUUID().toString();
        List<CreateContactDto> dtos = List.of(
            CreateContactDto.builder()
                .name("contact1")
                .numbers(List.of(
                    NumberDto.builder().type("work").number("1111").build()
                )).build(),
            CreateContactDto.builder()
                .name("contact1")
                .numbers(List.of(
                    NumberDto.builder().type("home").number("2222").build()
                )).build()
        );

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.service.create(user, dtos));

        List<Contact> newContacts = dtos.stream()
            .map(dto -> this.mapper.mapContact(dto, user))
            .toList();
        newContacts.forEach(contact -> verify(this.repository, never()).insert(contact));
    }

    @Test
    public void testCreateBatch_withDuplicateNumbersInBatch_throwsException() {
        String user = UUID.randomUUID().toString();
        List<CreateContactDto> dtos = List.of(
            CreateContactDto.builder()
                .name("contact1")
                .numbers(List.of(
                    NumberDto.builder().type("work").number("1111").build()
                )).build(),
            CreateContactDto.builder()
                .name("contact2")
                .numbers(List.of(
                    NumberDto.builder().type("home").number("1111").build()
                )).build()
        );

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.service.create(user, dtos));

        List<Contact> newContacts = dtos.stream()
            .map(dto -> this.mapper.mapContact(dto, user))
            .toList();
        newContacts.forEach(contact -> verify(this.repository, never()).insert(contact));
    }

    @Test
    public void testCreateBatch_withDuplicateNamesInRepo_throwsException() {
        List<Contact> contacts = TestObjectsUtils.contacts();
        String user = UUID.randomUUID().toString();
        List<CreateContactDto> dtos = List.of(
            CreateContactDto.builder()
                .name(contacts.stream().findAny().orElseThrow().getName())
                .numbers(List.of(
                    NumberDto.builder().type("work").number("1111").build()
                )).build()
        );
  
        when(this.repository.findByUser(user)).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.service.create(user, dtos));

        List<Contact> newContacts = dtos.stream()
            .map(dto -> this.mapper.mapContact(dto, user))
            .toList();
        newContacts.forEach(contact -> verify(this.repository, never()).insert(contact));
    }

    @Test
    public void testCreateBatch_withDuplicateNumbersInRepo_throwsException() {
        List<Contact> contacts = TestObjectsUtils.contacts();
        String user = UUID.randomUUID().toString();
        List<CreateContactDto> dtos = List.of(
            CreateContactDto.builder()
                .name("contact1")
                .numbers(List.of(
                    NumberDto.builder()
                        .type("work")
                        .number(contacts.stream()
                            .findAny().orElseThrow().getNumbers().stream()
                            .findAny().orElseThrow().getNumber())
                    .build()
                )).build()
        );

        when(this.repository.findByUser(user)).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.service.create(user, dtos));

        List<Contact> newContacts = dtos.stream()
            .map(dto -> this.mapper.mapContact(dto, user))
            .toList();
        newContacts.forEach(contact -> verify(this.repository, never()).insert(contact));
    }

    @Test
    public void testUpdate() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        Contact oldContact = contacts.get(0);
        UpdateContactDto updateContact = UpdateContactDto.builder()
            .id(oldContact.getId())
            .photo("photo123")
            .name("contact123")
            .bio("bio")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        String oldPhotoId = oldContact.getPhoto();
        Photo photo = Photo.builder().id(updateContact.getPhoto()).build();

        Contact contact = this.mapper.mapContact(updateContact);

        when(this.repository.getById(oldContact.getId())).thenReturn(oldContact);
        when(this.repository.findByUser(oldContact.getUser())).thenReturn(contacts);
        when(this.photoRepository.getById(photo.getId())).thenReturn(photo);

        ContactDetailsDto expected = this.mapper.mapContactDetailsDto(contact);
        ContactDetailsDto actual = this.service.update(updateContact);

        assertEquals(expected, actual);
        
        Contact toSaveContact = Contact.builder()
            .id(oldContact.getId())
            .user(oldContact.getUser())
            .name(updateContact.getName())
            .bio(updateContact.getBio())
            .photo(expected.getPhoto())
            .numbers(this.mapper.mapNumber(updateContact.getNumbers()))
            .build();

        verify(this.repository).save(toSaveContact);
        verify(this.photoRepository).deleteById(oldPhotoId);
    }

    @Test
    public void testUpdate_withExistingName_throwException() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        Contact oldContact = contacts.get(0);
        UpdateContactDto updateContact = UpdateContactDto.builder()
            .id(oldContact.getId())
            .name(contacts.get(5).getName())
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        when(this.repository.getById(oldContact.getId())).thenReturn(oldContact);
        when(this.repository.findByUser(oldContact.getUser())).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class, () -> this.service.update(updateContact));
    }

    @Test
    public void testUpdate_withExistingNumber_throwException() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        Contact oldContact = contacts.get(0);
        UpdateContactDto updateContact = UpdateContactDto.builder()
            .id(oldContact.getId())
            .name("unique-name")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder()
                    .type("home")
                    .number(contacts.get(5).getNumbers().get(0).getNumber())
                    .build()
            ))
            .build();

        when(this.repository.getById(oldContact.getId())).thenReturn(oldContact);
        when(this.repository.findByUser(oldContact.getUser())).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class, () -> this.service.update(updateContact));
    }

    @Test
    public void testDeleteById() {
        String id = UUID.randomUUID().toString();
        Contact contact = Contact.builder()
            .id(id)
            .photo("photoId")
            .build();

        when(this.repository.findById(id)).thenReturn(Optional.of(contact));
        
        this.service.deleteById(id);

        verify(this.repository).deleteById(id);
        verify(this.photoRepository).deleteById("photoId");
    }

    @Test
    public void testDeleteById_notExistingContact() {
        String id = UUID.randomUUID().toString();
        when(this.repository.findById(id)).thenReturn(Optional.empty());
        this.service.deleteById(id);
        verify(this.repository, never()).deleteById(id);
        verify(this.photoRepository, never()).deleteById(any(String.class));
    }

    @Test
    public void testDeleteByUser() {
        var user = "user";
        var contacts = List.of(
            Contact.builder().id("id1").photo("photo1").build(),
            Contact.builder().id("id2").photo("photo2").build(),
            Contact.builder().id("id3").photo("photo3").build()
        );

        when(this.repository.findByUser(user)).thenReturn(contacts);
        
        this.service.deleteByUser(user);

        for (var contact: contacts) {
            verify(this.repository).deleteById(contact.getId());
            verify(this.photoRepository).deleteById(contact.getPhoto());
        }
    }

}
