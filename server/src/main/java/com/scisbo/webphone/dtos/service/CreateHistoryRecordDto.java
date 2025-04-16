package com.scisbo.webphone.dtos.service;

import java.time.LocalDateTime;

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
    LocalDateTime startDate;
    LocalDateTime endDate;
}
