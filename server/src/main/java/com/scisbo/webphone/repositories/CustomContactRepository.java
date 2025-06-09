package com.scisbo.webphone.repositories;

import org.springframework.data.domain.Page;

import com.scisbo.webphone.models.Contact;
import org.springframework.data.domain.Pageable;

public interface CustomContactRepository {

    /**
     * Retrieves the contact for the user by number.
     *
     * @param user   the contact's user
     * @param number the contact's number
     * @return a {@link Contact} object
     * @throws EntityNotFoundException if no contact is found for the given user 
     *         by the number
     * */
    Contact getByNumber(String user, String number);

    /**
     * Searches contacts for the specified user using a case-insensitive 
     * keyword search across the fields: {@code name}, {@code bio}, 
     * and {@code numbers.number}.
     * Returns a paginated list of contacts ordered by contact name.
     *
     * @param user      the user's identifier
     * @param keyword   the search keyword
     * @param pageable  the pagination information
     * @return a page of {@link Contact} objects
     * */
    Page<Contact> findByUserAndKeywordOrderByName(String user, String keyword, Pageable pageable);

}
