package com.scisbo.webphone.common.data;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

import org.bson.Document;
import org.bson.types.Binary;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.models.CallStatus;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.NumberType;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.models.Sip;

public class TestObjectsUtilsTest {

    @Test
    void testAccounts() {
        List<Account> accounts = TestObjectsUtils.accounts();
        assertNotNull(accounts);
        assertEquals(10, accounts.size());
    }

    @Test
    void testPhotos() {
        List<Photo> photos = TestObjectsUtils.photos();
        assertNotNull(photos);
        assertEquals(5, photos.size());
    }

    @Test
    void testContacts() {
        List<Contact> contacts = TestObjectsUtils.contacts();
        assertNotNull(contacts);
        assertEquals(11, contacts.size());
    }

    @Test
    void testHistory() {
        List<HistoryRecord> history = TestObjectsUtils.history();
        assertNotNull(history);
        assertEquals(18, history.size());
    }

    @ParameterizedTest
    @MethodSource("provideTestSipAccount")
    void testSipAccount(Document doc, Account expected) {
        Account actual = TestObjectsUtils.mapAccount(doc);
        assertEquals(expected, actual);
    }

    @ParameterizedTest
    @MethodSource("provideTestMapPhoto")
    void testMapPhoto(Document doc, Photo expected) {
        Photo actual = TestObjectsUtils.mapPhoto(doc);
        assertEquals(expected.getId(), actual.getId());
        assertArrayEquals(expected.getImage().getData(), actual.getImage().getData());
    }

    @ParameterizedTest
    @MethodSource("provideTestMapContact")
    void testMapContact(Document doc, Contact expected) {
        Contact actual = TestObjectsUtils.mapContact(doc);
        assertEquals(expected, actual);
    }

    @ParameterizedTest
    @MethodSource("provideTestMapHistoryRecord")
    void testMapHistoryRecord(Document doc, HistoryRecord expected) {
        HistoryRecord actual = TestObjectsUtils.mapHistoryRecord(doc);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestSipAccount() {
        return Stream.of(
            Arguments.of(
                Document.parse(
                    """
                      {
                        "_id": ObjectId("60f5b6486f1c2d4e2f3e8fa2"),
                        "user": "3b15a74c-2f29-4cde-8f24-781ecfd3a891",
                        "username": "alice.smith",
                        "active": true,
                        "sip": {
                          "username": "alice.smith",
                          "password": "hashed_password_1",
                          "domain": "example.com",
                          "proxy": "proxy.example.com"
                        }
                      }
                    """
                ),
                Account.builder()
                    .id("60f5b6486f1c2d4e2f3e8fa2")
                    .user("3b15a74c-2f29-4cde-8f24-781ecfd3a891")
                    .username("alice.smith")
                    .active(true)
                    .sip(Sip.builder()
                        .username("alice.smith")
                        .password("hashed_password_1")
                        .domain("example.com")
                        .proxy("proxy.example.com")
                        .build())
                    .build()
            )
        );
    }

    private static Stream<Arguments> provideTestMapPhoto() {
        return Stream.of(
            Arguments.of(
                Document.parse(
                    """
                    {
                        "_id": ObjectId("60f5b6486f1c2d4e2f3e8fa0"),
                        "image": BinData(0, "SGVsbG8gV29ybGQ=")
                    }
                    """
                ),
                Photo.builder()
                    .id("60f5b6486f1c2d4e2f3e8fa0")
                    .image(new Binary(Base64.getDecoder().decode("SGVsbG8gV29ybGQ=")))
                    .build()
            )
        );
    }

    private static Stream<Arguments> provideTestMapContact() {
        return Stream.of(
            Arguments.of(
                Document.parse(
                    """
                      {
                        "_id": ObjectId("10f5b1486f1c2d4e2f3e8f9f"),
                        "user": "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0",
                        "name": "John Doe",
                        "photo": "192479821423.png",
                        "bio": "Software engineer with a love for coffee and coding.",
                        "numbers": [
                          { "type": "mobile", "number": "1234567890" },
                          { "type": "work", "number": "0987654321" },
                          { "type": "home", "number": "0931341234" }
                        ]
                      },
                    """
                ),
                Contact.builder()
                    .id("10f5b1486f1c2d4e2f3e8f9f")
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
                    .build()
            ),
            Arguments.of(
                Document.parse(
                    """
                      {
                        "_id": ObjectId("10f5b1486f1c2d4e2f3e8f9f"),
                        "user": "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0",
                        "name": "John Doe",
                        "numbers": [
                          { "type": "home", "number": "0931341234" }
                        ]
                      },
                    """
                ),
                Contact.builder()
                    .id("10f5b1486f1c2d4e2f3e8f9f")
                    .user("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0")
                    .name("John Doe")
                    .numbers(List.of(
                        Number.builder()
                            .type(NumberType.HOME)
                            .number("0931341234")
                            .build()
                    ))
                    .build()
            )
        );
    }

    private static Stream<Arguments> provideTestMapHistoryRecord() {
        return Stream.of(
            Arguments.of(
                Document.parse(
                    """
                    {
                        "_id": ObjectId("60f5b6486f1c2d4e2f3e8fa0"),
                        "user": "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0",
                        "number": "67890",
                        "status": "outgoing",
                        "startDate": ISODate("2025-04-02T12:00:00Z"),
                        "endDate": ISODate("2025-04-02T12:45:00Z")
                    }
                    """
                ),
                HistoryRecord.builder()
                    .id("60f5b6486f1c2d4e2f3e8fa0")
                    .user("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0")
                    .number("67890")
                    .status(CallStatus.OUTGOING)
                    .startDate(Date.from(Instant.parse("2025-04-02T12:00:00Z")))
                    .endDate(Date.from(Instant.parse("2025-04-02T12:45:00Z")))
                    .build()
            ),
            Arguments.of(
                Document.parse(
                    """
                    {
                        "_id": ObjectId("60f5b6486f1c2d4e2f3e8fa0"),
                        "user": "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0",
                        "number": "67890",
                        "status": "outgoing",
                        "startDate": ISODate("2025-04-02T12:00:00Z")
                    }
                    """
                ),
                
                HistoryRecord.builder()
                    .id("60f5b6486f1c2d4e2f3e8fa0")
                    .user("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0")
                    .number("67890")
                    .status(CallStatus.OUTGOING)
                    .startDate(Date.from(Instant.parse("2025-04-02T12:00:00Z")))
                    .build()
            )
        );
    }

}


