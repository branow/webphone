package com.scisbo.webphone.repositories.impl;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.repositories.CustomContactRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomContactRepositoryImpl implements CustomContactRepository {

    private final MongoTemplate template;


    @Override
    public Page<Contact> findByUserAndKeywordOrderByName(String user, String keyword, Pageable pageable) {
        String regex = ".*";
        if (keyword != null && !keyword.isEmpty()) {
            regex = String.format(".*%s.*", Pattern.quote(keyword));
        }

        Criteria userCriteria = Criteria.where("user").is(user);
        Criteria searchCriteria = new Criteria().orOperator(
            Criteria.where("name").regex(regex, "i"),
            Criteria.where("bio").regex(regex, "i"),
            Criteria.where("numbers.number").regex(regex)
        );

        Query query = new Query()
            .addCriteria(userCriteria)
            .addCriteria(searchCriteria)
            .with(pageable)
            .with(Sort.by(Sort.Direction.ASC, "name"));

        List<Contact> contacts = template.find(query, Contact.class);

        Query countQuery = new Query()
            .addCriteria(userCriteria)
            .addCriteria(searchCriteria);

        long total = template.count(countQuery, Contact.class);
        
        return new PageImpl<>(contacts, pageable, total);
    }

}
