package com.scisbo.webphone.utils;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import java.io.IOException;
import java.util.Random;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.github.tomakehurst.wiremock.junit5.WireMockRuntimeInfo;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;

@WireMockTest
@SpringJUnitConfig(SimpleUrlFetcher.class)
public class SimpleUrlFetcherTest {

    @Autowired
    private UrlFetcher fetcher;

    @Test
    public void testFetchBytes(WireMockRuntimeInfo info) throws IOException {
        byte[] image = new byte[1024 * 12];
        new Random().nextBytes(image);
        String uri = "/image/img-1.jpg";

        stubFor(get(uri)
                .willReturn(aResponse()
                    .withStatus(200)
                    .withHeader("Content-Type", "image/jpeg")
                    .withBody(image)));

        String url = info.getHttpBaseUrl() + uri;
        byte[] actual = this.fetcher.fetchBytes(url);

        assertArrayEquals(image, actual);
    }

}
