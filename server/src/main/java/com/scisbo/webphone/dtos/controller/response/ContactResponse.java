package com.scisbo.webphone.dtos.controller.response;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContactResponse {
    String id;
    String user;
    String name;
    String photo;
    String bio;
    List<NumberResponse> numbers;
}
