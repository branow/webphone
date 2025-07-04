package com.scisbo.webphone.dtos.service;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateAccountDto {
    String user;
    String username;
    Boolean active;
    SipDto sip;
}
