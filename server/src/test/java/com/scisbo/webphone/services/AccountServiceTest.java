package com.scisbo.webphone.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.dtos.service.CreateAccountDto;
import com.scisbo.webphone.dtos.service.SipDto;
import com.scisbo.webphone.dtos.service.UpdateAccountDto;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.mappers.AccountMapper;
import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.models.Sip;
import com.scisbo.webphone.repositories.AccountRepository;

@SpringJUnitConfig({
    AccountService.class,
    AccountMapper.class,
    ContactService.class,
    HistoryService.class,
})
public class AccountServiceTest {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountMapper accountMapper;

    @MockitoBean
    private AccountRepository accountRepository;

    @MockitoBean
    private ContactService contactService;

    @MockitoBean
    private HistoryService historyService;

    @Test
    public void testGetByUser() {
        var account = TestObjectsUtils.accounts().getFirst();
        when(this.accountRepository.getByUser(account.getUser())).thenReturn(account);
        var expected = this.accountMapper.mapAccountDto(account);
        var actual = this.accountService.getByUser(account.getUser());
        assertEquals(expected, actual);
    }

    @Test
    public void testGetActiveByUser() {
        var account = TestObjectsUtils.accounts().getFirst();
        when(this.accountRepository.getActiveByUser(account.getUser())).thenReturn(account);
        var expected = this.accountMapper.mapAccountDto(account);
        var actual = this.accountService.getActiveByUser(account.getUser());
        assertEquals(expected, actual);
    }

    @Test
    public void testGetAll_withoutKeyword() {
        var keyword = " ";
        var accounts = TestObjectsUtils.accounts();
        var pageable = PageRequest.of(0, 10);
        when(this.accountRepository.findAllOrderByUsername(pageable)).thenReturn(new PageImpl<>(accounts));
        var expected = new PageImpl<>(accounts.stream().map(this.accountMapper::mapAccountDto).toList());
        var actual = this.accountService.getAll(keyword, pageable);
        assertEquals(expected, actual);
    }

    @Test
    public void testGetAll_withKeyword() {
        var keyword = "keyword";
        var accounts = TestObjectsUtils.accounts();
        var pageable = PageRequest.of(0, 10);
        when(this.accountRepository.findByKeywordOrderByUsername(keyword, pageable)).thenReturn(new PageImpl<>(accounts));
        var expected = new PageImpl<>(accounts.stream().map(this.accountMapper::mapAccountDto).toList());
        var actual = this.accountService.getAll(keyword, pageable);
        assertEquals(expected, actual);
    }

    @Test
    public void testCreate() {
        var createAccount = CreateAccountDto.builder()
            .user("user")
            .username("username")
            .active(false)
            .sip(SipDto.builder()
                .username("username")
                .password("password")
                .domain("domain")
                .proxy("proxy")
                .build())
            .build();

        var account = this.accountMapper.mapAccount(createAccount);

        when(this.accountRepository.findAllByUser(createAccount.getUser()))
            .thenReturn(List.of());
        when(this.accountRepository.findAllBySipUsername(createAccount.getSip().getUsername()))
            .thenReturn(List.of());
        when(this.accountRepository.save(account)).thenReturn(account);

        var expected = this.accountMapper.mapAccountDto(account);
        var actual = this.accountService.create(createAccount);
        assertEquals(expected, actual);
    }

    @Test
    public void testCreate_repetitiveUser() {
        var createAccount = CreateAccountDto.builder()
            .user("user")
            .username("username")
            .active(false)
            .sip(SipDto.builder()
                .username("username")
                .password("password")
                .domain("domain")
                .proxy("proxy")
                .build())
            .build();

        var account = this.accountMapper.mapAccount(createAccount);

        when(this.accountRepository.findAllByUser(createAccount.getUser()))
            .thenReturn(List.of(TestObjectsUtils.accounts().getFirst()));
        when(this.accountRepository.findAllBySipUsername(createAccount.getSip().getUsername()))
            .thenReturn(List.of());

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.accountService.create(createAccount));

        verify(this.accountRepository, never()).save(account);
    }

    @Test
    public void testCreate_repetitiveSipUsername() {
        var createAccount = CreateAccountDto.builder()
            .user("user")
            .username("username")
            .active(false)
            .sip(SipDto.builder()
                .username("username")
                .password("password")
                .domain("domain")
                .proxy("proxy")
                .build())
            .build();

        var account = this.accountMapper.mapAccount(createAccount);

        when(this.accountRepository.findAllByUser(createAccount.getUser()))
            .thenReturn(List.of());
        when(this.accountRepository.findAllBySipUsername(createAccount.getSip().getUsername()))
            .thenReturn(List.of(TestObjectsUtils.accounts().getFirst()));

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.accountService.create(createAccount));

        verify(this.accountRepository, never()).save(account);
    }

    @Test
    public void testUpdate() {
        var updateAccount = UpdateAccountDto.builder()
            .id("id")
            .username("username2")
            .active(false)
            .sip(SipDto.builder()
                .username("username2")
                .password("password2")
                .domain("domain2")
                .proxy("proxy2")
                .build())
            .build();

        var account = Account.builder()
            .id("id")
            .user("user")
            .username("username1")
            .active(true)
            .sip(Sip.builder()
                .username("username1")
                .password("password1")
                .domain("domain1")
                .proxy("proxy1")
                .build())
            .build();

        var updatedAccount = Account.builder()
            .id("id")
            .user("user")
            .username("username2")
            .active(false)
            .sip(Sip.builder()
                .username("username2")
                .password("password2")
                .domain("domain2")
                .proxy("proxy2")
                .build())
            .build();

        when(this.accountRepository.getById(updateAccount.getId()))
            .thenReturn(account);
        when(this.accountRepository.findAllBySipUsername(updateAccount.getSip().getUsername()))
            .thenReturn(List.of());
        when(this.accountRepository.save(updatedAccount)).thenReturn(updatedAccount);

        var expected = this.accountMapper.mapAccountDto(updatedAccount);
        var actual = this.accountService.update(updateAccount);
        assertEquals(expected, actual);
    }

    @Test
    public void testUpdate_repetitiveSipUsername() {
        var updateAccount = UpdateAccountDto.builder()
            .id("id")
            .username("username2")
            .active(false)
            .sip(SipDto.builder()
                .username("username2")
                .password("password2")
                .domain("domain2")
                .proxy("proxy2")
                .build())
            .build();

        var account = Account.builder()
            .id("id")
            .user("user")
            .username("username1")
            .active(true)
            .sip(Sip.builder()
                .username("username1")
                .password("password1")
                .domain("domain1")
                .proxy("proxy1")
                .build())
            .build();

        when(this.accountRepository.getById(updateAccount.getId()))
            .thenReturn(account);
        when(this.accountRepository.findAllBySipUsername(updateAccount.getSip().getUsername()))
            .thenReturn(List.of(TestObjectsUtils.accounts().getFirst()));

        assertThrows(EntityAlreadyExistsException.class,
            () -> this.accountService.update(updateAccount));

        verify(this.accountRepository, never()).save(account);
    }

    @Test
    public void testDeleteById() {
        var account = TestObjectsUtils.accounts().getFirst();
        when(this.accountRepository.findById(account.getId()))
            .thenReturn(Optional.of(account));

        this.accountService.deleteById(account.getId());
        verify(this.historyService).deleteByUser(account.getUser());
        verify(this.contactService).deleteByUser(account.getUser());
        verify(this.accountRepository).deleteById(account.getId());
    }

}
