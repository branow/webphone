package com.scisbo.webphone.log.id;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LogIdProviders {

    private final ApplicationContext context;

    public <T extends LogIdProvider> T getProvider(Class<T> clazz) {
        return context.getBean(clazz);
    }

}
