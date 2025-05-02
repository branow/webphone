package com.scisbo.webphone.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLConnection;

import org.springframework.stereotype.Component;

import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;

@Component
public class SimpleUrlFetcher implements UrlFetcher {

    @Override
    @LogBefore("Fetching bytes from URL=#{#url}")
    @LogAfter("Fetched #{#result.length} bytes")
    @LogError("Failed to fetch bytes [#{#error.toString()}]")
    public byte[] fetchBytes(String url) throws IOException {
        URLConnection connection = URI.create(url).toURL().openConnection();
        connection.connect();
        try (InputStream input = connection.getInputStream()) {
            return input.readAllBytes();
        }
    }

}
