package com.scisbo.webphone.mappers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.dtos.controller.request.CreateContactRequest;
import com.scisbo.webphone.dtos.controller.request.NumberRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateContactRequest;
import com.scisbo.webphone.dtos.controller.response.ContactDetailsResponse;
import com.scisbo.webphone.dtos.controller.response.ContactResponse;
import com.scisbo.webphone.dtos.controller.response.ContactSummaryResponse;
import com.scisbo.webphone.dtos.controller.response.NumberResponse;
import com.scisbo.webphone.dtos.controller.response.PageResponse;
import com.scisbo.webphone.dtos.service.ContactDetailsDto;
import com.scisbo.webphone.dtos.service.ContactDto;
import com.scisbo.webphone.dtos.service.ContactSummaryDto;
import com.scisbo.webphone.dtos.service.CreateContactDto;
import com.scisbo.webphone.dtos.service.NumberDto;
import com.scisbo.webphone.dtos.service.UpdateContactDto;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.Number;
import com.scisbo.webphone.models.converters.NumberTypeConverter;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ContactMapper {

    private final PageMapper pageMapper;
    private final NumberTypeConverter numberTypeConverter;

    public UpdateContactDto mapUpdateContactDto(UpdateContactRequest contact, String id) {
        List<NumberDto> numbers = contact.getNumbers().stream()
            .map(this::mapNumberDto)
            .collect(Collectors.toList());

        return UpdateContactDto.builder()
            .id(id)
            .name(contact.getName())
            .photo(contact.getPhoto())
            .bio(contact.getBio())
            .numbers(numbers)
            .build();
    }

    public CreateContactDto mapCreateContactDto(CreateContactRequest contact) {
        List<NumberDto> numbers = contact.getNumbers().stream()
            .map(this::mapNumberDto)
            .collect(Collectors.toList());

        return CreateContactDto.builder()
            .name(contact.getName())
            .bio(contact.getBio())
            .photo(contact.getPhoto())
            .numbers(numbers)
            .build();
    }

    public NumberDto mapNumberDto(NumberRequest number) {
        return NumberDto.builder()
            .type(number.getType())
            .number(number.getNumber())
            .build();
    }

    public ContactDetailsResponse mapContactDetailsResponse(ContactDetailsDto contact) {
        List<NumberResponse> numbers = contact.getNumbers().stream()
            .map(this::mapNumberResponse)
            .collect(Collectors.toList());

        return ContactDetailsResponse.builder()
            .id(contact.getId())
            .name(contact.getName())
            .photo(contact.getPhoto())
            .bio(contact.getBio())
            .numbers(numbers)
            .build();
    }

    public PageResponse<ContactResponse> mapContactResponse(Page<ContactDto> page) {
        return this.pageMapper.mapPageResponse(page.map(this::mapContactResponse));
    }

    public ContactResponse mapContactResponse(ContactDto contact) {
        List<NumberResponse> numbers = contact.getNumbers().stream()
            .map(this::mapNumberResponse)
            .collect(Collectors.toList());

        return ContactResponse.builder()
            .id(contact.getId())
            .name(contact.getName())
            .photo(contact.getPhoto())
            .numbers(numbers)
            .build();
    }

    public NumberResponse mapNumberResponse(NumberDto number) {
        return NumberResponse.builder()
            .type(number.getType())
            .number(number.getNumber())
            .build();
    }

    public ContactSummaryResponse mapContactSummaryResponse(ContactSummaryDto contact) {
        return ContactSummaryResponse.builder()
            .id(contact.getId())
            .name(contact.getName())
            .photo(contact.getPhoto())
            .build();
    }

    public Contact mapContact(UpdateContactDto contact) {
        return Contact.builder()
            .id(contact.getId())
            .name(contact.getName())
            .photo(contact.getPhoto())
            .bio(contact.getBio())
            .numbers(mapNumber(contact.getNumbers()))
            .build();
    }

    public Contact mapContact(CreateContactDto contact, String user) {
        return Contact.builder()
            .user(user)
            .name(contact.getName())
            .bio(contact.getBio())
            .photo(contact.getPhoto())
            .numbers(mapNumber(contact.getNumbers()))
            .build();
    }

    public ContactDetailsDto mapContactDetailsDto(Contact contact) {
        return ContactDetailsDto.builder()
            .id(contact.getId())
            .name(contact.getName())
            .photo(contact.getPhoto())
            .bio(contact.getBio())
            .numbers(mapNumberDto(contact.getNumbers()))
            .build();
    }

    public ContactDto mapContactDto(Contact contact) {
        return ContactDto.builder()
            .id(contact.getId())
            .name(contact.getName())
            .photo(contact.getPhoto())
            .numbers(mapNumberDto(contact.getNumbers()))
            .build();
    }

    public ContactSummaryDto mapContactSummaryDto(Contact contact) {
        return ContactSummaryDto.builder()
            .id(contact.getId())
            .name(contact.getName())
            .photo(contact.getPhoto())
            .build();
    }

    public List<Number> mapNumber(List<NumberDto> numbers) {
        return Optional.ofNullable(numbers)
            .map((nums) -> nums.stream().map(this::mapNumber).collect(Collectors.toList()))
            .orElse(null);
    }

    public Number mapNumber(NumberDto number) {
        return Number.builder()
            .type(numberTypeConverter.read(number.getType(), null))
            .number(number.getNumber())
            .build();
    }

    public List<NumberDto> mapNumberDto(List<Number> numbers) {
        return Optional.ofNullable(numbers)
            .map((nums) -> nums.stream().map(this::mapNumberDto).collect(Collectors.toList()))
            .orElse(null);
    }

    public NumberDto mapNumberDto(Number number) {
        return NumberDto.builder()
            .type(number.getType().getValue())
            .number(number.getNumber())
            .build();
    }

}
