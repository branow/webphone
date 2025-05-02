package com.scisbo.webphone.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.bson.types.Binary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.TestLoggingConfig;
import com.scisbo.webphone.config.AsyncConfig;
import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.exceptions.ImageOptimizationException;
import com.scisbo.webphone.log.id.RequestLogIdProvider;
import com.scisbo.webphone.mappers.PhotoMapper;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.repositories.PhotoRepository;
import com.scisbo.webphone.utils.ImageOptimizer;

@EnableAsync
@EnableAspectJAutoProxy
@SpringJUnitConfig({
    PhotoService.class,
    PhotoMapper.class,
    AsyncConfig.class,
    TestLoggingConfig.class,
})
public class PhotoServiceTest {

    @Autowired
    private PhotoMapper mapper;

    @Autowired
    private PhotoService service;

    @MockitoBean
    private PhotoRepository repository;

    @MockitoBean
    private RequestLogIdProvider requestLogIdProvider;

    @MockitoBean
    private ImageOptimizer imageOptimizer;

    @MockitoBean
    private AsyncConfigurer asyncConfigurer;

    @MockitoBean
    private AsyncUncaughtExceptionHandler asyncUncaughtExceptionHandler;


    @BeforeEach
    public void setUp() {
        when(this.requestLogIdProvider.getId()).thenReturn(UUID.randomUUID().toString());
    }

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
    public void testUpload() {
        byte[] image = "image".getBytes();
        Photo photo = this.mapper.mapPhoto(image);

        PhotoDto expected = this.mapper.mapPhotoDto(photo);
        PhotoDto actual = this.service.upload(image);

        assertEquals(expected, actual);
        verify(this.repository).insert(photo);
    }

    @Test
    public void testDeleteById() {
        String id = UUID.randomUUID().toString();
        this.service.deleteById(id);
        verify(this.repository).deleteById(id);
    }

    @Test
    public void testOptimize() {
        String id = UUID.randomUUID().toString();
        byte[] image = "image".getBytes();
        byte[] optimizedImage = "optimizedImage".getBytes();
        Photo photo = Photo.builder().id(id).image(new Binary(image)).build();
        Photo optimizedPhoto = Photo.builder().id(id).image(new Binary(optimizedImage)).build();

        when(this.repository.findById(id)).thenReturn(Optional.of(photo));
        when(this.imageOptimizer.optimize(image, "jpeg")).thenReturn(optimizedImage);

        this.service.optimize(id);

        verify(this.repository, timeout(1000)).save(optimizedPhoto);
    }

    @Test
    public void testOptimize_absentPhoto_throwException() {
        String id = UUID.randomUUID().toString();

        when(this.repository.findById(id)).thenReturn(Optional.empty());
        when(this.asyncConfigurer.getAsyncUncaughtExceptionHandler())
            .thenReturn(this.asyncUncaughtExceptionHandler);

        this.service.optimize(id);

        verify(this.asyncUncaughtExceptionHandler, timeout(1000))
            .handleUncaughtException(any(ImageOptimizationException.class), any(), any());
    }

    @Test
    public void testOptimize_deletedPhoto_throwExcpetion() {
        String id = UUID.randomUUID().toString();
        byte[] image = "image".getBytes();
        byte[] optimizedImage = "optimizedImage".getBytes();
        Photo photo = Photo.builder().id(id).image(new Binary(image)).build();
        Photo optimizedPhoto = Photo.builder().id(id).image(new Binary(optimizedImage)).build();

        when(this.repository.findById(id))
            .thenReturn(Optional.of(photo))
            .thenReturn(Optional.empty());
        when(this.imageOptimizer.optimize(image, "jpeg")).thenReturn(optimizedImage);
        when(this.asyncConfigurer.getAsyncUncaughtExceptionHandler())
            .thenReturn(this.asyncUncaughtExceptionHandler);

        this.service.optimize(id);

        verify(this.asyncUncaughtExceptionHandler, timeout(1000))
            .handleUncaughtException(any(ImageOptimizationException.class), any(), any());
        verify(this.repository, never()).save(optimizedPhoto);
    }

}
