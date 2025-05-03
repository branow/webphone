package com.scisbo.webphone.common.mongodb;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.util.FileSystemUtils;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.ImmutableMongod;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.embed.mongo.types.DatabaseDir;
import de.flapdoodle.embed.process.io.ProcessOutput;
import de.flapdoodle.reverse.TransitionWalker.ReachedState;
import de.flapdoodle.reverse.transitions.Start;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EmbeddedMongoDb {

    private static final String CONNECTING_STRING = "mongodb://%s:%d";

    private static int port = 27018;
    
    private synchronized static int nextPort() {
        return port++;
    }

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private ReachedState<RunningMongodProcess> process;
    private MongoClient client;
    private MongoTemplate template;
    private ServerAddress address;
    private Path dir = null;

    public void start() throws IOException {
        dir = Files.createTempDirectory("mongodb");
        logger.info("Created mongodb dir: {}", dir.toString()); // change

        ImmutableMongod mongod = Mongod.builder()
            .processOutput(Start.to(ProcessOutput.class).initializedWith(ProcessOutput.silent()))
            .net(Start.to(Net.class).initializedWith(Net.defaults().withPort(nextPort())))
            .databaseDir(Start.to(DatabaseDir.class).initializedWith(DatabaseDir.of(dir)))
            .build();
        process = mongod.start(Version.Main.V8_0);
        logger.info("Started mongodb");

        address = process.current().getServerAddress();
        String uri = String.format(CONNECTING_STRING, address.getHost(), address.getPort());
        client = MongoClients.create(uri);
        template = new MongoTemplate(client, "test");
        logger.info("Connected to mongodb: {}", uri);
    }

    public void clean() {
        if (template == null) {
            logger.warn("MongoTemplate is null; skipping cleanup");
            return;
        }

        logger.debug("Started cleaning mongodb");
        for (String collection: template.getCollectionNames()) {
            template.dropCollection(collection);
            logger.debug("Drop collection: {}", collection);
        }
        logger.info("Finished cleaning mongodb");
    }

    public void delete() throws IOException {
        logger.debug("Started deleting mongodb");
        if (process.current().isAlive()) {
            client.close();
            process.current().stop();
            template = null;
            logger.info("Stopped mongodb");
        }
        FileSystemUtils.deleteRecursively(dir);
        logger.debug("Deleted mongodb dir: {}", dir.toString());
    }

    public int getPort() {
        return this.address.getPort();
    }

    public MongoClient getClient() {
        return this.client;
    }

    public MongoTemplate getTemplate() {
        return this.template;
    }

}
