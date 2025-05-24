package com.scisbo.webphone.dtos.controller.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponse {
    String id;
    String user;
    String username;
    Boolean active;
    SipResponse sip;
}
