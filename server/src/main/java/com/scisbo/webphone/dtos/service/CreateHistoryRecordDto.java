package com.scisbo.webphone.dtos.service;

import java.time.OffsetDateTime;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateHistoryRecordDto {
    String user;
    String number;
    String status;
    OffsetDateTime startDate;
    OffsetDateTime endDate;
}
