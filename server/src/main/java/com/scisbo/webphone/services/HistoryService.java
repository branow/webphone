package com.scisbo.webphone.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.dtos.service.ContactSummaryDto;
import com.scisbo.webphone.dtos.service.CreateHistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordDto;
import com.scisbo.webphone.dtos.service.HistoryRecordSummaryDto;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.mappers.HistoryMapper;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.HistoryRecord;
import com.scisbo.webphone.repositories.ContactRepository;
import com.scisbo.webphone.repositories.HistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository repository;
    private final HistoryMapper mapper;
    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    /**
     * Retrieves a paginated list of history records DTOs for the specified user,
     * ordered by call start date and time in descending order.
     *
     * @param user      the user's identifier
     * @param pageable  the pagination information
     * @returns a page of {@link HistoryRecordDto} objects
     * */
    public Page<HistoryRecordDto> getPageByUser(String user, Pageable pageable) {
        Page<HistoryRecord> history = this.repository.findByUserOrderByStartDateDesc(user, pageable);
        List<Contact> contacts = this.contactRepository.findByUser(user);

        return history.map(record ->
            mapper.mapHistoryRecordDto(
                record,
                findContactSummaryByNumber(record.getNumber(), contacts)
            )
        );
    }

    /**
     * Retrieves a paginated list of history records summary DTOs for 
     * the specified user, filtered by contact id. Results are ordered 
     * by call start date and time in descending order.
     *
     * @param user      the user's identifier
     * @param contactId the contact's identifier
     * @param pageable  the pagination information
     * @returns a page of {@link HistoryRecordSummaryDto} objects
     * */
    public Page<HistoryRecordSummaryDto> getPageSummaryByContactId(
        String user, String contactId, Pageable pageable
    ) {
        List<String> numbers = this.contactRepository.getById(contactId)
            .getNumbers()
            .stream()
            .map(Number::getNumber)
            .toList();
        return this.repository.findByUserAndNumberInOrderByStartDateDesc(user, numbers, pageable)
           .map(this.mapper::mapHistoryRecordSummaryDto);
    }

    /**
     * Adds new history record.
     *
     * @param createDto the data for the new history record
     * @return the created {@link HistoryRecordDto}
     * */
    public HistoryRecordDto create(CreateHistoryRecordDto createDto) {
        HistoryRecord record = this.repository.save(this.mapper.mapHistoryRecord(createDto));
        ContactSummaryDto contact = findContactSummaryByNumber(
            record.getNumber(),
            this.contactRepository.findByUser(createDto.getUser())
        );
        return this.mapper.mapHistoryRecordDto(record, contact);
    }

    /**
     * Deletes all history records associated with the specified user.
     *
     * @param user the user's identifier
     * */
    public void deleteByUser(String user) {
        this.repository.deleteByUser(user);
    }

    /**
     * Deletes a history record by its identifier.
     *
     * @param id the history record's identifier
     * */
    public void deleteById(String id) {
        this.repository.deleteById(id);
    }

    private ContactSummaryDto findContactSummaryByNumber(String number, List<Contact> contacts) {
        return contacts.stream()
            .filter(c -> c.hasNumber(number))
            .findFirst()
            .map(this.contactMapper::mapContactSummaryDto)
            .orElse(null);
    }

}
