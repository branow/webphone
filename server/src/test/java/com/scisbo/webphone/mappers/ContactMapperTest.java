package com.scisbo.webphone.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.service.ContactDetailsDto;
import com.scisbo.webphone.dtos.service.ContactDto;
import com.scisbo.webphone.dtos.service.ContactSummaryDto;
import com.scisbo.webphone.dtos.service.CreateContactDto;
import com.scisbo.webphone.dtos.service.NumberDto;
import com.scisbo.webphone.dtos.service.UpdateContactDto;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.NumberType;
import com.scisbo.webphone.models.converters.NumberTypeConverter;

@SpringJUnitConfig({ ContactMapper.class, NumberTypeConverter.class })
public class ContactMapperTest {

    @Autowired
    private ContactMapper mapper;

    @Test
    public void testMapContact_update() {
        var dto = UpdateContactDto.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(List.of(
                NumberDto.builder().type("work").number("number").build()
            ))
            .build();

        var expected = Contact.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(List.of(
                Number.builder().type(NumberType.WORK).number("number").build()
            ))
            .build();

        var actual = this.mapper.mapContact(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapContact_create() {
        var dto = CreateContactDto.builder()
            .user("user")
            .name("name")
            .bio("bio")
            .numbers(List.of(
                NumberDto.builder().type("work").number("number").build()
            ))
            .build();

        var expected = Contact.builder()
            .user("user")
            .name("name")
            .bio("bio")
            .numbers(List.of(
                Number.builder().type(NumberType.WORK).number("number").build()
            ))
            .build();

        var actual = this.mapper.mapContact(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapContactDetailsDto() {
        var dto = Contact.builder()
            .id("id")
            .user("user")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(List.of(
                Number.builder().type(NumberType.WORK).number("number").build()
            ))
            .build();

        var expected = ContactDetailsDto.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(List.of(
                NumberDto.builder().type("work").number("number").build()
            ))
            .build();

        var actual = this.mapper.mapContactDetailsDto(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapContactDto() {
        var dto = Contact.builder()
            .id("id")
            .user("user")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(List.of(
                Number.builder().type(NumberType.WORK).number("number").build()
            ))
            .build();

        var expected = ContactDto.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .numbers(List.of(
                NumberDto.builder().type("work").number("number").build()
            ))
            .build();

        var actual = this.mapper.mapContactDto(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapContactSummaryDto() {
        var dto = Contact.builder()
            .id("id")
            .user("user")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(List.of(
                Number.builder().type(NumberType.WORK).number("number").build()
            ))
            .build();

        var expected = ContactSummaryDto.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .build();

        var actual = this.mapper.mapContactSummaryDto(dto);
        assertEquals(expected, actual);
    }

}
