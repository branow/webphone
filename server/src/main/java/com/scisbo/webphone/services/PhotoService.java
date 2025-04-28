package com.scisbo.webphone.services;

import org.springframework.stereotype.Service;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.exceptions.PhotoUploadException;
import com.scisbo.webphone.mappers.PhotoMapper;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.repositories.PhotoRepository;
import com.scisbo.webphone.utils.UrlFetcher;

import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.log.annotation.LogAfter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository repository;
    private final PhotoMapper mapper;
    private final UrlFetcher fetcher;

    /**
     * Retrieves a photo by its identifier.
     *
     * @param id the photo's identifier
     * @returns a {@link PhotoDto} object
     * @throws EntityNotFoundException if photo is not found by the given identifier
     * */
    @LogBefore("Retrieving photo with ID=#{#id}")
    @LogAfter("Retrieved photo with ID=#{#result.getId()}")
    @LogError("Failed to retrieve photo [#{#error}]")
    public PhotoDto getById(String id) {
        return this.mapper.mapPhotoDto(this.repository.getById(id));
    }

    /**
     * Downloads an image from the specified URL and saves it to the database.
     *
     * @param url the URL to download image from
     * @returns a {@link PhotoDto} object representing the saved photo
     * @throws PhotoUploadException if an error occurs during download.
     * @see UrlFetcher
     * */
    @LogBefore("Downloading photo from URL=#{#url}")
    @LogAfter("Downloaded photo with ID=#{#result.getId()}")
    @LogError("Failed to download photo [#{#error}]")
    public PhotoDto download(String url) {
        byte[] image = null;
        try {
            image = fetcher.fetchBytes(url);
        } catch (Exception e) {
            throw new PhotoUploadException(url, e);
        }
        Photo photo = this.mapper.mapPhoto(image);
        repository.insert(photo);
        return mapper.mapPhotoDto(photo);
    }

    /**
     * Deletes a photo by its identifier.
     *
     * @param id the photo's identifier
     * */
    @LogBefore("Deleting photo with ID=#{#id}")
    @LogAfter("Deleted photo with ID=#{#id}")
    @LogError("Failed to delete photo [error=#{#error}]")
    public void deleteById(String id) {
        this.repository.deleteById(id);
    }

}
