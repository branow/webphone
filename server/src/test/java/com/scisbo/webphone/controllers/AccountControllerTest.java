package com.scisbo.webphone.controllers;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.lang.reflect.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.common.web.RestUtils;
import com.scisbo.webphone.dtos.controller.request.CreateAccountRequest;
import com.scisbo.webphone.dtos.controller.request.SipRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateAccountRequest;
import com.scisbo.webphone.mappers.AccountMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.services.AccountService;

import jakarta.validation.Valid;

@SpringJUnitConfig({
    AccountController.class,
    AccountMapper.class,
    PageMapper.class,
})
public class AccountControllerTest {

    @Autowired
    private AccountController controller;

    @Autowired
    private AccountMapper mapper;

    @Autowired
    private PageMapper pageMapper;

    @MockitoBean
    private AccountService service;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .build();
    }

    @Test
    public void testGet() throws Exception {
        var id = "accountId";
        var account = this.mapper.mapAccountDto(TestObjectsUtils.accounts().getFirst());
        var response = RestUtils.toJson(this.mapper.mapAccountResponse(account));

        when(this.service.get(id)).thenReturn(account);

        this.mockMvc
            .perform(get("/api/accounts/{id}", id))
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetActiveByUser() throws Exception {
        var user = "user";
        var account = this.mapper.mapAccountDto(TestObjectsUtils.accounts().getFirst());
        var response = RestUtils.toJson(this.mapper.mapAccountResponse(account));

        when(this.service.getActiveByUser(user)).thenReturn(account);

        this.mockMvc
            .perform(get("/api/accounts/user/{user}/active", user))
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetAll() throws Exception {
        var search = "search";
        int number = 0, size = 10, totalPages = 4;
        var pageable = PageRequest.of(number, size);
        var accounts = TestObjectsUtils.accounts().stream()
            .map(this.mapper::mapAccountDto)
            .toList();
        var pageOfAccounts = new PageImpl<>(accounts, pageable, totalPages);

        when(this.service.getAll(search, PageRequest.of(number, size)))
            .thenReturn(pageOfAccounts);

        var responsePage = this.pageMapper.mapPageResponse(pageOfAccounts.map(this.mapper::mapAccountResponse));
        var response = RestUtils.toJson(responsePage);

        this.mockMvc
            .perform(
                get("/api/accounts")
                    .queryParam("number", String.valueOf(number))
                    .queryParam("size", String.valueOf(size))
                    .queryParam("search", search)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetAll_withoutQueryParams() throws Exception {
        int number = 0, size = 50, totalPages = 4;
        var pageable = PageRequest.of(number, size);
        var accounts = TestObjectsUtils.accounts().stream()
            .map(this.mapper::mapAccountDto)
            .toList();
        var pageOfAccounts = new PageImpl<>(accounts, pageable, totalPages);

        when(this.service.getAll(null, PageRequest.of(number, size)))
            .thenReturn(pageOfAccounts);

        var responsePage = this.pageMapper.mapPageResponse(pageOfAccounts.map(this.mapper::mapAccountResponse));
        var response = RestUtils.toJson(responsePage);

        this.mockMvc
            .perform(get("/api/accounts"))
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testCreate() throws Exception {
        var createAccountRequest = CreateAccountRequest.builder()
            .user("user")
            .username("username")
            .active(true)
            .sip(SipRequest.builder()
                .username("username")
                .password("password")
                .domain("domain")
                .proxy("proxy")
                .build()
        ).build();

        var createAccountDto = this.mapper.mapCreateAccountDto(createAccountRequest);
        var account = this.mapper.mapAccount(createAccountDto);
        var accountDto = this.mapper.mapAccountDto(account);
        var accountResponse = this.mapper.mapAccountResponse(accountDto);

        when(this.service.create(createAccountDto)).thenReturn(accountDto);

        var request = RestUtils.toJson(createAccountRequest);
        var response = RestUtils.toJson(accountResponse);

        this.mockMvc
            .perform(
                post("/api/accounts")
                    .header("Content-Type", "application/json")
                    .content(request)
            )
            .andExpect(status().isCreated())
            .andExpect(content().string(response));
    }

    @Test
    public void testCreate_hasValidation() throws Exception {
        Method method = controller.getClass().getMethod("create", CreateAccountRequest.class);
        assertNotNull(method.getParameters()[0].getDeclaredAnnotation(Valid.class));
    }

    @Test
    public void testUpdate() throws Exception {
        var id = "userId";
        var updateAccountRequest = UpdateAccountRequest.builder()
            .username("username")
            .active(true)
            .sip(SipRequest.builder()
                .username("username")
                .password("password")
                .domain("domain")
                .proxy("proxy")
                .build()
        ).build();

        var updateAccountDto = this.mapper.mapUpdateAccountDto(updateAccountRequest, id);
        var account = this.mapper.mapAccount(updateAccountDto);
        var accountDto = this.mapper.mapAccountDto(account);
        var accountResponse = this.mapper.mapAccountResponse(accountDto);

        when(this.service.update(updateAccountDto)).thenReturn(accountDto);

        var request = RestUtils.toJson(updateAccountRequest);
        var response = RestUtils.toJson(accountResponse);

        this.mockMvc
            .perform(
                put("/api/accounts/{id}", id)
                    .header("Content-Type", "application/json")
                    .content(request)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testUpdate_hasValidation() throws Exception {
        Method method = controller.getClass().getMethod("update", String.class, UpdateAccountRequest.class);
        assertNotNull(method.getParameters()[1].getDeclaredAnnotation(Valid.class));
    }

    @Test
    public void testDeleteById() throws Exception {
        var id = "accountId";

        this.mockMvc
            .perform(delete("/api/accounts/{id}", id))
            .andExpect(status().isNoContent());

        verify(this.service).deleteById(id);
    }

}
