package com.scisbo.webphone.mappers;

import org.bson.types.Binary;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.dtos.controller.response.PhotoResponse;
import com.scisbo.webphone.models.Photo;

@Component
public class PhotoMapper {

    public PhotoResponse mapPhotoResponse(PhotoDto photo) {
        return PhotoResponse.builder()
            .id(photo.getId())
            .build();
    }

    public Photo mapPhoto(byte[] image) {
        return Photo.builder()
            .image(new Binary(image))
            .build();
    }

    public PhotoDto mapPhotoDto(Photo photo) {
        return PhotoDto.builder()
            .id(photo.getId())
            .image(photo.getImage().getData())
            .build();
    }

}
