package com.scisbo.webphone.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLConnection;

import org.springframework.stereotype.Component;

@Component
public class SimpleUrlFetcher implements UrlFetcher {

    @Override
    public byte[] fetchBytes(String url) throws IOException {
        URLConnection connection = URI.create(url).toURL().openConnection();
        connection.connect();
        try (InputStream input = connection.getInputStream()) {
            return input.readAllBytes();
        }
    }

}
