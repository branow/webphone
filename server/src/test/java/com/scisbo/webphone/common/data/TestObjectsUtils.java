package com.scisbo.webphone.common.data;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.types.Binary;

import com.scisbo.webphone.models.CallStatus;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.NumberType;
import com.scisbo.webphone.models.Photo;

public class TestObjectsUtils {

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
            .startDate(mapLocalDateTime(doc.getDate("startDate")))
            .endDate(mapLocalDateTime(doc.getDate("endDate")))
            .build();
    }

    private static LocalDateTime mapLocalDateTime(Date date) {
        return Optional.ofNullable(date)
            .map(d -> LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault()))
            .orElse(null);
    }

}
