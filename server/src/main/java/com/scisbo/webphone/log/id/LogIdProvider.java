package com.scisbo.webphone.log.id;

/**
 * Provides a unique ID for logging purposes.
 */
public interface LogIdProvider {

    /**
     * Return a log ID string.
     *
     * @return a non-null string (empty string if no ID is avaialbe)
     * */
    String getId();

}
