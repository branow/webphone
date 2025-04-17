package com.scisbo.webphone.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scisbo.webphone.dtos.controller.request.CreateHistoryRecordRequest;
import com.scisbo.webphone.dtos.controller.response.HistoryRecordResponse;
import com.scisbo.webphone.dtos.controller.response.HistoryRecordSummaryResponse;
import com.scisbo.webphone.dtos.controller.response.PageResponse;
import com.scisbo.webphone.dtos.service.CreateHistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordSummaryDto;
import com.scisbo.webphone.mappers.HistoryMapper;
import com.scisbo.webphone.services.HistoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService service;
    private final HistoryMapper mapper;

    @GetMapping("/user/{userId}")
    public ResponseEntity<PageResponse<HistoryRecordResponse>> getPageByUser(
        @PathVariable("userId") String userId,
        @RequestParam(name = "number", required = false, defaultValue = "0") int number,
        @RequestParam(name = "size", required = false, defaultValue = "50") int size
    ) {
        Page<HistoryRecordDto> page = this.service.getPageByUser(userId, PageRequest.of(number, size));
        PageResponse<HistoryRecordResponse> res = this.mapper.mapHistoryRecordResponse(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/user/{userId}/contact/{contactId}")
    public ResponseEntity<PageResponse<HistoryRecordSummaryResponse>> getPageByUserAndContact(
        @PathVariable("userId") String userId,
        @PathVariable("contactId") String contactId,
        @RequestParam(name = "number", required = false, defaultValue = "0") int number,
        @RequestParam(name = "size", required = false, defaultValue = "50") int size
    ) {
        Page<HistoryRecordSummaryDto> page = this.service.getPageSummaryByContactId(userId, contactId, PageRequest.of(number, size));
        PageResponse<HistoryRecordSummaryResponse> res = this.mapper.mapHistoryRecordSummaryResponse(page);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<HistoryRecordResponse> create(
        @PathVariable("userId") String userId,
        @RequestBody CreateHistoryRecordRequest request
    ) {
        CreateHistoryRecordDto record = this.mapper.mapCreateHistoryRecordDto(request, userId);
        HistoryRecordDto createdRecord = this.service.create(record);
        HistoryRecordResponse res = this.mapper.mapHistoryRecordResponse(createdRecord);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteByUser(
        @PathVariable("userId") String userId
    ) {
        this.service.deleteByUser(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<?> deleteById(
        @PathVariable("recordId") String recordId
    ) {
        this.service.deleteById(recordId);
        return ResponseEntity.noContent().build();
    }

}
