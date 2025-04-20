package com.scisbo.webphone.dtos.controller.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateContactRequest {

    @NotBlank(message = "{contact.name.mandatory}")
    @Size(min = 3, max = 100, message = "{contact.name.size}")
    String name;

    @Size(max = 512, message = "{contact.photoUrl.size}")
    String photoUrl;

    @Size(max = 500, message = "{contact.bio.size}")
    String bio;

    @Valid
    @NotEmpty(message = "{contact.numbers.empty}")
    @Size(max = 10, message = "{contact.numbers.size}")
    List<NumberRequest> numbers;

}
