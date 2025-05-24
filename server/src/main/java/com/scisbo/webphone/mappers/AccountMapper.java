package com.scisbo.webphone.mappers;

import org.springframework.stereotype.Component;

import com.scisbo.webphone.dtos.service.CreateAccountDto;
import com.scisbo.webphone.dtos.service.UpdateAccountDto;
import com.scisbo.webphone.dtos.controller.request.CreateAccountRequest;
import com.scisbo.webphone.dtos.controller.request.SipRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateAccountRequest;
import com.scisbo.webphone.dtos.controller.response.AccountResponse;
import com.scisbo.webphone.dtos.controller.response.SipResponse;
import com.scisbo.webphone.dtos.service.AccountDto;
import com.scisbo.webphone.dtos.service.SipDto;
import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.models.Sip;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountMapper {

    public UpdateAccountDto mapUpdateAccountDto(UpdateAccountRequest account, String id) {
        return UpdateAccountDto.builder()
            .id(id)
            .username(account.getUsername())
            .active(account.getActive())
            .sip(mapSipDto(account.getSip()))
            .build();
    }

    public CreateAccountDto mapCreateAccountDto(CreateAccountRequest account) {
        return CreateAccountDto.builder()
            .user(account.getUser())
            .username(account.getUsername())
            .active(account.getActive())
            .sip(mapSipDto(account.getSip()))
            .build();
    }

    public AccountResponse mapAccountResponse(AccountDto account) {
        return AccountResponse.builder()
            .id(account.getId())
            .user(account.getUser())
            .username(account.getUsername())
            .active(account.getActive())
            .sip(mapSipResponse(account.getSip()))
            .build();
    }

    public SipDto mapSipDto(SipRequest sip) {
        return SipDto.builder()
            .username(sip.getUsername())
            .password(sip.getPassword())
            .domain(sip.getDomain())
            .proxy(sip.getProxy())
            .build();
    }

    public SipResponse mapSipResponse(SipDto sip) {
        return SipResponse.builder()
            .username(sip.getUsername())
            .password(sip.getPassword())
            .domain(sip.getDomain())
            .proxy(sip.getProxy())
            .build();
    }

    public Account mapAccount(UpdateAccountDto account) {
        return Account.builder()
            .id(account.getId())
            .username(account.getUsername())
            .active(account.getActive())
            .sip(mapSip(account.getSip()))
            .build();
    }

    public Account mapAccount(CreateAccountDto account) {
        return Account.builder()
            .user(account.getUser())
            .username(account.getUsername())
            .active(account.getActive())
            .sip(mapSip(account.getSip()))
            .build();
    }

    public AccountDto mapAccountDto(Account account) {
        return AccountDto.builder()
            .id(account.getId())
            .user(account.getUser())
            .username(account.getUsername())
            .active(account.getActive())
            .sip(mapSipDto(account.getSip()))
            .build();
    }

    public Sip mapSip(SipDto sip) {
        return Sip.builder()
            .username(sip.getUsername())
            .password(sip.getPassword())
            .domain(sip.getDomain())
            .proxy(sip.getProxy())
            .build();
    }

    public SipDto mapSipDto(Sip sip) {
        return SipDto.builder()
            .username(sip.getUsername())
            .password(sip.getPassword())
            .domain(sip.getDomain())
            .proxy(sip.getProxy())
            .build();
    }

}
