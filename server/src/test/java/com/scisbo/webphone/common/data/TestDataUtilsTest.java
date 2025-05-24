package com.scisbo.webphone.common.data;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.bson.Document;
import org.junit.jupiter.api.Test;

public class TestDataUtilsTest {

    @Test
    void testAccounts() {
        List<Document> accounts = TestDataUtils.accounts();
        assertNotNull(accounts);
        assertEquals(10, accounts.size());
    }

    @Test
    void testPhotos() {
        List<Document> photos = TestDataUtils.photos();
        assertNotNull(photos);
        assertEquals(5, photos.size());
    }

    @Test
    void testContacts() {
        List<Document> contacts = TestDataUtils.contacts();
        assertNotNull(contacts);
        assertEquals(11, contacts.size());
    }

    @Test
    void testHistory() {
        List<Document> history = TestDataUtils.history();
        assertNotNull(history);
        assertEquals(18, history.size());
    }

}
