package com.scisbo.webphone.controllers;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.scisbo.webphone.dtos.controller.response.PhotoResponse;
import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.exceptions.PhotoUploadException;
import com.scisbo.webphone.mappers.PhotoMapper;
import com.scisbo.webphone.services.PhotoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService service;
    private final PhotoMapper mapper;


    @GetMapping(value = "/{photoId}", produces = "image/jpeg")
    public ResponseEntity<byte[]> getById(@PathVariable("photoId") String photoId) {
        PhotoDto photo = this.service.getById(photoId);
        return ResponseEntity.ok(photo.getImage());
    }

    @PostMapping
    public ResponseEntity<PhotoResponse> upload(@RequestParam("photo") MultipartFile photo) {
        try {
            PhotoDto savedPhoto = this.service.upload(photo.getBytes());
            this.service.optimize(savedPhoto.getId());
            PhotoResponse res = this.mapper.mapPhotoResponse(savedPhoto);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IOException e) {
            throw new PhotoUploadException(photo.getOriginalFilename(), e);
        }
    }

}
