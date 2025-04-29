package com.scisbo.webphone.utils;

public interface ImageOptimizer {

    /**
     * Optimizes the given image byte array and converts it to the specified format.
     *
     * @param input  the image data to optimize
     * @param format the target image format (e.g., "jpeg", "png")
     * @return the optimized image as a byte array
     * @throws ImageOptimizationException if an error occurs during optimization
     */
    byte[] optimize(byte[] input, String format);

}
