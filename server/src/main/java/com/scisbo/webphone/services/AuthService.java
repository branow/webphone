package com.scisbo.webphone.services;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.HistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ContactRepository contactRepository;
    private final HistoryRepository historyRepository;

    public boolean canDeleteRecord(String userId, String recordId) {
        return isRecordOwner(userId, recordId);
    }

    public boolean canGetContact(String userId, String contactId) {
        return isContactOwner(userId, contactId);
    }

    public boolean canUpdateContact(String userId, String contactId) {
        return isContactOwner(userId, contactId);
    }

    public boolean canDeleteContact(String userId, String contactId) {
        return isContactOwner(userId, contactId);
    }

    private boolean isContactOwner(String userId, String contactId) {
        String contactUserId = this.contactRepository.getById(contactId).getUser();
        return Objects.equals(userId, contactUserId);
    }

    private boolean isRecordOwner(String userId, String recordId) {
        String recordUserId = this.historyRepository.getById(recordId).getUser();
        return Objects.equals(userId, recordUserId);
    }

}
