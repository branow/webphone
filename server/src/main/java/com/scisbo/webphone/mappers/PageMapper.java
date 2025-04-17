package com.scisbo.webphone.mappers;

import org.springframework.stereotype.Component;
import org.springframework.data.domain.Page;
import com.scisbo.webphone.dtos.controller.response.PageResponse;

@Component
public class PageMapper {

    public <E> PageResponse<E> mapPageResponse(Page<E> page) {
        PageResponse<E> res = new PageResponse<E>();
        res.setNumber(page.getNumber());
        res.setSize(page.getSize());
        res.setTotalPages(page.getTotalPages());
        res.setTotalItems((int) page.getTotalElements());
        res.setItems(page.getContent());
        return res;
    }

}
