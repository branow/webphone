package com.scisbo.webphone.mappers;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.bson.types.Binary;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.models.Photo;

@SpringJUnitConfig(PhotoMapper.class)
public class PhotoMapperTest {

    @Autowired
    private PhotoMapper mapper;

    @Test
    public void testMapPhoto() {
        var image = "bytes".getBytes();
        var expected = Photo.builder()
            .image(new Binary("bytes".getBytes()))
            .build();
        var actual = this.mapper.mapPhoto(image);
        assertEquals(expected.getId(), actual.getId());
        assertArrayEquals(expected.getImage().getData(), actual.getImage().getData());
    }

    @Test
    public void testMapPhotoDto() {
        var photo = Photo.builder()
            .id("id")
            .image(new Binary("bytes".getBytes()))
            .build();
        var expected = PhotoDto.builder()
            .id("id")
            .image("bytes".getBytes())
            .build();
        var actual = this.mapper.mapPhotoDto(photo);
        assertEquals(expected, actual);
    }

}
