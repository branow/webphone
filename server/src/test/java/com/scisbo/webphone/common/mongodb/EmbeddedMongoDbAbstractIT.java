package com.scisbo.webphone.common.mongodb;

import org.junit.jupiter.api.AfterEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

@SpringJUnitConfig(EmbeddedMongoDbConfig.class)
public abstract class EmbeddedMongoDbAbstractIT {

    @Autowired
    private EmbeddedMongoDb mongodb;

    @AfterEach
    void cleanUp() {
        mongodb.clean();
    }

}
