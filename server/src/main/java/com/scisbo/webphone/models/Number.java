package com.scisbo.webphone.models;

import org.springframework.data.convert.ValueConverter;

import com.scisbo.webphone.models.converters.NumberTypeConverter;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Number {

    @ValueConverter(NumberTypeConverter.class)
    NumberType type;

    String number;

}
