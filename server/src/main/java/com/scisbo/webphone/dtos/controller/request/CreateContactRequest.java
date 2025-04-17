package com.scisbo.webphone.dtos.controller.request;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateContactRequest {
    String name;
    String photoUrl;
    String bio;
    List<NumberRequest> numbers;
}
