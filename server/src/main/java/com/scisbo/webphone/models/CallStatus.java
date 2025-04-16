package com.scisbo.webphone.models;

public enum CallStatus {

    INCOMING("incoming"),
    OUTCOMING("outcoming"),
    MISSED("missed"),
    FAILED("failed");

    private final String status;

    private CallStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }

}
