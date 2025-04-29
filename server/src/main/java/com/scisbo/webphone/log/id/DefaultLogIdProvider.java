package com.scisbo.webphone.log.id;

import org.springframework.stereotype.Component;

/**
 * A log ID provider that returns an empty string (no ID).
 * Is a mark class to make use of log id provider specified in logging configuration.
 */
@Component
public class DefaultLogIdProvider implements LogIdProvider {

    @Override
    public String getId() { return ""; }

}
