package com.scisbo.webphone.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.scisbo.webphone.models.Account;

public interface CustomAccountRepository {

    /**
     * Performs a case-insensitive keyword search across the fields:
     * {@code user}, {@code username}, and {@code sip.username}.
     * Results are paginated and ordered by account username.
     *
     * @param keyword   the search keyword
     * @param pageable  pagination details
     * @return a page of matching {@link Account} objects
     */
    Page<Account> findByKeywordOrderByUsername(String keyword, Pageable pageable);

}
