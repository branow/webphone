package com.scisbo.webphone.dtos.controller.request;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateHistoryRecordRequest {
    String number;
    String status;
    LocalDateTime startDate;
    LocalDateTime endDate;
}
