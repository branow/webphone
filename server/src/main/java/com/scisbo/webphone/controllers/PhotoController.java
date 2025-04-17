package com.scisbo.webphone.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.services.PhotoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/photo")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService service;

    @GetMapping(value = "/{photoId}", produces = "image/jpeg")
    public ResponseEntity<byte[]> getById(@PathVariable("photoId") String photoId) {
        PhotoDto photo = service.getById(photoId);
        return ResponseEntity.ok(photo.getImage());
    }

}
