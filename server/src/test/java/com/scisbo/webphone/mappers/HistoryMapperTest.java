package com.scisbo.webphone.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.service.HistoryRecordSummaryDto;
import com.scisbo.webphone.dtos.service.CreateHistoryRecordDto;
import com.scisbo.webphone.dtos.service.ContactSummaryDto;
import com.scisbo.webphone.dtos.service.HistoryRecordDto;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.CallStatus;
import com.scisbo.webphone.models.converters.CallStatusConverter;

@SpringJUnitConfig({ HistoryMapper.class, CallStatusConverter.class })
public class HistoryMapperTest {

    @Autowired
    private HistoryMapper mapper;

    @Test
    public void testMapHistoryRecordSummaryDto() {
        HistoryRecord record = HistoryRecord.builder()
            .id("id")
            .user("user")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(LocalDateTime.of(2025, 1, 1, 1, 1))
            .endDate(LocalDateTime.of(2025, 1, 1, 1, 5))
            .build();

        HistoryRecordSummaryDto expected = HistoryRecordSummaryDto.builder()
            .id("id")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(LocalDateTime.of(2025, 1, 1, 1, 1))
            .endDate(LocalDateTime.of(2025, 1, 1, 1, 5))
            .build();

        HistoryRecordSummaryDto actual = this.mapper.mapHistoryRecordSummaryDto(record);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapHistoryRecord() {
        CreateHistoryRecordDto dto = CreateHistoryRecordDto.builder()
            .user("user")
            .number("number")
            .status("incoming")
            .startDate(LocalDateTime.of(2025, 1, 1, 1, 1))
            .endDate(LocalDateTime.of(2025, 1, 1, 1, 5))
            .build();

        HistoryRecord expected = HistoryRecord.builder()
            .user("user")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(LocalDateTime.of(2025, 1, 1, 1, 1))
            .endDate(LocalDateTime.of(2025, 1, 1, 1, 5))
            .build();

        HistoryRecord actual = this.mapper.mapHistoryRecord(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void mapHistoryRecordDto() {
        HistoryRecord record = HistoryRecord.builder()
            .id("id")
            .user("user")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(LocalDateTime.of(2025, 1, 1, 1, 1))
            .endDate(LocalDateTime.of(2025, 1, 1, 1, 5))
            .build();

        ContactSummaryDto contact = ContactSummaryDto.builder().build();

        HistoryRecordDto expected = HistoryRecordDto.builder()
            .id("id")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(LocalDateTime.of(2025, 1, 1, 1, 1))
            .endDate(LocalDateTime.of(2025, 1, 1, 1, 5))
            .contact(contact)
            .build();

        HistoryRecordDto actual = this.mapper.mapHistoryRecordDto(record, contact);
        assertEquals(expected, actual);
    }

}
