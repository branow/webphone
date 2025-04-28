package com.scisbo.webphone.log.aspect;

import java.util.Arrays;
import java.util.List;

import org.slf4j.event.Level;

import com.scisbo.webphone.log.annotation.Log;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.log.annotation.LogTrigger;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogDto {

    public static LogDto build(Log log) {
        return LogDto.builder()
            .message(resolveMessage(log.value(), log.message()))
            .level(log.level())
            .triggers(Arrays.asList(log.triggers()))
            .build();
    }

    public static LogDto build(LogBefore log) {
        return LogDto.builder()
            .message(resolveMessage(log.value(), log.message()))
            .level(log.level())
            .triggers(List.of(LogTrigger.BEFORE))
            .build();
    }

    public static LogDto build(LogAfter log) {
        return LogDto.builder()
            .message(resolveMessage(log.value(), log.message()))
            .level(log.level())
            .triggers(List.of(LogTrigger.AFTER))
            .build();
    }

    public static LogDto build(LogError log) {
        return LogDto.builder()
            .message(resolveMessage(log.value(), log.message()))
            .level(log.level())
            .triggers(List.of(LogTrigger.ERROR))
            .build();
    }

    private static String resolveMessage(String value, String message) {
        return value.isEmpty() ? message : value;
    }

    String message;
    Level level;
    List<LogTrigger> triggers;

    public boolean isTriggered(LogTrigger trigger) {
        return this.triggers.contains(trigger);
    }

}
