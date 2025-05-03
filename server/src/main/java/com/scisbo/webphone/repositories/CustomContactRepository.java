package com.scisbo.webphone.repositories;

import org.springframework.data.domain.Page;

import com.scisbo.webphone.models.Contact;
import org.springframework.data.domain.Pageable;

public interface CustomContactRepository {

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
