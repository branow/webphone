package com.scisbo.webphone.models;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Sip {

    String username;

    String password;

    String domain;

    String proxy;

}
