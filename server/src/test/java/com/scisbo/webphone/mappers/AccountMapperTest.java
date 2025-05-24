package com.scisbo.webphone.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.controller.request.CreateAccountRequest;
import com.scisbo.webphone.dtos.controller.request.SipRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateAccountRequest;
import com.scisbo.webphone.dtos.controller.response.AccountResponse;
import com.scisbo.webphone.dtos.controller.response.SipResponse;
import com.scisbo.webphone.dtos.service.AccountDto;
import com.scisbo.webphone.dtos.service.CreateAccountDto;
import com.scisbo.webphone.dtos.service.SipDto;
import com.scisbo.webphone.dtos.service.UpdateAccountDto;
import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.models.Sip;

@SpringJUnitConfig(AccountMapper.class)
public class AccountMapperTest {

    @Autowired
    private AccountMapper mapper;

    @Test
    public void testMapUpdateAccounDto() {
        var account = UpdateAccountRequest.builder()
            .username("username")
            .active(true)
            .sip(SipRequest.builder().build())
            .build();

        var expected = UpdateAccountDto.builder()
            .id("id")
            .username("username")
            .active(true)
            .sip(SipDto.builder().build())
            .build();

        var actual = this.mapper.mapUpdateAccountDto(account, "id");
        assertEquals(expected, actual);
    }

    @Test
    public void testMapCreateAccounDto() {
        var account = CreateAccountRequest.builder()
            .user("user")
            .username("username")
            .active(true)
            .sip(SipRequest.builder().build())
            .build();

        var expected = CreateAccountDto.builder()
            .user("user")
            .username("username")
            .active(true)
            .sip(SipDto.builder().build())
            .build();

        var actual = this.mapper.mapCreateAccountDto(account);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapAccountResponse() {
        var account = AccountDto.builder()
            .id("id")
            .user("user")
            .username("username")
            .active(true)
            .sip(SipDto.builder().build())
            .build();

        var expected = AccountResponse.builder()
            .id("id")
            .user("user")
            .username("username")
            .active(true)
            .sip(SipResponse.builder().build())
            .build();

        var actual = this.mapper.mapAccountResponse(account);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapSipDto_request() {
        var sip = SipRequest.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var expected = SipDto.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var actual = this.mapper.mapSipDto(sip);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapSipResponse() {
        var sip = SipDto.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var expected = SipResponse.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var actual = this.mapper.mapSipResponse(sip);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapAccount_update() {
        var account = UpdateAccountDto.builder()
            .id("id")
            .username("username")
            .active(true)
            .sip(SipDto.builder().build())
            .build();

        var expected = Account.builder()
            .id("id")
            .username("username")
            .active(true)
            .sip(Sip.builder().build())
            .build();

        var actual = this.mapper.mapAccount(account);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapAccount_create() {
        var account = CreateAccountDto.builder()
            .user("user")
            .username("username")
            .active(true)
            .sip(SipDto.builder().build())
            .build();

        var expected = Account.builder()
            .user("user")
            .username("username")
            .active(true)
            .sip(Sip.builder().build())
            .build();

        var actual = this.mapper.mapAccount(account);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapAccountDto() {
        var account = Account.builder()
            .id("id")
            .user("user")
            .username("username")
            .active(true)
            .sip(Sip.builder().build())
            .build();

        var expected = AccountDto.builder()
            .id("id")
            .user("user")
            .username("username")
            .active(true)
            .sip(SipDto.builder().build())
            .build();

        var actual = this.mapper.mapAccountDto(account);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapSip() {
        var sip = SipDto.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var expected = Sip.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var actual = this.mapper.mapSip(sip);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapSipDto() {
        var sip = Sip.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var expected = SipDto.builder()
            .username("username")
            .password("password")
            .domain("domain")
            .proxy("proxy")
            .build();

        var actual = this.mapper.mapSipDto(sip);
        assertEquals(expected, actual);
    }

}
