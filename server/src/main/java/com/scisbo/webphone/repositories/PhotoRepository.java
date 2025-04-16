package com.scisbo.webphone.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.scisbo.webphone.models.Photo;

public interface PhotoRepository extends MongoRepository<Photo, String> {

    public static final String ENTITY_NAME = "photo";

}
