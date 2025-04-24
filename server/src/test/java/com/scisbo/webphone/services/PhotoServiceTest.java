package com.scisbo.webphone.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.UUID;

import org.bson.types.Binary;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.mappers.PhotoMapper;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.repositories.PhotoRepository;
import com.scisbo.webphone.utils.UrlFetcher;

@SpringJUnitConfig({ PhotoService.class, PhotoMapper.class })
public class PhotoServiceTest {

    @Autowired
    private PhotoMapper mapper;

    @Autowired
    private PhotoService service;

    @MockitoBean
    private PhotoRepository repository;

    @MockitoBean
    private UrlFetcher urlFetcher;

    @Test
    public void testGetById() {
        String id = UUID.randomUUID().toString();

        Photo photo = Photo.builder()
            .id(id)
            .image(new Binary("bytes".getBytes()))
            .build();

        when(this.repository.getById(id)).thenReturn(photo);

        PhotoDto expected = this.mapper.mapPhotoDto(photo);
        PhotoDto actual = this.service.getById(id);

        assertEquals(expected, actual);
    }

    @Test
    public void testDownload() throws IOException {
        String url = "https://some-url";
        byte[] image = "image".getBytes();
        Photo photo = this.mapper.mapPhoto(image);

        doReturn(image).when(this.urlFetcher).fetchBytes(url);

        PhotoDto expected = this.mapper.mapPhotoDto(photo);
        PhotoDto actual = this.service.download(url);

        assertEquals(expected, actual);
        verify(this.repository).insert(photo);
    }

    @Test
    public void testDeleteById() {
        String id = UUID.randomUUID().toString();
        this.service.deleteById(id);
        verify(this.repository).deleteById(id);
    }

}
