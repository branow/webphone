package com.scisbo.webphone;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;

import com.scisbo.webphone.config.LoggingConfig;

@Configuration
@Import(LoggingConfig.class)
@ComponentScan(
    basePackages = {
        "com.scisbo.webphone.convert",
        "com.scisbo.webphone.log",
    },
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = ".*Test.*"
    )
)
public class TestLoggingConfig {}
