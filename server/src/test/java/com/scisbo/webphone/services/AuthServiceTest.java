package com.scisbo.webphone.services;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.HistoryRepository;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.models.Contact;

@SpringJUnitConfig(AuthService.class)
public class AuthServiceTest {

    @Autowired
    private AuthService service;

    @MockitoBean
    private ContactRepository contactRepository;

    @MockitoBean
    private HistoryRepository historyRepository;

    @Test
    public void testBeanName(@Autowired ApplicationContext ctx) {
        ctx.getBean("authService");
    }

    @Test
    public void testCanDeleteRecord() {
        testIsRecordOwner(this.service::canDeleteRecord);
    }

    @Test
    public void testCanGetContact() {
        testIsContactOwner(this.service::canGetContact);
    }

    @Test
    public void testCanUpdateContact() {
        testIsContactOwner(this.service::canUpdateContact);
    }

    @Test
    public void testCanDeleteContact() {
        testIsContactOwner(this.service::canDeleteContact);
    }

    private void testIsContactOwner(Check check) {
        String userId = "user1", contactId = "contact1";
        when(this.contactRepository.findById(contactId))
            .thenReturn(Optional.of(Contact.builder().user("unknown").build()));
        assertFalse(check.canDo(userId, contactId));

        when(this.contactRepository.findById(contactId))
            .thenReturn(Optional.of(Contact.builder().user(userId).build()));
        assertTrue(check.canDo(userId, contactId));
    }

    private void testIsRecordOwner(Check check) {
        String userId = "user1", recordId = "record1";
        when(this.historyRepository.findById(recordId))
            .thenReturn(Optional.of(HistoryRecord.builder().user("unknown").build()));
        assertFalse(check.canDo(userId, recordId));

        when(this.historyRepository.findById(recordId))
            .thenReturn(Optional.of(HistoryRecord.builder().user(userId).build()));
        assertTrue(check.canDo(userId, recordId));
    }

    interface Check {
        boolean canDo(String userId, String resourceId);
    }

}
