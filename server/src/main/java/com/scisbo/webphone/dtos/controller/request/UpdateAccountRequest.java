package com.scisbo.webphone.dtos.controller.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateAccountRequest {

    @NotBlank(message = "{account.username.mandatory}")
    @Size(max = 100, message = "{account.username.size}")
    String username;

    @NotNull(message = "{account.active.mandatory}")
    Boolean active;

    @Valid
    @NotNull(message = "{account.sip.mandatory}")
    SipRequest sip;

}
