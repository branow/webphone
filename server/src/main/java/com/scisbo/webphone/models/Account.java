package com.scisbo.webphone.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document("accounts")
public class Account {

    @Id
    String id;

    String user;

    String username;

    Boolean active;

    Sip sip;

}
