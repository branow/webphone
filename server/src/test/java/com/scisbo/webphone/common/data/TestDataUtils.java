package com.scisbo.webphone.common.data;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.bson.types.Binary;

public class TestDataUtils {

    public static List<Document> photos() {
        return parseResource("photos.json").stream()
            .map(TestDataUtils::uploadImage)
            .toList();
    }

    private static Document uploadImage(Document doc) {
        try {
            String relativePath = doc.getString("path");
            Path path = Path.of(TestDataUtils.class.getResource(relativePath).getPath());
            Binary binary = new Binary(Files.readAllBytes(path));
            doc.remove("path");
            return doc.append("image", binary);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static List<Document> contacts() {
        return parseResource("contacts.json");
    }


    public static List<Document> history() {
        return parseResource("history.json");
    }

    private static List<Document> parseResource(String resource) {
        try {
            Path path = Path.of(TestDataUtils.class.getResource(resource).getPath());
            String json = Files.readString(path);
            return parseJsonArrayToDocuments(json);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static List<Document> parseJsonArrayToDocuments(String json) {
        json = json.substring(1, json.length() - 1); // remove square parenthesis
        
        List<String> docs = new ArrayList<>();
        int level = 0, start = 0;
        var insideString = false;
        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == '"') {
                insideString = !insideString;
            }
            if (insideString) {
                continue;
            }
            if (json.charAt(i) == '{') {
                if (level++ == 0) {
                    start = i;
                }
            } else if (json.charAt(i) == '}') {
                if (--level == 0) {
                    docs.add(json.substring(start, i + 1));
                }
            }
        }

        return docs.stream().map(Document::parse).toList();
    }

}
