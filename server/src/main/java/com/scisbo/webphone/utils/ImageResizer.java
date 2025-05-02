package com.scisbo.webphone.utils;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Optional;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.exceptions.ImageOptimizationException;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.log.id.ThreadLogIdProvider;

import jakarta.annotation.PostConstruct;

/**
 * Optimizes images by resizing them so that the shortest side matches 
 * a configured target size.
 *
 * The {@code ImageResizer} adjust the image dimensions such that the shorter 
 * side is equal to the {@code code image.optimizer.target-short-side} value
 * while maintaining the origin aspect ratio.
 * If one of the sides are already smaller than the target, the image is not resized.
 *
 * The component requires the {@code code image.optimizer.target-short-side}
 * property to be set a positive integer.
 */
@Component
public class ImageResizer implements ImageOptimizer {

    @Value("${image.optimizer.target-short-side}")
    private int targetShortSide;


    @PostConstruct
    protected void init() {
        if (targetShortSide <= 0) {
            throw new IllegalStateException("Target short side value must be higher than zero: " + targetShortSide);
        }
    }

    /**
     * Optimizes images by resizing them so that the shortest side matches 
     * a configured target size.
     * If one of the sides are already smaller than the target, the image 
     * is not resized.
     *
     * @param input  the image data to optimize
     * @param format the target image format (e.g., "jpeg", "png")
     * @return the optimized image as a byte array
     * @throws ImageOptimizationException if an error occurs during optimization
     */
    @Override
    @LogAfter(message = "Optimized image: #{#input.length} to #{#result.length}", id = ThreadLogIdProvider.class)
    @LogError(message = "Failed to optimized image: [#{#error.toString()}]", id = ThreadLogIdProvider.class)
    public byte[] optimize(byte[] input, String format) {
        try (var bais = new ByteArrayInputStream(input);
             var baos = new ByteArrayOutputStream()) {
            optimize(bais, baos, format);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new ImageOptimizationException("Failed to optimize image", e);
        }
    }

    private void optimize(InputStream input, OutputStream output, String format) throws IOException {
        BufferedImage image = read(input);
        int[] size = computeTargetSize(image, this.targetShortSide);
        int width = size[0], height = size[1];
        if (image.getWidth() != width || image.getHeight() != height) {
            image = resize(image, width, height);
        }
        write(image, output, format);
    }

    private BufferedImage resize(BufferedImage image, int width, int height) {
        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resizedImage.createGraphics();
        graphics.setRenderingHint(
            RenderingHints.KEY_INTERPOLATION,
            RenderingHints.VALUE_INTERPOLATION_BILINEAR
        );
        graphics.drawImage(image, 0, 0, width, height, null);
        graphics.dispose();
        return resizedImage;
    }
    
    private BufferedImage read(InputStream input) throws IOException {
        return Optional.ofNullable(ImageIO.read(input))
            .orElseThrow(() -> new IOException("Unsupported or corrupt image format"));
    }

    private void write(BufferedImage image, OutputStream output, String format) throws IOException {
        ImageWriter writer = ImageIO.getImageWritersByFormatName(format).next();
        ImageWriteParam params = writer.getDefaultWriteParam();
        writer.setOutput(ImageIO.createImageOutputStream(output));
        writer.write(null, new IIOImage(image, null, null), params);
        writer.dispose();
    }

    private int[] computeTargetSize(BufferedImage image, int minShortSide) {
        int width = image.getWidth(), height = image.getHeight();
        int shortSide = Math.min(width, height);

        if (shortSide <= minShortSide) {
            return new int[] { width, height };
        }

        double scale = minShortSide / (double) shortSide;
        return new int[] {
            (int) (width * scale),
            (int) (height * scale)
        };
    }

}
