package com.scisbo.webphone.dtos.service;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateContactDto {
    String id;
    String name;
    String photo;
    String bio;
    List<NumberDto> numbers;
}
