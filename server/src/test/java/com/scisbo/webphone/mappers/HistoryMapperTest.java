package com.scisbo.webphone.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.controller.request.CreateHistoryRecordRequest;
import com.scisbo.webphone.dtos.controller.response.ContactSummaryResponse;
import com.scisbo.webphone.dtos.controller.response.HistoryRecordResponse;
import com.scisbo.webphone.dtos.controller.response.HistoryRecordSummaryResponse;
import com.scisbo.webphone.dtos.service.ContactSummaryDto;
import com.scisbo.webphone.dtos.service.CreateHistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordSummaryDto;
import com.scisbo.webphone.models.CallStatus;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.converters.CallStatusConverter;
import com.scisbo.webphone.models.converters.NumberTypeConverter;

@SpringJUnitConfig({
    HistoryMapper.class,
    PageMapper.class,
    ContactMapper.class,
    CallStatusConverter.class,
    NumberTypeConverter.class,
})
public class HistoryMapperTest {

    @Autowired
    private HistoryMapper mapper;

    @Test
    public void testMapCreateHistoryRecordDto() {
        var user = "user";

        var req = CreateHistoryRecordRequest.builder()
            .number("number")
            .status("incoming")
            .startDate(OffsetDateTime.of(2025, 1, 1, 1, 1, 0, 0, ZoneOffset.ofHours(1)))
            .endDate(OffsetDateTime.of(2025, 1, 1, 1, 5, 0, 0, ZoneOffset.ofHours(1)))
            .build();

        var expected = CreateHistoryRecordDto.builder()
            .user(user)
            .number("number")
            .status("incoming")
            .startDate(OffsetDateTime.of(2025, 1, 1, 1, 1, 0, 0, ZoneOffset.ofHours(1)))
            .endDate(OffsetDateTime.of(2025, 1, 1, 1, 5, 0, 0, ZoneOffset.ofHours(1)))
            .build();

        var actual = this.mapper.mapCreateHistoryRecordDto(req, user);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapHistoryRecordSummaryResponse() {
        var dto = HistoryRecordSummaryDto.builder()
            .id("id")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(OffsetDateTime.of(2025, 1, 1, 1, 1, 0, 0, ZoneOffset.ofHours(1)))
            .endDate(OffsetDateTime.of(2025, 1, 1, 1, 5, 0, 0, ZoneOffset.ofHours(1)))
            .build();

        var expected = HistoryRecordSummaryResponse.builder()
            .id("id")
            .number("number")
            .status("incoming")
            .startDate(OffsetDateTime.of(2025, 1, 1, 1, 1, 0, 0, ZoneOffset.ofHours(1)))
            .endDate(OffsetDateTime.of(2025, 1, 1, 1, 5, 0, 0, ZoneOffset.ofHours(1)))
            .build();

        var actual = this.mapper.mapHistoryRecordSummaryResponse(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapHistoryRecordResponse() {
        var dto = HistoryRecordDto.builder()
            .id("id")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(OffsetDateTime.of(2025, 1, 1, 1, 1, 0, 0, ZoneOffset.ofHours(1)))
            .endDate(OffsetDateTime.of(2025, 1, 1, 1, 5, 0, 0, ZoneOffset.ofHours(1)))
            .contact(ContactSummaryDto.builder()
                .id("id")
                .name("name")
                .photo("photo")
                .build())
            .build();

        var expected = HistoryRecordResponse.builder()
            .id("id")
            .number("number")
            .status("incoming")
            .startDate(OffsetDateTime.of(2025, 1, 1, 1, 1, 0, 0, ZoneOffset.ofHours(1)))
            .endDate(OffsetDateTime.of(2025, 1, 1, 1, 5, 0, 0, ZoneOffset.ofHours(1)))
            .contact(ContactSummaryResponse.builder()
                .id("id")
                .name("name")
                .photo("photo")
                .build())
            .build();

        var actual = this.mapper.mapHistoryRecordResponse(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapHistoryRecordSummaryDto() {
        HistoryRecord record = HistoryRecord.builder()
            .id("id")
            .user("user")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(Date.from(OffsetDateTime.parse("2025-01-01T01:00Z").toInstant()))
            .endDate(Date.from(OffsetDateTime.parse("2025-01-01T01:05Z").toInstant()))
            .build();

        HistoryRecordSummaryDto expected = HistoryRecordSummaryDto.builder()
            .id("id")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(OffsetDateTime.parse("2025-01-01T01:00Z"))
            .endDate(OffsetDateTime.parse("2025-01-01T01:05Z"))
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
            .startDate(OffsetDateTime.parse("2025-01-01T01:00Z"))
            .endDate(OffsetDateTime.parse("2025-01-01T01:05Z"))
            .build();

        HistoryRecord expected = HistoryRecord.builder()
            .user("user")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(Date.from(OffsetDateTime.parse("2025-01-01T01:00Z").toInstant()))
            .endDate(Date.from(OffsetDateTime.parse("2025-01-01T01:05Z").toInstant()))
            .build();

        HistoryRecord actual = this.mapper.mapHistoryRecord(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapHistoryRecordDto() {
        HistoryRecord record = HistoryRecord.builder()
            .id("id")
            .user("user")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(Date.from(OffsetDateTime.parse("2025-01-01T01:00Z").toInstant()))
            .endDate(Date.from(OffsetDateTime.parse("2025-01-01T01:05Z").toInstant()))
            .build();

        ContactSummaryDto contact = ContactSummaryDto.builder().build();

        HistoryRecordDto expected = HistoryRecordDto.builder()
            .id("id")
            .number("number")
            .status(CallStatus.INCOMING)
            .startDate(OffsetDateTime.parse("2025-01-01T01:00Z"))
            .endDate(OffsetDateTime.parse("2025-01-01T01:05Z"))
            .contact(contact)
            .build();

        HistoryRecordDto actual = this.mapper.mapHistoryRecordDto(record, contact);
        assertEquals(expected, actual);
    }

}
