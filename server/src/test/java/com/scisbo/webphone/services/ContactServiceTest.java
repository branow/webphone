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
import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.dtos.service.UpdateContactDto;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.converters.NumberTypeConverter;
import com.scisbo.webphone.repositories.ContactRepository;

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
    private PhotoService photoService;

    @Test
    public void testGetPageByUser() {
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

        Page<ContactDto> actual = this.service.getPageByUser(user, pageable);

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

        when(this.repository.findById(id)).thenReturn(Optional.of(contact));

        ContactDetailsDto expected = this.mapper.mapContactDetailsDto(contact);
        ContactDetailsDto actual = this.service.getDetailsById(id);

        assertEquals(expected, actual);
    }

    @Test
    public void testGetDetailsById_isAbsent_throwException() {
        String id = UUID.randomUUID().toString();
        when(this.repository.findById(id)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> this.service.getDetailsById(id));
    }

    @Test
    public void testCreate_withoutPhoto() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        CreateContactDto createContact = CreateContactDto.builder()
            .user(user)
            .name("contact123")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        Contact contact = this.mapper.mapContact(createContact);

        when(this.repository.findByUser(user)).thenReturn(contacts);

        ContactDetailsDto expected = this.mapper.mapContactDetailsDto(contact);
        ContactDetailsDto actual = this.service.create(createContact);

        assertEquals(expected, actual);
        verify(this.repository).insert(contact);
    }

    @Test
    public void testCreate_withPhoto() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        CreateContactDto createContact = CreateContactDto.builder()
            .user(user)
            .name("contact123")
            .photoUrl("photoUrl")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        PhotoDto photo = PhotoDto.builder()
            .id("photoId")
            .image("image".getBytes())
            .build();

        Contact contact = this.mapper.mapContact(createContact);

        when(this.repository.findByUser(user)).thenReturn(contacts);
        when(this.photoService.download("photoUrl")).thenReturn(photo);

        ContactDetailsDto expected = this.mapper.mapContactDetailsDto(contact);
        expected.setPhoto(photo.getId());
        ContactDetailsDto actual = this.service.create(createContact);

        assertEquals(expected, actual);
        contact.setPhoto(expected.getPhoto());
        verify(this.repository).insert(contact);
    }

    @Test
    public void testCreate_withExistingName_throwException() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        CreateContactDto createContact = CreateContactDto.builder()
            .user(user)
            .name(contacts.get(5).getName())
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        when(this.repository.findByUser(user)).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class, () -> this.service.create(createContact));
    }

    @Test
    public void testCreate_withExistingNumber_throwException() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        String user = UUID.randomUUID().toString();
        CreateContactDto createContact = CreateContactDto.builder()
            .user(user)
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

        assertThrows(EntityAlreadyExistsException.class, () -> this.service.create(createContact));
    }

    @Test
    public void testUpdate() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        Contact oldContact = contacts.get(0);
        UpdateContactDto updateContact = UpdateContactDto.builder()
            .id(oldContact.getId())
            .photo("photoUrl")
            .name("contact123")
            .bio("bio")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        PhotoDto photo = PhotoDto.builder()
            .id("photoId")
            .image("image".getBytes())
            .build();

        Contact contact = this.mapper.mapContact(updateContact);

        when(this.repository.findById(oldContact.getId())).thenReturn(Optional.of(oldContact));
        when(this.repository.findByUser(oldContact.getUser())).thenReturn(contacts);
        when(this.photoService.download("photoUrl")).thenReturn(photo);

        ContactDetailsDto expected = this.mapper.mapContactDetailsDto(contact);
        expected.setPhoto(photo.getId());
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
    }

    @Test
    public void testUpdate_withNotExistingId_throwException() {
        List<Contact> contacts = TestObjectsUtils.contacts();

        Contact oldContact = contacts.get(0);
        UpdateContactDto updateContact = UpdateContactDto.builder()
            .id("not-existing-id")
            .name("contact123")
            .numbers(List.of(
                NumberDto.builder().type("work").number("1111").build(),
                NumberDto.builder().type("home").number("2222").build()
            ))
            .build();

        when(this.repository.findById(oldContact.getId())).thenReturn(Optional.of(oldContact));
        when(this.repository.findByUser(oldContact.getUser())).thenReturn(contacts);

        assertThrows(EntityNotFoundException.class, () -> this.service.update(updateContact));
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

        when(this.repository.findById(oldContact.getId())).thenReturn(Optional.of(oldContact));
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

        when(this.repository.findById(oldContact.getId())).thenReturn(Optional.of(oldContact));
        when(this.repository.findByUser(oldContact.getUser())).thenReturn(contacts);

        assertThrows(EntityAlreadyExistsException.class, () -> this.service.update(updateContact));
    }

    @Test
    public void testDelete() {
        String id = UUID.randomUUID().toString();
        Contact contact = Contact.builder()
            .photo("photoId")
            .build();

        when(this.repository.findById(id)).thenReturn(Optional.of(contact));
        
        this.service.deleteById(id);

        verify(this.repository).deleteById(id);
        verify(this.photoService).deleteById("photoId");
    }

    @Test
    public void testDelete_notExistingContact() {
        String id = UUID.randomUUID().toString();
        when(this.repository.findById(id)).thenReturn(Optional.empty());
        this.service.deleteById(id);
        verify(this.repository, never()).deleteById(id);
        verify(this.photoService, never()).deleteById(any(String.class));
    }

}
