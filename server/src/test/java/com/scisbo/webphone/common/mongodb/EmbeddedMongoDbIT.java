package com.scisbo.webphone.common.mongodb;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

public class EmbeddedMongoDbIT extends EmbeddedMongoDbAbstractIT {

    @Test
    void test(@Autowired MongoTemplate template) {
        Document doc = new Document("key", "value");
        template.save(doc, "collection");
        List<Document> found = template.findAll(Document.class, "collection");
        assertEquals(1, found.size());
        assertEquals("value", found.get(0).getString("key"));
    }

}
