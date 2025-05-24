package com.scisbo.webphone.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;
import java.util.function.Predicate;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.Arguments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.common.data.TestDataUtils;
import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.common.mongodb.EmbeddedMongoDbIT;
import com.scisbo.webphone.models.Account;


@EnableMongoRepositories
@SpringJUnitConfig(AccountRepository.class)
public class AccountRepositoryIT extends EmbeddedMongoDbIT {

    private static String COLLECTION = "accounts";

    @Autowired
    private MongoTemplate template;

    @Autowired
    private AccountRepository repository;


    @ParameterizedTest
    @MethodSource("provideTestFindAllOrderByUsername")
    public void testFindAllOrderByUsername(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Collection<Document> sip = this.template.insert(TestDataUtils.accounts(), COLLECTION);

        List<Account> accounts = sip.stream()
            .map(TestObjectsUtils::mapAccount)
            .toList();

        int total = accounts.size();

        List<Account> expectedAccounts = accounts.stream()
            .sorted((a1, a2) -> a1.getUsername().compareTo(a2.getUsername()))
            .skip(page * size)
            .limit(size)
            .toList();

        Page<Account> expected = new PageImpl<>(expectedAccounts, pageable, total);
        Page<Account> actual = this.repository.findAllOrderByUsername(pageable);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestFindAllOrderByUsername() {
        return Stream.of(
            Arguments.of(1, 2),
            Arguments.of(0, 5),
            Arguments.of(4, 1),
            Arguments.of(3, 3),
            Arguments.of(5, 4)
        );
    }

    @ParameterizedTest
    @MethodSource("provideTestFindByKeywordOrderByUsername")
    public void testFindByKeywordOrderByUsername(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Collection<Document> sip = this.template.insert(TestDataUtils.accounts(), COLLECTION);

        Predicate<Account> search = a -> a.getUser().contains(keyword)
            || a.getUsername().contains(keyword)
            || a.getSip().getUsername().contains(keyword);

        List<Account> accounts = sip.stream()
            .map(TestObjectsUtils::mapAccount)
            .filter(search)
            .toList();

        int total = accounts.size();

        List<Account> expectedAccounts = accounts.stream()
            .sorted((a1, a2) -> a1.getUsername().compareTo(a2.getUsername()))
            .skip(page * size)
            .limit(size)
            .toList();

        Page<Account> expected = new PageImpl<>(expectedAccounts, pageable, total);
        Page<Account> actual = this.repository.findAllOrderByUsername(pageable);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestFindByKeywordOrderByUsername() {
        return Stream.of(
            Arguments.of("", 1, 2),
            Arguments.of("a", 0, 5),
            Arguments.of("e", 4, 1),
            Arguments.of("4", 3, 3),
            Arguments.of(".", 5, 4)
        );
    }

    @Test
    public void testGetById() {
        Collection<Document> doc = this.template.insert(TestDataUtils.accounts(), COLLECTION);
        Account expected = doc.stream()
            .map(TestObjectsUtils::mapAccount)
            .findAny()
            .orElseThrow();

        Account actual = this.repository.getById(expected.getId());
        assertEquals(expected, actual);
    }

    @Test
    public void testGetByUser() {
        Collection<Document> doc = this.template.insert(TestDataUtils.accounts(), COLLECTION);
        Account expected = doc.stream()
            .map(TestObjectsUtils::mapAccount)
            .findAny()
            .orElseThrow();

        Account actual = this.repository.getByUser(expected.getUser());
        assertEquals(expected, actual);
    }

    @ParameterizedTest
    @MethodSource("provideTestFindByUser")
    public void testFindByUser(String user) {
        Collection<Document> doc = this.template.insert(TestDataUtils.accounts(), COLLECTION);
        List<Account> expected = doc.stream()
            .map(TestObjectsUtils::mapAccount)
            .filter(a -> a.getUser().equals(user))
            .toList();
        List<Account> actual = this.repository.findByUser(user);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestFindByUser() {
        return Stream.of(
            Arguments.of("2d21e803-1123-4c97-97f4-219e325aa321"),
            Arguments.of("9740f63e-2e7a-4e0b-a786-e420df3a9a3e"),
            Arguments.of("fd3299a8-6be7-495d-b2e9-d1a52f3088fd")
        );
    }

    @ParameterizedTest
    @MethodSource("provideTestFindBySipUsername")
    public void testFindBySipUsername(String username) {
        Collection<Document> doc = this.template.insert(TestDataUtils.accounts(), COLLECTION);
        List<Account> expected = doc.stream()
            .map(TestObjectsUtils::mapAccount)
            .filter(a -> a.getSip().getUsername().equals(username))
            .toList();
        List<Account> actual = this.repository.findBySipUsername(username);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestFindBySipUsername() {
        return Stream.of(
            Arguments.of("charlie.adams"),
            Arguments.of("alice.smith"),
            Arguments.of("jack.owens")
        );
    }

}
