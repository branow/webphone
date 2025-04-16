package com.scisbo.webphone.common.mongodb;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class EmbeddedMongoDbConfig {

    @Bean(initMethod = "start", destroyMethod = "delete")
    public EmbeddedMongoDb embeddedMongoDb() {
        return new EmbeddedMongoDb();
    }

    @Bean
    public MongoTemplate mongoTemplate(EmbeddedMongoDb mongodb) {
        return mongodb.getTemplate();
    }

}
