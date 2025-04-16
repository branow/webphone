package com.scisbo.webphone.repositories;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collection;
import java.util.List;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.common.data.TestDataUtils;
import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.common.mongodb.EmbeddedMongoDbIT;
import com.scisbo.webphone.models.Photo;

@EnableMongoRepositories
@SpringJUnitConfig(PhotoRepository.class)
public class PhotoRepositoryIT extends EmbeddedMongoDbIT {

    private static String COLLECTION = "photoes";

    @Autowired
    private MongoTemplate template;

    @Autowired
    private PhotoRepository repository;

    @Test
    public void testFindById() {
        Collection<Document> photoes = this.template.insert(TestDataUtils.photos(), COLLECTION);

        Photo expected = photoes.stream().map(TestObjectsUtils::mapPhoto).toList().get(2);
        Photo actual = this.repository.findById(expected.getId()).orElseThrow();

        assertEquals(expected.getId(), actual.getId());
        assertArrayEquals(expected.getImage().getData(), actual.getImage().getData());
    }

    @Test
    public void testInsert() {
        Photo photo = TestDataUtils.photos().stream()
            .map(TestObjectsUtils::mapPhoto)
            .findAny()
            .orElseThrow();

        photo.setId(null);

        Photo savedPhoto = this.repository.insert(photo);
        assertNotNull(savedPhoto.getId());
        assertTrue(photo == savedPhoto);
    }

    @Test
    public void testDeleteById() {
        String id = "14a7c1a78b9c1a3a0f1e3b03";

        Collection<Document> photoes = this.template.insert(TestDataUtils.photos(), COLLECTION);

        List<String> expected = photoes.stream()
            .map(TestObjectsUtils::mapPhoto)
            .filter(p -> !p.getId().equals(id))
            .map(Photo::getId)
            .toList();

        this.repository.deleteById(id);

        List<String> actual = this.template.findAll(Photo.class, COLLECTION).stream()
            .map(Photo::getId)
            .toList();

        assertEquals(expected, actual);
    }

}
