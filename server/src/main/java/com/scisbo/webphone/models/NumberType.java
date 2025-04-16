package com.scisbo.webphone.models;

public enum NumberType {

    HOME("home"), WORK("work"), MOBILE("mobile");

    private final String value;

    private NumberType(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

}
