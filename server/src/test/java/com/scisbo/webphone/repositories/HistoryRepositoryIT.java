package com.scisbo.webphone.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.common.data.TestDataUtils;
import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.common.mongodb.EmbeddedMongoDbAbstractIT;
import com.scisbo.webphone.models.CallStatus;
import com.scisbo.webphone.models.HistoryRecord;

@EnableMongoRepositories
@SpringJUnitConfig(HistoryRepository.class)
public class HistoryRepositoryIT extends EmbeddedMongoDbAbstractIT {

    private static String COLLECTION = "history";

    @Autowired
    private MongoTemplate template;
    @Autowired
    private HistoryRepository repository;

    @Test
    public void testFindAll() {
        Collection<Document> history = this.template.insert(TestDataUtils.history(), COLLECTION);
        List<HistoryRecord> expected = history.stream()
            .map(TestObjectsUtils::mapHistoryRecord)
            .toList();

        List<HistoryRecord> actual = this.repository.findAll();
        assertEquals(expected, actual);
    }

    @ParameterizedTest
    @MethodSource("provideTestFindByUserByOrderByStartDate")
    public void testFindByUserByOrderByStartDate(String user, int page, int size) {
        Collection<Document> history = this.template.insert(TestDataUtils.history(), COLLECTION);

        List<HistoryRecord> records = history.stream()
            .map(TestObjectsUtils::mapHistoryRecord)
            .filter(r -> r.getUser().equals(user))
            .sorted((r1, r2) -> r2.getStartDate().compareTo(r1.getStartDate()))
            .toList();

        List<HistoryRecord> pageRecords = records.stream()
            .skip(page * size)
            .limit(size)
            .toList();
        
        Page<HistoryRecord> expected = new PageImpl<>(pageRecords, PageRequest.of(page, size), records.size());
        Page<HistoryRecord> actual = this.repository.findByUserOrderByStartDateDesc(user, PageRequest.of(page, size));

        assertEquals(expected.getSize(), actual.getSize());
        assertEquals(expected.getTotalPages(), actual.getTotalPages());
        assertEquals(expected.getNumber(), actual.getNumber());
        assertEquals(expected.toList(), actual.toList());
    }

    private static Stream<Arguments> provideTestFindByUserByOrderByStartDate() {
        return Stream.of(
            Arguments.of("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0", 1, 3),
            Arguments.of("02bc7a0b-eb45-4a86-aa6f-0979db7a6e64", 0, 10),
            Arguments.of("2938c3e9-dad9-4258-9806-968a05fc3be5", 0, 2),
            Arguments.of("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0", 4, 2),
            Arguments.of("02bc7a0b-eb45-4a86-aa6f-0979db7a6e64", 3, 4),
            Arguments.of("2938c3e9-dad9-4258-9806-968a05fc3be5", 5, 5)
        );
    }

    @ParameterizedTest
    @MethodSource("provideTestFindByUserAndNumberInByOrderByStartDate")
    public void testFindByUserAndNumberInByOrderByStartDate(
        String user, List<String> numbers, int page, int size
    ) {
        Collection<Document> history = this.template.insert(TestDataUtils.history(), COLLECTION);

        List<HistoryRecord> records = history.stream()
            .map(TestObjectsUtils::mapHistoryRecord)
            .filter(r -> r.getUser().equals(user))
            .filter(r -> numbers.contains(r.getNumber()))
            .sorted((r1, r2) -> r2.getStartDate().compareTo(r1.getStartDate()))
            .toList();

        List<HistoryRecord> pageRecords = records.stream()
            .skip(page * size)
            .limit(size)
            .toList();

        Page<HistoryRecord> expected = new PageImpl<>(pageRecords, PageRequest.of(page, size), records.size());
        Page<HistoryRecord> actual = this.repository.findByUserAndNumberInOrderByStartDateDesc(
            user, numbers, PageRequest.of(page, size)
        );

        assertEquals(expected.getSize(), actual.getSize());
        assertEquals(expected.getTotalPages(), actual.getTotalPages());
        assertEquals(expected.getNumber(), actual.getNumber());
        assertEquals(expected.toList(), actual.toList());
    }

    private static Stream<Arguments> provideTestFindByUserAndNumberInByOrderByStartDate() {
        return Stream.of(
            Arguments.of("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0", List.of("12345", "67801", "67890"), 0, 1),
            Arguments.of("2938c3e9-dad9-4258-9806-968a05fc3be5", List.of("44556", "34567", "23456"), 0, 2),
            Arguments.of("02bc7a0b-eb45-4a86-aa6f-0979db7a6e64", List.of("11223", "45678", "23456"), 0, 3)
        );
    }

    @Test
    public void testInsert() {
        HistoryRecord record = HistoryRecord.builder()
            .number("123421")
            .user("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0")
            .status(CallStatus.OUTCOMING)
            .startDate(LocalDateTime.now())
            .build();
        HistoryRecord savedRecord = this.repository.insert(record);
        assertNotNull(savedRecord.getId());
        assertTrue(record == savedRecord);
    }


    @ParameterizedTest
    @MethodSource("provideTestDeleteByUser")
    public void testDeleteByUser(String user) {
        Collection<Document> history = this.template.insert(TestDataUtils.history(), COLLECTION);

        List<HistoryRecord> expected = history.stream()
            .map(TestObjectsUtils::mapHistoryRecord)
            .filter(r -> !r.getUser().equals(user))
            .toList();

        this.repository.deleteByUser(user);

        List<HistoryRecord> actual = this.template.findAll(HistoryRecord.class, COLLECTION);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestDeleteByUser() {
        return Stream.of(
            Arguments.of("2938c3e9-dad9-4258-9806-968a05fc3be5"),
            Arguments.of("02bc7a0b-eb45-4a86-aa6f-0979db7a6e64"),
            Arguments.of("f96a24d5-f4c7-418a-81b1-54e29d8dc7b0"),
            Arguments.of("096a24d5-f4c7-418a-81b1-54e29d8dc7b0") // doesn't exist
        );
    }

    @ParameterizedTest
    @MethodSource("provideTestDeleteById")
    public void testDeleteById(String id) {
        Collection<Document> history = this.template.insert(TestDataUtils.history(), COLLECTION);

        List<HistoryRecord> expected = history.stream()
            .map(TestObjectsUtils::mapHistoryRecord)
            .filter(r -> !r.getId().equals(id))
            .toList();

        this.repository.deleteById(id);

        List<HistoryRecord> actual = this.template.findAll(HistoryRecord.class, COLLECTION);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestDeleteById() {
        return Stream.of(
            Arguments.of("60f5b6486f1c2d4e2f3e8fa5"),
            Arguments.of("60f5b6486f1c2d4e2f3e8fa6"),
            Arguments.of("60f5b6486f1c2d4e2f3e8fa0"),
            Arguments.of("f96a24d581b154e29d8dc7b0") // doesn't exist
        );
    }

}
