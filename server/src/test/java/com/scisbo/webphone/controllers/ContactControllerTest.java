package com.scisbo.webphone.controllers;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.lang.reflect.Method;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.scisbo.webphone.common.data.TestObjectsUtils;
import com.scisbo.webphone.common.web.RestUtils;
import com.scisbo.webphone.dtos.controller.request.CreateContactRequest;
import com.scisbo.webphone.dtos.controller.request.NumberRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateContactRequest;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.models.converters.NumberTypeConverter;
import com.scisbo.webphone.services.ContactService;

import jakarta.validation.Valid;

@SpringJUnitConfig({
    ContactController.class,
    ContactMapper.class,
    PageMapper.class,
    NumberTypeConverter.class,
})
public class ContactControllerTest {

    @Autowired
    private ContactController controller;

    @Autowired
    private ContactMapper mapper;

    @MockitoBean
    private ContactService service;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .build();
    }

    @Test
    public void testGetByUser() throws Exception {
        var user = "userId";
        var search = "search";
        int number = 0, size = 10, totalPages = 4;
        var pageable = PageRequest.of(number, size);
        var contacts = TestObjectsUtils.contacts().stream()
            .map(this.mapper::mapContactDto)
            .toList();
        var pageOfContacts = new PageImpl<>(contacts, pageable, totalPages);

        when(this.service.getByUser(user, search, pageable)).thenReturn(pageOfContacts);

        var response = RestUtils.toJson(this.mapper.mapContactResponse(pageOfContacts));

        this.mockMvc
            .perform(
                get("/api/contacts/user/{user}", user)
                    .queryParam("number", String.valueOf(number))
                    .queryParam("size", String.valueOf(size))
                    .queryParam("search", search)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetPageByUser_withoutQueryParams() throws Exception {
        var user = "userId";
        int number = 0, size = 50, totalPages = 4;
        var pageable = PageRequest.of(number, size);
        var contacts = TestObjectsUtils.contacts().stream()
            .map(this.mapper::mapContactDto)
            .toList();
        var pageOfContacts = new PageImpl<>(contacts, pageable, totalPages);

        when(this.service.getByUser(user, null, pageable)).thenReturn(pageOfContacts);

        var response = RestUtils.toJson(this.mapper.mapContactResponse(pageOfContacts));

        this.mockMvc
            .perform(
                get("/api/contacts/user/{user}", user)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetById() throws Exception {
        var id = "contactId";
        var contact = TestObjectsUtils.contacts().get(3);
        var contactDto = this.mapper.mapContactDto(contact);
        var contactResponse = this.mapper.mapContactResponse(contactDto);

        when(this.service.getById(id)).thenReturn(contactDto);

        var response = RestUtils.toJson(contactResponse);

        this.mockMvc
            .perform(
                get("/api/contacts/{id}", id)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testGetByNumber() throws Exception {
        var user = "user";
        var number = "number";
        var contact = TestObjectsUtils.contacts().stream().findAny().orElseThrow();
        var contactDto = this.mapper.mapContactDto(contact);
        var contactResponse = this.mapper.mapContactResponse(contactDto);

        when(this.service.getByNumber(user, number)).thenReturn(contactDto);

        var response = RestUtils.toJson(contactResponse);

        this.mockMvc
            .perform(
                get("/api/contacts/user/{user}/number/{number}", user, number)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testCreate() throws Exception {
        var user = "userId";
        var createContactRequest = CreateContactRequest.builder()
            .name("name")
            .photo("photo123")
            .bio("bio")
            .numbers(List.of(
                NumberRequest.builder().type("work").number("1111").build(),
                NumberRequest.builder().type("home").number("2222").build()
            ))
            .build();
        var createContactDto = this.mapper.mapCreateContactDto(createContactRequest);
        var contact = this.mapper.mapContact(createContactDto, user);
        var contactDto = this.mapper.mapContactDto(contact);
        var contactResponse = this.mapper.mapContactResponse(contactDto);

        when(this.service.create(user, createContactDto)).thenReturn(contactDto);

        var request = RestUtils.toJson(createContactRequest);
        var response = RestUtils.toJson(contactResponse);

        this.mockMvc
            .perform(
                post("/api/contacts/user/{user}", user)
                    .header("Content-Type", "application/json")
                    .content(request)
            )
            .andExpect(status().isCreated())
            .andExpect(content().string(response));
    }

    @Test
    public void testCreate_hasValidation() throws Exception {
        Method method = controller.getClass().getMethod("create", String.class, CreateContactRequest.class);
        assertNotNull(method.getParameters()[1].getDeclaredAnnotation(Valid.class));
    }

    @Test
    public void testCreateBatch() throws Exception {
        var user = "userId";
        var createContactRequests = List.of(
            CreateContactRequest.builder()
                .name("name1")
                .numbers(List.of(
                    NumberRequest.builder().type("work").number("1111").build()
                ))
                .build(),
            CreateContactRequest.builder()
                .name("name2")
                .numbers(List.of(
                    NumberRequest.builder().type("home").number("2222").build()
                ))
                .build()
        );
        var createContactDtos = createContactRequests.stream()
            .map(this.mapper::mapCreateContactDto)
            .toList();
        var contacts = TestObjectsUtils.contacts();
        var contactDtos = contacts.stream()
            .map(this.mapper::mapContactDto)
            .toList();
        var contactResponses = contactDtos.stream()
            .map(this.mapper::mapContactResponse)
            .toList();

        when(this.service.create(user, createContactDtos)).thenReturn(contactDtos);

        var request = RestUtils.toJson(createContactRequests);
        var response = RestUtils.toJson(contactResponses);

        this.mockMvc
            .perform(
                post("/api/contacts/user/{user}/batch", user)
                    .header("Content-Type", "application/json")
                    .content(request)
            )
            .andExpect(status().isCreated())
            .andExpect(content().string(response));
    }

    @Test
    public void testCreateBatch_hasValidation() throws Exception {
        Method method = controller.getClass().getMethod("create", String.class, List.class);
        assertNotNull(method.getParameters()[1].getDeclaredAnnotation(Valid.class));
    }

    @Test
    public void testUpdate() throws Exception {
        var id = "contactId";
        var updateContactRequest = UpdateContactRequest.builder()
            .name("name")
            .photo("photo123")
            .bio("bio")
            .numbers(List.of(
                NumberRequest.builder().type("work").number("1111").build(),
                NumberRequest.builder().type("home").number("2222").build()
            ))
            .build();
        var updateContactDto = this.mapper.mapUpdateContactDto(updateContactRequest, id);
        var contact = TestObjectsUtils.contacts().get(3);
        var contactDto = this.mapper.mapContactDto(contact);
        var contactResponse = this.mapper.mapContactResponse(contactDto);

        when(this.service.update(updateContactDto)).thenReturn(contactDto);

        var request = RestUtils.toJson(updateContactRequest);
        var response = RestUtils.toJson(contactResponse);

        this.mockMvc
            .perform(
                put("/api/contacts/{id}", id)
                    .header("Content-Type", "application/json")
                    .content(request)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(response));
    }

    @Test
    public void testUpdate_hasValidation() throws Exception {
        Method method = controller.getClass().getMethod("update", String.class, UpdateContactRequest.class);
        assertNotNull(method.getParameters()[1].getDeclaredAnnotation(Valid.class));
    }

    @Test
    public void testDeleteById() throws Exception {
        var id = "contactId";

        this.mockMvc
            .perform(
                delete("/api/contacts/{id}", id)
            )
            .andExpect(status().isNoContent());

        verify(this.service).deleteById(id);
    }

}
