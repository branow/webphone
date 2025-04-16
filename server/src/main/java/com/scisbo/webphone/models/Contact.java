package com.scisbo.webphone.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document("contacts")
public class Contact {

    @Id
    String id;

    String user;

    String name;

    String photo;

    String bio;

    List<Number> numbers;

    public boolean hasNumber(String number) {
        return numbers.stream().anyMatch(n -> n.getNumber().equals(number));
    }

}
