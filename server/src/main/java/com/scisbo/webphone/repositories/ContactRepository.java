package com.scisbo.webphone.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.models.Contact;

public interface ContactRepository extends MongoRepository<Contact, String> {

    public static final String ENTITY_NAME = "contact";

    /**
     * Retrieves the contact by its identifier.
     *
     * @param id the contact's identifier
     * @returns a {@link Contact} object
     * @throws EntityNotFoundException if no contact is found by the given identifier
     * */
    default Contact getById(String id) {
        return findById(id)
            .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, "id", id));
    }

    /**
     * Retrieves a paginated list of contacts for the specified user, 
     * ordered by contact name.
     *
     * @param user      the user's identifier
     * @param pageable  the pagination information
     * @returns a page of {@link Contact} objects
     * */
    Page<Contact> findByUserOrderByName(String user, Pageable pageable);

    /**
     * Retrieves all contacts for the specified user.
     *
     * @param user      the user's identifier
     * @returns a list of {@link Contact} objects
     * */
    List<Contact> findByUser(String user);

}
