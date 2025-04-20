package com.scisbo.webphone.dtos.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NumberRequest {

    @NotBlank(message = "{number.type.mandatory}")
    String type;

    @NotBlank(message = "{number.mandatory}")
    @Size(max = 12, message = "{number.size}")
    @Pattern(regexp = "[0-9*#]+", message = "{number.pattern}")
    String number;

}
