package com.scisbo.webphone.utils.validation;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;

@Component
public class EntityValidator {

    public <T, V> void validateUniqueField(Collection<T> items, Function<T, V> extractor, String field, String entity) {
        Set<V> seen = new HashSet<>();
        for (T item: items) {
            V value = extractor.apply(item);
            if (!seen.add(value)) {
                throw new EntityAlreadyExistsException(entity, field, value);
            }
        }
    }

    public <T, V> void validateUniqueNestedField(
        Collection<T> items,
        Function<T, Collection<V>> extractor,
        String field,
        String entity
    ) {
        Set<V> seen = new HashSet<>();
        for (T item: items) {
            for (V value: extractor.apply(item)) {
                if (!seen.add(value)) {
                    throw new EntityAlreadyExistsException(entity, field, value);
                }
            }
        }
    }

}


