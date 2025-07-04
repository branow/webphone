package com.scisbo.webphone.common.data;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.types.Binary;

import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.models.CallStatus;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.NumberType;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.models.Sip;

public class TestObjectsUtils {

    public static List<Account> accounts() {
        return TestDataUtils.accounts().stream()
            .map(TestObjectsUtils::mapAccount)
            .collect(Collectors.toList());
    }

    public static List<Photo> photos() {
        return TestDataUtils.photos().stream()
            .map(TestObjectsUtils::mapPhoto)
            .collect(Collectors.toList());
    }

    public static List<Contact> contacts() {
        return TestDataUtils.contacts().stream()
            .map(TestObjectsUtils::mapContact)
            .collect(Collectors.toList());
    }

    public static List<HistoryRecord> history() {
        return TestDataUtils.history().stream()
            .map(TestObjectsUtils::mapHistoryRecord)
            .collect(Collectors.toList());
    }

    public static Account mapAccount(Document doc) {
        return Account.builder()
            .id(doc.getObjectId("_id").toString())
            .user(doc.getString("user"))
            .username(doc.getString("username"))
            .active(doc.getBoolean("active"))
            .sip(mapSip((Document) doc.get("sip")))
            .build();
    }

    public static Sip mapSip(Document doc) {
        return Sip.builder()
            .username(doc.getString("username"))
            .password(doc.getString("password"))
            .domain(doc.getString("domain"))
            .proxy(doc.getString("proxy"))
            .build();
    }

    public static Photo mapPhoto(Document doc) {
        return Photo.builder()
            .id(doc.getObjectId("_id").toString())
            .image((Binary) doc.get("image"))
            .build();
    }

    public static Contact mapContact(Document doc) {
        List<Number> numbers = ((List<Document>) doc.get("numbers")).stream()
            .map(d -> Number.builder()
                .type(NumberType.valueOf(d.getString("type").toUpperCase()))
                .number(d.getString("number"))
                .build())
            .toList();

        return Contact.builder()
            .id(doc.getObjectId("_id").toString())
            .user(doc.getString("user"))
            .name(doc.getString("name"))
            .bio(doc.getString("bio"))
            .photo(doc.getString("photo"))
            .numbers(numbers)
            .build();
    }

    public static HistoryRecord mapHistoryRecord(Document doc) {
        CallStatus status = Arrays.stream(CallStatus.values())
            .filter(callStatus -> callStatus.getStatus().equals(doc.getString("status")))
            .findFirst().orElseThrow();
        return HistoryRecord.builder()
            .id(doc.getObjectId("_id").toString())
            .user(doc.getString("user"))
            .number(doc.getString("number"))
            .status(status)
            .startDate(doc.getDate("startDate"))
            .endDate(doc.getDate("endDate"))
            .build();
    }

}
