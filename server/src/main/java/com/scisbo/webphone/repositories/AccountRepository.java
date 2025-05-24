package com.scisbo.webphone.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.models.Account;

public interface AccountRepository extends MongoRepository<Account, String>, CustomAccountRepository {

    String ENTITY_NAME = "account";

    /**
     * Retrieves an account by its identifier.
     *
     * @param id the account's identifier
     * @return a {@link Account} object
     * @throws EntityNotFoundException if no account is found by the given identifier
     * */
    default Account getById(String id) {
        return findById(id)
            .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, "id", id));
    }

    /**
     * Retrieves a single account for the specified user.
     *
     * @param user the account's user identifier
     * @return a {@link Account} object
     * @throws EntityNotFoundException if no account is found for the given user
     * */
    default Account getByUser(String user) {
        return findByUser(user).stream().findAny()
            .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, "user", user));
    }

    /**
     * Retrieves all accounts associated with the given user.
     *
     * @param user the user identifier
     * @return list of {@link Account} objects
     * */
    List<Account> findByUser(String user);

    /**
     * Retrieves all accounts associated with the given SIP username.
     *
     * @param username the SIP username
     * @return list of {@link Account} objects
     * */
    List<Account> findBySipUsername(String username);

    /**
     * Retrieves all accounts ordered by username in ascending order.
     *
     * @param pageable the pagination information
     * @return a page of {@link Account} objects
     * */
    @Query("select a from Account a order by a.username asc")
    Page<Account> findAllOrderByUsername(Pageable pageable);

}
