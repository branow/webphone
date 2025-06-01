package com.scisbo.webphone.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.repositories.AccountRepository;
import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.HistoryRepository;

@SpringJUnitConfig(AuthService.class)
public class AuthServiceTest {

    @MockitoBean
    private ContactRepository contactRepository;

    @MockitoBean
    private HistoryRepository historyRepository;

    @MockitoBean
    private AccountRepository accountRepository;

    @Test
    public void testBeanName(@Autowired ApplicationContext ctx) {
        ctx.getBean("authService");
    }

}
