package com.scisbo.webphone.mappers;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.dtos.controller.request.CreateHistoryRecordRequest;
import com.scisbo.webphone.dtos.controller.response.ContactSummaryResponse;
import com.scisbo.webphone.dtos.controller.response.HistoryRecordResponse;
import com.scisbo.webphone.dtos.controller.response.HistoryRecordSummaryResponse;
import com.scisbo.webphone.dtos.controller.response.PageResponse;
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
    private final ContactMapper contactMapper;
    private final PageMapper pageMapper;

    public CreateHistoryRecordDto mapCreateHistoryRecordDto(CreateHistoryRecordRequest record, String user) {
        return CreateHistoryRecordDto.builder()
            .user(user)
            .number(record.getNumber())
            .status(record.getStatus())
            .startDate(record.getStartDate())
            .endDate(record.getEndDate())
            .build();
    }

    public PageResponse<HistoryRecordSummaryResponse> mapHistoryRecordSummaryResponse(Page<HistoryRecordSummaryDto> page) {
        return this.pageMapper.mapPageResponse(page.map(this::mapHistoryRecordSummaryResponse));
    }

    public HistoryRecordSummaryResponse mapHistoryRecordSummaryResponse(HistoryRecordSummaryDto record) {
        String status = this.callStatusConverter.write(record.getStatus(), null);
        return HistoryRecordSummaryResponse.builder()
            .id(record.getId())
            .number(record.getNumber())
            .status(status)
            .startDate(record.getStartDate())
            .endDate(record.getEndDate())
            .build();
    }

    public PageResponse<HistoryRecordResponse> mapHistoryRecordResponse(Page<HistoryRecordDto> page) {
        return this.pageMapper.mapPageResponse(page.map(this::mapHistoryRecordResponse));
    }

    public HistoryRecordResponse mapHistoryRecordResponse(HistoryRecordDto record) {
        String status = this.callStatusConverter.write(record.getStatus(), null);
        ContactSummaryResponse contact = Optional.ofNullable(record.getContact())
            .map(this.contactMapper::mapContactSummaryResponse)
            .orElse(null);
        return HistoryRecordResponse.builder()
            .id(record.getId())
            .number(record.getNumber())
            .status(status)
            .startDate(record.getStartDate())
            .endDate(record.getEndDate())
            .contact(contact)
            .build();
    }

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
