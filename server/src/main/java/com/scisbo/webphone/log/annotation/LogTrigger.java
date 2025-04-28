package com.scisbo.webphone.log.annotation;

/**
 * Defines when the logging action should be triggered during method execution.
 */
public enum LogTrigger {

    /**
     * Before method execution starts.
     */
    BEFORE,

    /**
     * After method execution completes successfully.
     */
    AFTER,

    /**
     * When an exception is thrown during method execution.
     */
    ERROR

}
