package com.scisbo.webphone.controllers;

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

import com.scisbo.webphone.dtos.controller.request.CreateAccountRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateAccountRequest;
import com.scisbo.webphone.dtos.controller.response.AccountResponse;
import com.scisbo.webphone.dtos.controller.response.PageResponse;
import com.scisbo.webphone.dtos.service.AccountDto;
import com.scisbo.webphone.dtos.service.CreateAccountDto;
import com.scisbo.webphone.dtos.service.UpdateAccountDto;
import com.scisbo.webphone.mappers.AccountMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.services.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;
    private final AccountMapper mapper;
    private final PageMapper pageMapper;

    @GetMapping("/user/{user}")
    @PreAuthorize("@authService.canRetrieveAccount(authentication, #user)")
    public ResponseEntity<AccountResponse> getByUser(
        @PathVariable("user") String user
    ) {
        AccountDto account = this.service.getByUser(user);
        AccountResponse res = this.mapper.mapAccountResponse(account);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    @PreAuthorize("@authService.isAdmin(authentication)")
    public ResponseEntity<PageResponse<AccountResponse>> getAll(
        @RequestParam(name = "search", required = false) String search,
        @RequestParam(name = "number", required = false, defaultValue = "0") int number,
        @RequestParam(name = "size", required = false, defaultValue = "50") int size
    ) {
        Page<AccountDto> page = this.service.getAll(search, PageRequest.of(number, size));
        PageResponse<AccountResponse> res = this.pageMapper.mapPageResponse(page.map(this.mapper::mapAccountResponse));
        return ResponseEntity.ok(res);
    }

    @PostMapping
    @PreAuthorize("@authService.isAdmin(authentication)")
    public ResponseEntity<AccountResponse> create(
        @RequestBody @Valid CreateAccountRequest req
    ) {
        CreateAccountDto account = this.mapper.mapCreateAccountDto(req);
        AccountDto createdAccount = this.service.create(account);
        AccountResponse res = this.mapper.mapAccountResponse(createdAccount);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authService.isAdmin(authentication)")
    public ResponseEntity<AccountResponse> update(
        @PathVariable("id") String id,
        @RequestBody @Valid UpdateAccountRequest req
    ) {
        UpdateAccountDto account = this.mapper.mapUpdateAccountDto(req, id);
        AccountDto createdAccount = this.service.update(account);
        AccountResponse res = this.mapper.mapAccountResponse(createdAccount);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authService.isAdmin(authentication)")
    public ResponseEntity<AccountResponse> deleteById(
        @PathVariable("id") String id
    ) {
        this.service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
