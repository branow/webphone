package com.scisbo.webphone.dtos.service;

import java.time.OffsetDateTime;

import com.scisbo.webphone.models.CallStatus;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HistoryRecordSummaryDto {
    String id;
    String number;
    CallStatus status;
    OffsetDateTime startDate;
    OffsetDateTime endDate;
}
