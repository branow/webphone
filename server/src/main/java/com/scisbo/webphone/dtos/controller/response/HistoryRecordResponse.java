package com.scisbo.webphone.dtos.controller.response;

import java.time.OffsetDateTime;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HistoryRecordResponse {
    String id;
    String number;
    String status;
    OffsetDateTime startDate;
    OffsetDateTime endDate;
    ContactSummaryResponse contact;
}
