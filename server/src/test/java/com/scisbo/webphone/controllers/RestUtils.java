package com.scisbo.webphone.controllers;

import java.io.IOException;
import java.io.StringWriter;

import com.fasterxml.jackson.databind.ObjectMapper;

public class RestUtils {

    private static ObjectMapper mapper = new ObjectMapper();

    static {
       mapper.findAndRegisterModules();
    }

    public static String toJson(Object obj) {
        try {
            StringWriter writer = new StringWriter();
            mapper.writeValue(writer, obj);
            return writer.toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
