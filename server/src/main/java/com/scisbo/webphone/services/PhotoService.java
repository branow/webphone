package com.scisbo.webphone.services;

import org.bson.types.Binary;
import org.slf4j.event.Level;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.exceptions.ImageOptimizationException;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.log.id.ThreadLogIdProvider;
import com.scisbo.webphone.mappers.PhotoMapper;
import com.scisbo.webphone.models.Photo;
import com.scisbo.webphone.repositories.PhotoRepository;
import com.scisbo.webphone.utils.ImageOptimizer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private static final String IMAGE_FORMAT = "jpeg";

    private final PhotoRepository repository;
    private final PhotoMapper mapper;
    private final ImageOptimizer imageOptimizer;


    /**
     * Retrieves a photo by its identifier.
     *
     * @param id the photo's identifier
     * @return a {@link PhotoDto} object
     * @throws EntityNotFoundException if photo is not found by the given identifier
     * */
    @LogBefore("Retrieving photo with ID=#{#id}")
    @LogAfter("Retrieved photo with ID=#{#result.getId()}")
    @LogError("Failed to retrieve photo [#{#error.toString()}]")
    public PhotoDto getById(String id) {
        return this.mapper.mapPhotoDto(this.repository.getById(id));
    }

    /**
     * Uploads a photo to the database.
     *
     * @param image the photo as a byte array
     * @return a {@link PhotoDto} representing the saved photo
     */
    @LogBefore("Uploading photo: size=#{#image.length}")
    @LogAfter("Uploaded photo with ID=#{#result.getId()}")
    @LogError("Failed to upload photo [#{#error.toString()}]")
    public PhotoDto upload(byte[] image) {
        Photo photo = this.mapper.mapPhoto(image);
        this.repository.insert(photo);
        return this.mapper.mapPhotoDto(photo);
    }

    /**
     * Deletes a photo by its identifier.
     *
     * @param id the photo's identifier
     * */
    @LogBefore("Deleting photo with ID=#{#id}")
    @LogAfter("Deleted photo with ID=#{#id}")
    @LogError("Failed to delete photo [error=#{#error.toString()}]")
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
    @LogError(message = "Failed to optimize photo [error=#{#error.toString()}]", level = Level.WARN, id = ThreadLogIdProvider.class)
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
