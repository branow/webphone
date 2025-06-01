package com.scisbo.webphone.services;

import java.util.Objects;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.models.Account;
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
    public boolean canRetrieveActiveAccount(JwtAuthenticationToken auth, String userId) {
        return canRetrieveAccountInfo(auth, userId);
    }

    @LogAfter("Checked contacts retrieve permission: user=#{#auth.name}, contactsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check contacts retrieve permission [#{#error.toString()}")
    public boolean canRetrieveContacts(JwtAuthenticationToken auth, String userId) {
        return canRetrieveAccountInfo(auth, userId);
    }

    @LogAfter("Checked contact retrieve permission: user=#{#auth.name}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check contact retrieve permission [#{#error.toString()}")
    public boolean canRetrieveContact(JwtAuthenticationToken auth, String contactId) {
        return this.contactRepository.findById(contactId)
            .map(contact -> canRetrieveAccountInfo(auth, contact.getUser()))
            .orElse(false);
    }

    @LogAfter("Checked contact create permission: user=#{#auth.name}, contactUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check contact create permission [#{#error.toString()}")
    public boolean canCreateContact(JwtAuthenticationToken auth, String userId) {
        return canModifyAccountInfo(auth, userId);
    }

    @LogAfter("Checked contact update permission: user=#{#auth.name}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check contact udpate permission [#{#error.toString()}")
    public boolean canUpdateContact(JwtAuthenticationToken auth, String contactId) {
        return canModifyContact(auth, contactId);
    }

    @LogAfter("Checked contact delete permission: user=#{#auth.name}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check contact delete permission [#{#error.toString()}")
    public boolean canDeleteContact(JwtAuthenticationToken auth, String contactId) {
        return canModifyContact(auth, contactId);
    }

    private boolean canModifyContact(JwtAuthenticationToken auth, String contactId) {
        return this.contactRepository.findById(contactId)
            .map(contact -> canModifyAccountInfo(auth, contact.getUser()))
            .orElse(false);
    }

    @LogAfter("Checked records retrieve permission: user=#{#auth.name}, recordsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check records retrieve permission [#{#error.toString()}")
    public boolean canRetrieveRecords(JwtAuthenticationToken auth, String userId) {
        return canRetrieveAccountInfo(auth, userId);
    }

    @LogAfter("Checked contact records retrieve permission: user=#{#auth.name}, recordsUser=#{#userId}, contact=#{#contactId} result=#{#result}")
    @LogError("Failed to check contact records retrieve permission [#{#error.toString()}")
    public boolean canRetrieveContactRecords(JwtAuthenticationToken auth, String userId, String contactId) {
        return canRetrieveRecords(auth, userId) && canRetrieveContact(auth, contactId);
    }

    @LogAfter("Checked record create permission: user=#{#auth.name}, recordsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check record create permission [#{#error.toString()}")
    public boolean canCreateRecord(JwtAuthenticationToken auth, String userId) {
        return canRetrieveAccountInfo(auth, userId);
    }

    @LogAfter("Checked records delete permission: user=#{#auth.name}, recordsUser=#{#userId}, result=#{#result}")
    @LogError("Failed to check records delete permission [#{#error.toString()}")
    public boolean canDeleteRecords(JwtAuthenticationToken auth, String userId) {
        return canModifyAccountInfo(auth, userId);
    }

    @LogAfter("Checked record delete permission: user=#{#auth.name}, record=#{#recordId}, result=#{#result}")
    @LogError("Failed to check record delete permission [#{#error.toString()}")
    public boolean canDeleteRecord(JwtAuthenticationToken auth, String recordId) {
        return this.historyRepository.findById(recordId)
            .map(record -> canModifyAccountInfo(auth, record.getUser()))
            .orElse(false);
    }

    @LogAfter("Checked if user has an active admin account: user=#{#auth.name}, result=#{#result}")
    @LogError("Failed to check if user has an active admin account [#{#error.toString()}")
    public boolean hasAdminAccount(JwtAuthenticationToken auth) {
        return hasAccount(auth) && isAdmin(auth);
    }

    private boolean canRetrieveAccountInfo(JwtAuthenticationToken auth, String userId) {
        return this.accountRepository.findByUser(userId)
            .map(account -> isActive(account) && (isDefault(account) || isAccountOwner(auth, account)))
            .orElse(false);
    }

    private boolean canModifyAccountInfo(JwtAuthenticationToken auth, String userId) {
        if (!hasAccount(auth)) return false;
        return this.accountRepository.findByUser(userId)
            .map(account -> (isAdmin(auth) && isDefault(account)) || isAccountOwner(auth, account))
            .orElse(false);
    }

    private boolean isAdmin(JwtAuthenticationToken auth) {
        return "admin".equals(auth.getTokenAttributes().get("preferred_username"));
    }

    private boolean hasAccount(JwtAuthenticationToken auth) {
        return this.accountRepository.findByUser(auth.getName())
            .filter(Account::getActive)
            .isPresent();
    }

    private boolean isActive(Account account) {
        return account.getActive();
    }

    private boolean isAccountOwner(JwtAuthenticationToken auth, Account account) {
        return Objects.equals(auth.getName(), account.getUser());
    }

    private boolean isDefault(Account account) {
        return isOwner(DEFAULT_USER, account);
    }

    private boolean isOwner(String userId, Account account) {
        return Objects.equals(userId, account.getUser());
    }

}
