package com.scisbo.webphone.dtos.controller.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateHistoryRecordRequest {

    @NotBlank(message = "{number.mandatory}")
    @Size(max = 12, message = "{number.size}")
    @Pattern(regexp = "[0-9*#]+", message = "{number.pattern}")
    String number;

    @NotBlank(message = "{call.status.mandatory}")
    String status;

    @NotNull(message = "{call.start-date.mandatory}")
    LocalDateTime startDate;

    LocalDateTime endDate;

}
