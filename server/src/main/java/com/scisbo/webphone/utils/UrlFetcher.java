package com.scisbo.webphone.utils;

import java.io.IOException;

public interface UrlFetcher {

    /**
     * Fetches the byte content from the specified URL.
     *
     * @param url the URL to fetch data from
     * @return a byte array containing the fetched data
     * @throws IOException if an I/O error occurs during fetching
     * */
    byte[] fetchBytes(String url) throws IOException;

}
