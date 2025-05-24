package com.scisbo.webphone.dtos.controller.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SipResponse {
    String username;
    String password;
    String domain;
    String proxy;
}
