package com.scisbo.webphone.convert;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class PageToStringConverter implements Converter<Page<?>, String> {

    @Override
    public String convert(Page<?> page) {
        if (page == null) return "Page(null)";

        StringBuilder sb = new StringBuilder();
        sb.append("Page(page=")
            .append(page.getNumber())
            .append(", size=")
            .append(page.getSize())
            .append(", items=")
            .append(page.getNumberOfElements());

        if (page.getSort().isSorted()) {
            List<String> orders = new ArrayList<>();
            for (Sort.Order order: page.getSort()) {
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
    public <U> Converter<Page<?>, U> andThen(Converter<? super String, ? extends U> after) {
        return Converter.super.andThen(after);
    }

}

