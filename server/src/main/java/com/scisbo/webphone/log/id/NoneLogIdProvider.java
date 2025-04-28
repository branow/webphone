package com.scisbo.webphone.log.id;

import org.springframework.stereotype.Component;

/**
 * A log ID provider that returns an empty string (no ID).
 */
@Component
public class NoneLogIdProvider implements LogIdProvider {

    @Override
    public String getId() { return ""; }

}
