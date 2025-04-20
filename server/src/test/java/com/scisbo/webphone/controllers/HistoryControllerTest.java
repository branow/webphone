package com.scisbo.webphone.controllers;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Random;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.dtos.controller.request.CreateHistoryRecordRequest;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.mappers.HistoryMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.models.converters.CallStatusConverter;
import com.scisbo.webphone.models.converters.NumberTypeConverter;
import com.scisbo.webphone.services.HistoryService;

import jakarta.validation.Valid;

@SpringJUnitConfig({
    HistoryController.class,
    HistoryMapper.class,
    ContactMapper.class,
    PageMapper.class,
    CallStatusConverter.class,
    NumberTypeConverter.class,
})
public class HistoryControllerTest {

    @Autowired
    private HistoryController historyController;

    @Autowired
    private HistoryMapper historyMapper;

    @Autowired
    private ContactMapper contactMapper;

    @MockitoBean
    private HistoryService historyService;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders
            .standaloneSetup(historyController)
            .build();
    }

    @Test
    public void testGetPageByUser() throws Exception {
        var user = "userId";

        var contacts = TestObjectsUtils.contacts().stream()
                .map(this.contactMapper::mapContactSummaryDto)
                .toList();

        var records = TestObjectsUtils.history().stream()
            .map((record) -> {
                var index = new Random().nextInt(contacts.size());
                return this.historyMapper.mapHistoryRecordDto(record, contacts.get(index));
            })
            .toList();

        int pageNumber = 0, pageSize = 10, totalPages = 5;
        var pageable = PageRequest.of(pageNumber, pageSize);
        var pageOfRecords = new PageImpl<>(records, pageable, totalPages);
        var response = RestUtils.toJson(this.historyMapper.mapHistoryRecordResponse(pageOfRecords));

        when(this.historyService.getPageByUser(user, pageable)).thenReturn(pageOfRecords);

        this.mockMvc
            .perform(
                get("/api/history/user/{user}", user)
                    .queryParam("number", String.valueOf(pageNumber))
                    .queryParam("size", String.valueOf(pageSize))
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetPageByUser_withoutQueryParams() throws Exception {
        var user = "userId";

        var contacts = TestObjectsUtils.contacts().stream()
                .map(this.contactMapper::mapContactSummaryDto)
                .toList();

        var records = TestObjectsUtils.history().stream()
            .map((record) -> {
                var index = new Random().nextInt(contacts.size());
                return this.historyMapper.mapHistoryRecordDto(record, contacts.get(index));
            })
            .toList();

        int pageNumber = 0, pageSize = 50, totalPages = 5;
        var pageable = PageRequest.of(pageNumber, pageSize);
        var pageOfRecords = new PageImpl<>(records, pageable, totalPages);
        var response = RestUtils.toJson(this.historyMapper.mapHistoryRecordResponse(pageOfRecords));

        when(this.historyService.getPageByUser(user, pageable)).thenReturn(pageOfRecords);

        this.mockMvc
            .perform(
                get("/api/history/user/{user}", user)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetPageByUserAndContact() throws Exception {
        var user = "userId";
        var contact = "contactId";
        var records = TestObjectsUtils.history().stream()
            .map(this.historyMapper::mapHistoryRecordSummaryDto)
            .toList();

        int pageNumber = 0, pageSize = 10, totalPages = 5;
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var pageOfRecords = new PageImpl<>(records, pageable, totalPages);
        var response = RestUtils.toJson(this.historyMapper.mapHistoryRecordSummaryResponse(pageOfRecords));

        when(this.historyService.getPageSummaryByContactId(user, contact, pageable)).thenReturn(pageOfRecords);

        this.mockMvc
            .perform(
                get("/api/history/user/{user}/contact/{contact}", user, contact)
                    .queryParam("number", String.valueOf(pageNumber))
                    .queryParam("size", String.valueOf(pageSize))
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetPageByUserAndContact_withoutQueryParams() throws Exception {
        var user = "userId";
        var contact = "contactId";
        var records = TestObjectsUtils.history().stream()
            .map(this.historyMapper::mapHistoryRecordSummaryDto)
            .toList();

        int pageNumber = 0, pageSize = 50, totalPages = 5;
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var pageOfRecords = new PageImpl<>(records, pageable, totalPages);
        var response = RestUtils.toJson(this.historyMapper.mapHistoryRecordSummaryResponse(pageOfRecords));

        when(this.historyService.getPageSummaryByContactId(user, contact, pageable)).thenReturn(pageOfRecords);

        this.mockMvc
            .perform(
                get("/api/history/user/{user}/contact/{contact}", user, contact)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testCreate() throws Exception {
        var user = "userId";

        var createRecordRequest = CreateHistoryRecordRequest.builder()
            .number("1111")
            .status("incoming")
            .startDate(LocalDateTime.of(2025, 1, 1, 1, 1))
            .endDate(LocalDateTime.of(2025, 1, 1, 1, 5))
            .build();

        var createRecordDto = this.historyMapper.mapCreateHistoryRecordDto(createRecordRequest, user);
        var record  = this.historyMapper.mapHistoryRecord(createRecordDto);
        var recordDto = this.historyMapper.mapHistoryRecordDto(record, null);
        var recordResponse = this.historyMapper.mapHistoryRecordResponse(recordDto);

        var request = RestUtils.toJson(createRecordRequest);
        var response = RestUtils.toJson(recordResponse);

        when(this.historyService.create(createRecordDto)).thenReturn(recordDto);

        this.mockMvc
            .perform(
                post("/api/history/user/{user}", user)
                    .header("Content-Type", "application/json")
                    .content(request)
            )
            .andExpect(status().isCreated())
            .andExpect(content().string(response));
    }

    @Test
    public void testCreate_hasValidation() throws Exception {
        Method method = historyController.getClass()
            .getMethod("create", String.class, CreateHistoryRecordRequest.class);
        assertNotNull(method.getParameters()[1].getDeclaredAnnotation(Valid.class));
    }

    @Test
    public void testDeleteByUser() throws Exception {
        var user = "userId";

        this.mockMvc
            .perform(
                delete("/api/history/user/{user}", user)
            )
            .andExpect(status().isNoContent());

        verify(this.historyService).deleteByUser(user);
    }

    @Test
    public void testDeleteById() throws Exception {
        var id = "id";

        this.mockMvc
            .perform(
                delete("/api/history/{id}", id)
            )
            .andExpect(status().isNoContent());

        verify(this.historyService).deleteById(id);
    }

}
