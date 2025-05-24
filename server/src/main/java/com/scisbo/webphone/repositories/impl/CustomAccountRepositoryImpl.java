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

import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.repositories.CustomAccountRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomAccountRepositoryImpl implements CustomAccountRepository {

    private final MongoTemplate template;

    @Override
    public Page<Account> findByKeywordOrderByUsername(String keyword, Pageable pageable) {
        String regex = ".*";
        if (keyword != null && !keyword.isEmpty()) {
            regex = String.format(".*%s.*", Pattern.quote(keyword));
        }

        Criteria searchCriteria = new Criteria().orOperator(
            Criteria.where("user").regex(regex, "i"),
            Criteria.where("username").regex(regex, "i"),
            Criteria.where("sip.username").regex(regex, "i")
        );

        Query query = new Query()
            .addCriteria(searchCriteria)
            .with(pageable)
            .with(Sort.by(Sort.Direction.ASC, "username"));

        List<Account> accounts = this.template.find(query, Account.class);

        Query countQuery = new Query()
            .addCriteria(searchCriteria);

        long total = this.template.count(countQuery, Account.class);

        return new PageImpl<>(accounts, pageable, total);
    }

}
