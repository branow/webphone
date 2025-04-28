package com.scisbo.webphone.convert;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class PageableToStringConverter implements Converter<Pageable, String> {

    @Override
    public String convert(Pageable pageable) {
        if (pageable == null) return "Pageable(null)";

        StringBuilder sb = new StringBuilder();
        sb.append("Pageable(page=")
            .append(pageable.getPageNumber())
            .append(", size=")
            .append(pageable.getPageSize());

        if (pageable.getSort().isSorted()) {
            List<String> orders = new ArrayList<>();
            for (Sort.Order order: pageable.getSort()) {
                orders.add(order.getProperty() + ": " + order.getDirection());
            }
            sb.append(", sort=[")
                .append(String.join(",", orders))
                .append("]");
            
        } else {
            sb.append(", sort=UNSORTED");
        }

        sb.append(")");
        return sb.toString();
    }

    @Override
    public <U> Converter<Pageable, U> andThen(Converter<? super String, ? extends U> after) {
        return Converter.super.andThen(after);
    }

}
