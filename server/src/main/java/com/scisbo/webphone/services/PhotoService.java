package com.scisbo.webphone.services;

import org.bson.types.Binary;
import org.slf4j.event.Level;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.exceptions.ImageOptimizationException;
import com.scisbo.webphone.exceptions.PhotoUploadException;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.log.id.ThreadLogIdProvider;
import com.scisbo.webphone.mappers.PhotoMapper;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.repositories.PhotoRepository;
import com.scisbo.webphone.utils.ImageOptimizer;
import com.scisbo.webphone.utils.UrlFetcher;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private static final String IMAGE_FORMAT = "jpeg";

    private final PhotoRepository repository;
    private final PhotoMapper mapper;
    private final UrlFetcher fetcher;
    private final ImageOptimizer imageOptimizer;

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


    /**
     * Asynchronously optimizes a photo by its identifier.
     *
     * The image is retrieved, optimized, and then saved back to the database.
     * If the image is missing before or after the optimization, or an error 
     * occurs during processing an {@link ImageOptimizationException} is thrown.
     *
     * @param id the photo's identifier
     * @throws ImageOptimizationException if the image is missing before or 
     *         after the optimization, or an error occurs during processing
     */
    @Async("imageOptimizationExecutor")
    @LogBefore(message = "Optimizing photo with ID=#{#id}", id = ThreadLogIdProvider.class)
    @LogAfter(message = "Optimized photo with ID=#{#id}", id = ThreadLogIdProvider.class)
    @LogError(message = "Failed to optimize photo [error=#{#error}]", level = Level.WARN, id = ThreadLogIdProvider.class)
    public void optimize(String id) {
        byte[] input = this.repository.findById(id)
            .map(photo -> photo.getImage().getData())
            .orElseThrow(() -> 
                new ImageOptimizationException("Photo not found before optimization: " + id));

        byte[] output = this.imageOptimizer.optimize(input, IMAGE_FORMAT);

        Photo photo = this.repository.findById(id)
            .orElseThrow(() -> 
                new ImageOptimizationException("Photo was deleted during optimization: " + id));

        photo.setImage(new Binary(output));
        this.repository.save(photo);
    }

}
