package com.scisbo.webphone.log.config;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import com.scisbo.webphone.log.id.LogIdProvider;

/**
 * Holds the configurable options for logging behavior.
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoggingConfiguration {

    /**
     * A provider to generate a unique id for each log records.
     */
    LogIdProvider logIdProvider;

}
