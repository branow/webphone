package com.scisbo.webphone.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.common.data.TestDataUtils;
import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.common.mongodb.EmbeddedMongoDbAbstractIT;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.NumberType;

@EnableMongoRepositories
@SpringJUnitConfig(ContactRepository.class)
public class ContactRepositoryIT extends EmbeddedMongoDbAbstractIT {

    private static final String COLLECTION = "contacts";

    @Autowired
    private MongoTemplate template;
    @Autowired
    private ContactRepository repository;

    @Test
    public void testFindAll() {
        Collection<Document> contacts = this.template.insert(TestDataUtils.contacts(), COLLECTION);
        List<Contact> expected = contacts.stream()
            .map(TestObjectsUtils::mapContact)
            .toList();
        
        List<Contact> actual = this.repository.findAll();
        assertEquals(expected, actual);
    }

    @ParameterizedTest
    @MethodSource("provideTestFindByUserOrderByName")
    public void testFindByUserOrderByName(String user, int page, int size) {
        Collection<Document> history = this.template.insert(TestDataUtils.contacts(), COLLECTION);

        List<Contact> contacts = history.stream()
            .map(TestObjectsUtils::mapContact)
            .filter(r -> r.getUser().equals(user))
            .sorted((r1, r2) -> r1.getName().compareTo(r2.getName()))
            .toList();

        List<Contact> pageContacts = contacts.stream()
            .skip(page * size)
            .limit(size)
            .toList();
        
        Page<Contact> expected = new PageImpl<>(pageContacts, PageRequest.of(page, size), contacts.size());
        Page<Contact> actual = this.repository.findByUserOrderByName(user, PageRequest.of(page, size));

        assertEquals(expected.getSize(), actual.getSize());
        assertEquals(expected.getTotalPages(), actual.getTotalPages());
        assertEquals(expected.getNumber(), actual.getNumber());
        assertEquals(expected.toList(), actual.toList());
    }

    private static Stream<Arguments> provideTestFindByUserOrderByName() {
        return Stream.of(
            Arguments.of("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0", 1, 2),
            Arguments.of("676f5f8a-4af6-4165-86b1-dd264bb68669", 0, 5),
            Arguments.of("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0", 4, 1),
            Arguments.of("676f5f8a-4af6-4165-86b1-dd264bb68669", 3, 3),
            Arguments.of("2938c3e9-dad9-4258-9806-968a05fc3be5", 5, 4)
        );
    }

    @ParameterizedTest
    @MethodSource("provideTestFindByUser")
    public void testFindByUser(String user) {
        Collection<Document> history = this.template.insert(TestDataUtils.contacts(), COLLECTION);

        List<Contact> expected = history.stream()
            .map(TestObjectsUtils::mapContact)
            .filter(r -> r.getUser().equals(user))
            .toList();
        List<Contact> actual = this.repository.findByUser(user);

        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestFindByUser() {
        return Stream.of(
            Arguments.of("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0"),
            Arguments.of("676f5f8a-4af6-4165-86b1-dd264bb68669"),
            Arguments.of("2938c3e9-dad9-4258-9806-968a05fc3be5")
        );
    }

    @Test
    public void testSave() {
        Contact contact = Contact.builder()
            .user("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0")
            .name("John Doe")
            .photo("192479821423.png")
            .bio("Software engineer with a love for coffee and coding.")
            .numbers(List.of(
                Number.builder()
                    .type(NumberType.MOBILE)
                    .number("1234567890")
                    .build(),
                Number.builder()
                    .type(NumberType.WORK)
                    .number("0987654321")
                    .build(),
                Number.builder()
                    .type(NumberType.HOME)
                    .number("0931341234")
                    .build()
            ))
            .build();

        Contact savedContact = this.repository.save(contact);
        assertNotNull(savedContact.getId());
        assertTrue(contact == savedContact);
    }

    @ParameterizedTest
    @MethodSource("provideTestDeleteById")
    public void testDeleteById(String id) {
        Collection<Document> contacts = this.template.insert(TestDataUtils.contacts(), COLLECTION);

        List<Contact> expected = contacts.stream()
            .map(TestObjectsUtils::mapContact)
            .filter(r -> !r.getId().equals(id))
            .toList();

        this.repository.deleteById(id);

        List<Contact> actual = this.template.findAll(Contact.class, COLLECTION);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestDeleteById() {
        return Stream.of(
            Arguments.of("10f5b1486f1c2d4e2f3e8f9f"),
            Arguments.of("64a7c1a78b9c1a3a0f1e3b02"),
            Arguments.of("64a7c1a78b9c1a3a0f1e3b09"),
            Arguments.of("f96a24d581b154e29d8dc7b0") // doesn't exist
        );
    }

}
