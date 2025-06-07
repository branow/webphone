package com.scisbo.webphone.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scisbo.webphone.dtos.controller.request.CreateContactRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateContactRequest;
import com.scisbo.webphone.dtos.controller.response.ContactDetailsResponse;
import com.scisbo.webphone.dtos.controller.response.ContactResponse;
import com.scisbo.webphone.dtos.controller.response.PageResponse;
import com.scisbo.webphone.dtos.service.ContactDetailsDto;
import com.scisbo.webphone.dtos.service.ContactDto;
import com.scisbo.webphone.dtos.service.CreateContactDto;
import com.scisbo.webphone.dtos.service.UpdateContactDto;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.services.ContactService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService service;
    private final ContactMapper mapper;


    @GetMapping("/user/{userId}")
    @PreAuthorize("@authService.canRetrieveContacts(authentication, #userId)")
    public ResponseEntity<PageResponse<ContactResponse>> getByUser(
        @PathVariable("userId") String userId,
        @RequestParam(name = "search", required = false) String search,
        @RequestParam(name = "number", required = false, defaultValue = "0") int number,
        @RequestParam(name = "size", required = false, defaultValue = "50") int size
    ) {
        Page<ContactDto> page = this.service.getByUser(userId, search, PageRequest.of(number, size));
        PageResponse<ContactResponse> res = this.mapper.mapContactResponse(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@authService.canRetrieveContact(authentication, #id)")
    public ResponseEntity<ContactDetailsResponse> getById(
        @PathVariable("id") String id
    ) {
        ContactDetailsDto contact = this.service.getDetailsById(id);
        ContactDetailsResponse res = this.mapper.mapContactDetailsResponse(contact);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("@authService.canCreateContact(authentication, #userId)")
    public ResponseEntity<ContactDetailsResponse> create(
        @PathVariable("userId") String userId,
        @RequestBody @Valid CreateContactRequest request
    ) {
        CreateContactDto contact = this.mapper.mapCreateContactDto(request);
        ContactDetailsDto createdContact = this.service.create(userId, contact);
        ContactDetailsResponse res = this.mapper.mapContactDetailsResponse(createdContact);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/user/{userId}/batch")
    @PreAuthorize("@authService.canCreateContact(authentication, #userId)")
    public ResponseEntity<List<ContactDetailsResponse>> create(
        @PathVariable("userId") String userId,
        @RequestBody @Valid List<CreateContactRequest> request
    ) {
        List<CreateContactDto> contacts = request.stream()
            .map(this.mapper::mapCreateContactDto)
            .toList();
        List<ContactDetailsDto> created = this.service.create(userId, contacts);
        List<ContactDetailsResponse> res = created.stream()
            .map(this.mapper::mapContactDetailsResponse)
            .toList();
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authService.canUpdateContact(authentication, #id)")
    public ResponseEntity<ContactDetailsResponse> update(
        @PathVariable("id") String id,
        @RequestBody @Valid UpdateContactRequest request
    ) {
        UpdateContactDto contact = this.mapper.mapUpdateContactDto(request, id);
        ContactDetailsDto createdContact = this.service.update(contact);
        ContactDetailsResponse res = this.mapper.mapContactDetailsResponse(createdContact);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authService.canDeleteContact(authentication, #id)")
    public ResponseEntity<?> deleteById(
        @PathVariable("id") String id
    ) {
        this.service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
