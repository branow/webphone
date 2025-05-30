package com.scisbo.webphone.services;

import java.util.Objects;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.repositories.AccountRepository;
import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.HistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEFAULT_USER = "default";

    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;
    private final HistoryRepository historyRepository;

    @LogAfter("Checked account retrieve permission: user=#{#auth.name}, accountUser=#{#user}, result=#{#result}")
    @LogError("Failed to check account retrieve permission [#{#error.toString()}")
    public boolean canRetrieveAccount(JwtAuthenticationToken auth, String userId) {
        return this.accountRepository.findByUser(userId)
            .stream()
            .findAny()
            .map(account -> isDefaultAccount(account)
                || isAccountOwner(auth.getName(), account)
                || isAdmin(auth))
            .orElse(false);
    }

    @LogAfter("Checked contacts retrieve permission: user=#{#auth.name}, contactsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check contacts retrieve permission [#{#error.toString()}")
    public boolean canRetrieveContacts(JwtAuthenticationToken auth, String userId) {
        return isDefaultUser(userId) || isSameUser(auth, userId);
    }

    @LogAfter("Checked contact retrieve permission: user=#{#auth.name}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check contact retrieve permission [#{#error.toString()}")
    public boolean canRetrieveContact(JwtAuthenticationToken auth, String contactId) {
        return this.contactRepository.findById(contactId)
            .map(contact -> isDefaultContact(contact) || isContactOwner(auth, contact))
            .orElse(false);
    }

    @LogAfter("Checked contact create permission: user=#{#auth.name}, contactUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check contact create permission [#{#error.toString()}")
    public boolean canCreateContact(JwtAuthenticationToken auth, String userId) {
        if (!hasAccount(auth)) return false;
        return (isAdmin(auth) && isDefaultUser(userId)) || isSameUser(auth, userId);
    }

    @LogAfter("Checked contact update permission: user=#{#auth.name}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check contact udpate permission [#{#error.toString()}")
    public boolean canUpdateContact(JwtAuthenticationToken auth, String contactId) {
        if (!hasAccount(auth)) return false;
        return this.contactRepository.findById(contactId)
            .map(contact -> (isAdmin(auth) && isDefaultContact(contact)) 
                || isContactOwner(auth, contact))
            .orElse(false);
    }

    @LogAfter("Checked contact delete permission: user=#{#auth.name}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check contact delete permission [#{#error.toString()}")
    public boolean canDeleteContact(JwtAuthenticationToken auth, String contactId) {
        if (!hasAccount(auth)) return false;
        return this.contactRepository.findById(contactId)
            .map(contact -> (isAdmin(auth) && isDefaultContact(contact))
                || isContactOwner(auth, contact))
            .orElse(false);
    }

    @LogAfter("Checked records retrieve permission: user=#{#auth.name}, recordsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check records retrieve permission [#{#error.toString()}")
    public boolean canRetrieveRecords(JwtAuthenticationToken auth, String userId) {
        return isDefaultUser(userId) || isSameUser(auth, userId);
    }

    @LogAfter("Checked contact records retrieve permission: user=#{#auth.name}, recordsUser=#{#userId}, contact=#{#contactId} result=#{#result}")
    @LogError("Failed to check contact records retrieve permission [#{#error.toString()}")
    public boolean canRetrieveContactRecords(JwtAuthenticationToken auth, String userId, String contactId) {
        boolean isContactOwner = this.contactRepository.findById(contactId)
            .map(contact -> isContactOwner(userId, contact))
            .orElse(false);
        return canRetrieveRecords(auth, userId) && isContactOwner;
    }

    @LogAfter("Checked record create permission: user=#{#auth.name}, recordsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check record create permission [#{#error.toString()}")
    public boolean canCreateRecord(JwtAuthenticationToken auth, String userId) {
        return isDefaultUser(userId) || isSameUser(auth, userId);
    }

    @LogAfter("Checked records delete permission: user=#{#auth.name}, recordsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check records delete permission [#{#error.toString()}")
    public boolean canDeleteRecords(JwtAuthenticationToken auth, String userId) {
        if (!hasAccount(auth)) return false;
        return (isAdmin(auth) && isDefaultUser(userId)) || isSameUser(auth, userId);
    }

    @LogAfter("Checked record delete permission: user=#{#auth.name}, record=#{#recordId}, result=#{#result}")
    @LogError("Failed to check record delete permission [#{#error.toString()}")
    public boolean canDeleteRecord(JwtAuthenticationToken auth, String recordId) {
        if (!hasAccount(auth)) return false;
        return this.historyRepository.findById(recordId)
            .map(record ->  (isAdmin(auth) && isDefaultRecord(record))
                || isRecordOwner(auth, record))
            .orElse(false);
    }

    @LogAfter("Checked if user is admin: user=#{#auth.name}, result=#{#result}")
    @LogError("Failed to check if user is admin [#{#error.toString()}")
    public boolean isAdmin(JwtAuthenticationToken auth) {
        return "admin".equals(auth.getTokenAttributes().get("preferred_username"));
    }

    private boolean isDefaultUser(String userId) {
        return Objects.equals(DEFAULT_USER, userId);
    }

    private boolean isSameUser(JwtAuthenticationToken auth, String userId) {
        return Objects.equals(auth.getName(), userId);
    }

    private boolean hasAccount(JwtAuthenticationToken auth) {
        return this.accountRepository.findByUser(auth.getName()).size() > 0;
    }

    private boolean isDefaultAccount(Account account) {
        return isAccountOwner(DEFAULT_USER, account);
    }

    private boolean isDefaultRecord(HistoryRecord record) {
        return isRecordOwner(DEFAULT_USER, record);
    }

    private boolean isDefaultContact(Contact contact) {
        return isContactOwner(DEFAULT_USER, contact);
    }

    private boolean isAccountOwner(String userId, Account account) {
        return Objects.equals(userId, account.getUser());
    }

    private boolean isContactOwner(JwtAuthenticationToken auth, Contact contact) {
        return isContactOwner(auth.getName(), contact);
    }

    private boolean isContactOwner(String userId, Contact contact) {
        return Objects.equals(userId, contact.getUser());
    }

    private boolean isRecordOwner(JwtAuthenticationToken auth, HistoryRecord record) {
        return isRecordOwner(auth.getName(), record);
    }

    private boolean isRecordOwner(String userId, HistoryRecord record) {
        return Objects.equals(userId, record.getUser());
    }

}
