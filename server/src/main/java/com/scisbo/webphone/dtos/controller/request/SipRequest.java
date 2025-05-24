package com.scisbo.webphone.dtos.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SipRequest {

    @NotBlank(message = "{sip.username.mandatory}")
    @Size(max = 100, message = "{sip.username.size}")
    String username;

    @NotBlank(message = "{sip.password.mandatory}")
    @Size(max = 100, message = "{sip.password.size}")
    String password;

    @NotBlank(message = "{sip.domain.mandatory}")
    @Size(max = 200, message = "{sip.domain.size}")
    String domain;

    @NotBlank(message = "{sip.proxy.mandatory}")
    @Size(max = 200, message = "{sip.proxy.size}")
    String proxy;

}
