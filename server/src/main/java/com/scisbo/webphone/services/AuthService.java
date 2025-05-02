package com.scisbo.webphone.services;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.HistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ContactRepository contactRepository;
    private final HistoryRepository historyRepository;

    @LogAfter("Checked delete permission: user=#{#userId}, record=#{#recordId}, result=#{#result}")
    @LogError("Failed to check delete permission [#{#error.toString()}")
    public boolean canDeleteRecord(String userId, String recordId) {
        return isRecordOwner(userId, recordId);
    }

    @LogAfter("Checked retrieve permission: user=#{#userId}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check retrieve permission [#{#error.toString()}")
    public boolean canGetContact(String userId, String contactId) {
        return isContactOwner(userId, contactId);
    }

    @LogAfter("Checked update permission: user=#{#userId}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check udpate permission [#{#error.toString()}")
    public boolean canUpdateContact(String userId, String contactId) {
        return isContactOwner(userId, contactId);
    }

    @LogAfter("Checked create permission: user=#{#userId}, contact=#{#contactId}, result=#{#result}")
    @LogError("Failed to check create permission [#{#error.toString()}")
    public boolean canDeleteContact(String userId, String contactId) {
        return isContactOwner(userId, contactId);
    }

    private boolean isContactOwner(String userId, String contactId) {
        String contactUserId = this.contactRepository.findById(contactId)
            .map(Contact::getUser).orElse(null);
        return Objects.equals(userId, contactUserId);
    }

    private boolean isRecordOwner(String userId, String recordId) {
        String recordUserId = this.historyRepository.findById(recordId)
            .map(HistoryRecord::getUser).orElse(null);
        return Objects.equals(userId, recordUserId);
    }

}
