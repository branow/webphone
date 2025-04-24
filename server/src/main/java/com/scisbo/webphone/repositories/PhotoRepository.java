package com.scisbo.webphone.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.models.Photo;

public interface PhotoRepository extends MongoRepository<Photo, String> {

    public static final String ENTITY_NAME = "photo";

    /**
     * Retrieves a photo by its identifier.
     *
     * @param id the photo's identifier
     * @returns a {@link Photo} object
     * @throws EntityNotFoundException if photo is not found by the given identifier
     * */
    default Photo getById(String id) {
        return findById(id)
            .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, "id", id));
    }

}
