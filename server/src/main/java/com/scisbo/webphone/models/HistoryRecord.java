package com.scisbo.webphone.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.convert.ValueConverter;
import org.springframework.data.mongodb.core.mapping.Document;

import com.scisbo.webphone.models.converters.CallStatusConverter;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document("history")
public class HistoryRecord {

    @Id
    String id;

    String number;

    String user;

    @ValueConverter(CallStatusConverter.class)
    CallStatus status;

    Date startDate;

    Date endDate;

}
