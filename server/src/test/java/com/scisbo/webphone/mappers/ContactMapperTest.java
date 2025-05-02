package com.scisbo.webphone.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.controller.request.CreateContactRequest;
import com.scisbo.webphone.dtos.controller.request.NumberRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateContactRequest;
import com.scisbo.webphone.dtos.controller.response.ContactDetailsResponse;
import com.scisbo.webphone.dtos.controller.response.ContactResponse;
import com.scisbo.webphone.dtos.controller.response.ContactSummaryResponse;
import com.scisbo.webphone.dtos.controller.response.NumberResponse;
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

@SpringJUnitConfig({
    ContactMapper.class,
    PageMapper.class,
    NumberTypeConverter.class,
})
public class ContactMapperTest {

    @Autowired
    private ContactMapper mapper;

    @Test
    public void testMapUpdateContactDto() {
        var id = "id";

        var req = UpdateContactRequest.builder()
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(
                List.of(NumberRequest.builder().type("work").number("1111").build())
            )
            .build();

        var expected = UpdateContactDto.builder()
            .id(id)
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(
                List.of(NumberDto.builder().type("work").number("1111").build())
            )
            .build();

        var actual = this.mapper.mapUpdateContactDto(req, id);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapCreateContactDto() {
        var user = "user";

        var req = CreateContactRequest.builder()
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(
                List.of(NumberRequest.builder().type("work").number("1111").build())
            )
            .build();

        var expected = CreateContactDto.builder()
            .user(user)
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(
                List.of(NumberDto.builder().type("work").number("1111").build())
            )
            .build();

        var actual = this.mapper.mapCreateContactDto(req, user);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapContactDetailsResponse() {
        var dto = ContactDetailsDto.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(
                List.of(NumberDto.builder().type("work").number("1111").build())
            )
            .build();

        var expected = ContactDetailsResponse.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .bio("bio")
            .numbers(
                List.of(NumberResponse.builder().type("work").number("1111").build())
            )
            .build();

        var actual = this.mapper.mapContactDetailsResponse(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapContactResponse() {
        var dto = ContactDto.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .numbers(
                List.of(NumberDto.builder().type("work").number("1111").build())
            )
            .build();

        var expected = ContactResponse.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .numbers(
                List.of(NumberResponse.builder().type("work").number("1111").build())
            )
            .build();

        var actual = this.mapper.mapContactResponse(dto);
        assertEquals(expected, actual);
    }

    @Test
    public void testMapContactSummaryResponse() {
        var dto = ContactSummaryDto.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .build();

        var expected = ContactSummaryResponse.builder()
            .id("id")
            .name("name")
            .photo("photo")
            .build();

        var actual = this.mapper.mapContactSummaryResponse(dto);
        assertEquals(expected, actual);
    }

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
