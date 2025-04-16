package com.scisbo.webphone.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.scisbo.webphone.models.HistoryRecord;

public interface HistoryRepository extends MongoRepository<HistoryRecord, String> {

    public static final String ENTITY_NAME = "history record";

    /**
     * Retrieves a paginated list of history records for the specified user, 
     * ordered by call start date and time in descending order.
     *
     * @param user      the user's identifier
     * @param pageable  the pagination information
     * @returns a page of {@link HistoryRecord} objects
     * */
    Page<HistoryRecord> findByUserOrderByStartDateDesc(String user, Pageable pageable);

    /**
     * Retrieves a paginated list of history records for the specified user,
     * where the call number is in the provided list. Results are ordered by
     * call start date and time in descending order.
     *
     * @param user      the user's identifier
     * @param numbers   a list of call numbers to match
     * @param pageable  the pagination information
     * @returns a page of {@link HistoryRecord} objects
     * */
    Page<HistoryRecord> findByUserAndNumberInOrderByStartDateDesc(String user, List<String> numbers, Pageable pageable);

    /**
     * Deletes all history records associated with the specified user.
     *
     * @param user  the user's identifier
     * */
    void deleteByUser(String user);

}
