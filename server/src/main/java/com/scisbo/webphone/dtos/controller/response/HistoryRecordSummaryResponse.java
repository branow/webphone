package com.scisbo.webphone.dtos.controller.response;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HistoryRecordSummaryResponse {
    String id;
    String number;
    String status;
    LocalDateTime startDate;
    LocalDateTime endDate;
}
