package com.scisbo.webphone.log.id;

import org.springframework.stereotype.Component;

@Component
public class ThreadLogIdProvider implements LogIdProvider {

    @Override
    public String getId() {
        return Thread.currentThread().getName();
    }

}
