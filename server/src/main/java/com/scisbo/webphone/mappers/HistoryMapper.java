package com.scisbo.webphone.mappers;

import org.springframework.stereotype.Component;

import com.scisbo.webphone.dtos.service.ContactSummaryDto;
import com.scisbo.webphone.dtos.service.CreateHistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordSummaryDto;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.converters.CallStatusConverter;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class HistoryMapper {

    private final CallStatusConverter callStatusConverter;

    public HistoryRecordSummaryDto mapHistoryRecordSummaryDto(HistoryRecord record) {
        return HistoryRecordSummaryDto.builder()
            .id(record.getId())
            .number(record.getNumber())
            .status(record.getStatus())
            .startDate(record.getStartDate())
            .endDate(record.getEndDate())
            .build();
    }

    public HistoryRecord mapHistoryRecord(CreateHistoryRecordDto dto) {
        return HistoryRecord.builder()
            .user(dto.getUser())
            .number(dto.getNumber())
            .status(callStatusConverter.read(dto.getStatus(), null))
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .build();
    }

    public HistoryRecordDto mapHistoryRecordDto(HistoryRecord record, ContactSummaryDto contact) {
        return HistoryRecordDto.builder()
            .id(record.getId())
            .number(record.getNumber())
            .status(record.getStatus())
            .startDate(record.getStartDate())
            .endDate(record.getEndDate())
            .contact(contact)
            .build();
    }

}
