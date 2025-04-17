package com.scisbo.webphone.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.service.CreateHistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordSummaryDto;
import com.scisbo.webphone.exceptions.InvalidValueException;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.mappers.HistoryMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.NumberType;
import com.scisbo.webphone.models.converters.CallStatusConverter;
import com.scisbo.webphone.models.converters.NumberTypeConverter;
import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.HistoryRepository;

@SpringJUnitConfig({
    HistoryService.class,
    HistoryMapper.class,
    ContactMapper.class,
    PageMapper.class,
    CallStatusConverter.class,
    NumberTypeConverter.class,
})
@ExtendWith(MockitoExtension.class)
public class HistoryServiceTest {

    @Autowired
    private HistoryService historyService;

    @Autowired
    private HistoryMapper historyMapper;

    @Autowired
    private ContactMapper contactMapper;

    @MockitoBean
    private HistoryRepository historyRepository;

    @MockitoBean
    private ContactService contactService;

    @MockitoBean
    private ContactRepository contactRepository;

    @Test
    public void testGetPageByUser() {
        String user = "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0";
        int totalPages = 1;
        Pageable pageable = PageRequest.of(0, 10);

        List<HistoryRecord> records = List.of(
            HistoryRecord.builder().user(user).number("12345678").build(),
            HistoryRecord.builder().user(user).number("87654321").build()
        );

        List<Contact> contacts = List.of(
            Contact.builder().user(user).numbers(List.of(
                Number.builder().number("11223344").build(),
                Number.builder().number("22112211").build()
            )).build(),
            Contact.builder().user(user).numbers(List.of(
                Number.builder().number("11111111").build(),
                Number.builder().number("12345678").build(),
                Number.builder().number("22222222").build()
            )).build(),
            Contact.builder().user(user).numbers(List.of(
                Number.builder().number("33445566").build()
            )).build()
        );

        when(this.historyRepository.findByUserOrderByStartDateDesc(user, pageable))
            .thenReturn(new PageImpl<>(records, pageable, totalPages));
        when(this.contactRepository.findByUser(user)).thenReturn(contacts);

        List<HistoryRecordDto> expected = List.of(
            historyMapper.mapHistoryRecordDto(
                records.get(0),
                contactMapper.mapContactSummaryDto(contacts.get(1))
            ),
            historyMapper.mapHistoryRecordDto(
                records.get(1),
                null
            )
        );

        Page<HistoryRecordDto> actual = this.historyService.getPageByUser(user, pageable);

        assertEquals(totalPages, actual.getTotalPages());
        assertEquals(expected, actual.toList());
    }

    @Test
    public void testGetPageSummaryByContactId() {
        String user = "f96a24d5-f4c7-418a-81b1-54e29d8dc7b0";
        int totalPages = 1;
        Pageable pageable = PageRequest.of(0, 10);

        Contact contact = Contact.builder()
            .id("10f5b1486f1c2d4e2f3e8f9f")
            .numbers(List.of(
                Number.builder().type(NumberType.WORK).number("1111").build(),
                Number.builder().type(NumberType.HOME).number("2222").build(),
                Number.builder().type(NumberType.MOBILE).number("3333").build()
            ))
            .build();

        List<String> numbers = List.of("1111", "2222", "3333");

        List<HistoryRecord> records = List.of(
            HistoryRecord.builder().number("1111").build(),
            HistoryRecord.builder().number("1234").build(),
            HistoryRecord.builder().number("2222").build()
        );

        when(this.contactRepository.findById(contact.getId())).thenReturn(Optional.of(contact));
        when(this.historyRepository.findByUserAndNumberInOrderByStartDateDesc(user, numbers, pageable))
            .thenReturn(new PageImpl<>(records, pageable, totalPages));

        List<HistoryRecordSummaryDto> expected = records.stream()
            .map(this.historyMapper::mapHistoryRecordSummaryDto)
            .toList();

        Page<HistoryRecordSummaryDto> actual =
            this.historyService.getPageSummaryByContactId(user, contact.getId(), pageable);

        assertEquals(totalPages, actual.getTotalPages());
        assertEquals(expected, actual.toList());
    }

    @Test
    public void testCreate_invalidStatus_throwException() {
        CreateHistoryRecordDto createRecord = CreateHistoryRecordDto.builder()
            .status("invalidStatus")
            .build();
        assertThrows(InvalidValueException.class, () -> this.historyService.create(createRecord));
    }


    @Test
    public void testCreate_withContact() {
        CreateHistoryRecordDto createRecordDto = CreateHistoryRecordDto.builder()
            .user("1234-asdf-5678")
            .number("12345678")
            .status("incoming")
            .build();
        HistoryRecord record = historyMapper.mapHistoryRecord(createRecordDto);

        List<Contact> contacts = List.of(
            Contact.builder().numbers(List.of(
                Number.builder().number("22112211").build()
            )).build(),
            Contact.builder().numbers(List.of(
                Number.builder().number("11111111").build(),
                Number.builder().number("12345678").build()
            )).build()
        );

        when(this.historyRepository.save(record)).thenReturn(record);
        when(this.contactRepository.findByUser(record.getUser())).thenReturn(contacts);

        HistoryRecordDto expected = historyMapper.mapHistoryRecordDto(
            record,
            contactMapper.mapContactSummaryDto(contacts.get(0))
        );
        HistoryRecordDto actual = historyService.create(createRecordDto);

        assertEquals(expected, actual);
    }

    @Test
    public void testCreate_withoutContact() {
        CreateHistoryRecordDto createRecordDto = CreateHistoryRecordDto.builder()
            .user("1234-asdf-5678")
            .number("12345678")
            .status("incoming")
            .build();
        HistoryRecord record = this.historyMapper.mapHistoryRecord(createRecordDto);

        List<Contact> contacts = List.of(
            Contact.builder().numbers(List.of(
                Number.builder().number("22112211").build()
            )).build(),
            Contact.builder().numbers(List.of(
                Number.builder().number("11111111").build()
            )).build()
        );

        when(this.historyRepository.save(record)).thenReturn(record);
        when(this.contactRepository.findByUser(record.getUser())).thenReturn(contacts);

        HistoryRecordDto expected = this.historyMapper.mapHistoryRecordDto(record, null);
        HistoryRecordDto actual = this.historyService.create(createRecordDto);

        assertEquals(expected, actual);
    }

    @Test
    public void testDeleteByUser() {
        String user = "1234-asdf-1234";
        this.historyService.deleteByUser(user);
        verify(this.historyRepository).deleteByUser(user);
    }

    @Test
    public void testDeleteById() {
        String id = "12dlfj123fkjas";
        this.historyService.deleteById(id);
        verify(this.historyRepository).deleteById(id);
    }

}
