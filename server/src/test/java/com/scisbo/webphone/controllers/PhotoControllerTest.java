package com.scisbo.webphone.controllers;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.services.PhotoService;

@SpringJUnitConfig(PhotoController.class)
public class PhotoControllerTest {

    @Autowired
    private PhotoController controller;

    @MockitoBean
    private PhotoService service;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .build();
    }

    @Test
    public void testGetById() throws Exception {
        var id = "photoId";
        var image = "image".getBytes();

        var photo = PhotoDto.builder()
            .id(id)
            .image(image)
            .build();

        when(this.service.getById(id)).thenReturn(photo);

        this.mockMvc
            .perform(
                get("/api/photo/{id}", id)
            )
            .andExpect(status().isOk())
            .andExpect(content().bytes(image));
    }

}
