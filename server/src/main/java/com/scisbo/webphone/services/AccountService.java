package com.scisbo.webphone.services;

import static com.scisbo.webphone.repositories.AccountRepository.ENTITY_NAME;

import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.scisbo.webphone.utils.validation.EntityValidator;
import com.scisbo.webphone.dtos.service.AccountDto;
import com.scisbo.webphone.dtos.service.CreateAccountDto;
import com.scisbo.webphone.dtos.service.UpdateAccountDto;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.mappers.AccountMapper;
import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.repositories.AccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountMapper mapper;
    private final AccountRepository repository;
    private final ContactService contactService;
    private final HistoryService historyService;
    private final EntityValidator validator;


    /**
     * Retrieves the account by its identifier.
     *
     * @param id the account's identifier
     * @return a {@link AccountDto} object
     * @throws EntityNotFoundException if no account is found by the specified id
     * */
    @LogBefore("Retrieving account with id=#{#id}")
    @LogAfter("Retrieved account with ID=#{#result.getId()}")
    @LogError("Failed to retrieve account [#{#error.toString()}]")
    public AccountDto get(String id) {
        return this.mapper.mapAccountDto(this.repository.getById(id));
    }

    /**
     * Retrieves the active account for the specified user.
     *
     * @param user the user identifier
     * @return a {@link AccountDto} object
     * @throws EntityNotFoundException if no active account is found by the specified user
     * */
    @LogBefore("Retrieving active account with user=#{#user}")
    @LogAfter("Retrieved active account with ID=#{#result.getId()}")
    @LogError("Failed to retrieve active account [#{#error.toString()}]")
    public AccountDto getActiveByUser(String user) {
        return this.mapper.mapAccountDto(this.repository.getActiveByUser(user));
    }

    /**
     * Retrieves a paginated list of accounts for the specified keyword
     * ordered by username.
     *
     * @param keyword   the keyword to search
     * @param pageable  the pagination information
     * @return a page of {@link AccountDto}
     * */
    @LogBefore("Retrieving accounts for keyword=#{#keyword}, page=#{#pageable}")
    @LogAfter("Retrieved accounts: #{#result}")
    @LogError("Failed to retrieve accounts [#{#error.toString()}]")
    public Page<AccountDto> getAll(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return this.repository.findAllOrderByUsername(pageable)
                .map(this.mapper::mapAccountDto);
        }
        return this.repository.findByKeywordOrderByUsername(keyword, pageable)
            .map(this.mapper::mapAccountDto);
    }

    /**
     * Creates a new account.
     *
     * @params createDto the data for the new contact
     * @return the created {@link AccountDto} object
     * @throws EntityAlreadyExistsException if an account with the same user or
     *         or sip username already exists.
     * */
    @LogBefore("Creating account for user=#{#createDto.getUser()}")
    @LogAfter("Created account with ID=#{#result.getId()}")
    @LogError("Failed to create account [#{#error.toString()}]")
    public AccountDto create(CreateAccountDto createDto) {
        var account = this.mapper.mapAccount(createDto);
        validateNewAccount(account);
        var savedAccount = this.repository.save(account);
        return this.mapper.mapAccountDto(savedAccount);
    }

    /**
     * Updates the given account. Fields updated: {@code username}, 
     * {@code active}, {@code sip}.
     *
     * @param updateDto the update data
     * @return the updated {@link AccountDto}
     * @throws EntityNotFoundException if no account exists the given identifier
     * @throws EntityAlreadyExistsException if another account with the same 
     *         SIP username exists
     * */
    @LogBefore("Updating account for ID=#{#updateDto.getId()}")
    @LogAfter("Updated account with ID=#{#result.getId()}")
    @LogError("Failed to udpate account [#{#error.toString()}]")
    public AccountDto update(UpdateAccountDto updateDto) {
        var updateAccount = this.mapper.mapAccount(updateDto);
        validateUpdateAccount(updateAccount);

        var account = this.repository.getById(updateDto.getId());
        account.setUsername(updateAccount.getUsername());
        account.setActive(updateAccount.getActive());
        account.setSip(updateAccount.getSip());

        var updatedAccount = this.repository.save(account);
        return this.mapper.mapAccountDto(updatedAccount);
    }

    /**
     * Deletes an account by its identifier and associated contacts, 
     * history records, photos.
     *
     * @param id the account's identifier
     * */
    @LogBefore("Deleting account for ID=#{#id}")
    @LogAfter("Deleted account with ID=#{#id}")
    @LogError("Failed to delete account [#{#error.toString()}]")
    public void deleteById(String id) {
        this.repository.findById(id).ifPresent(account -> {
            this.contactService.deleteByUser(account.getUser());
            this.historyService.deleteByUser(account.getUser());
            this.repository.deleteById(id);
        });
    }

    private void validateNewAccount(Account account) {
        List<Account> accounts = this.repository.findAll();
        accounts.add(account);
        checkUniqueUser(accounts);
        checkUniqueSipUsername(accounts);
    }

    private void validateUpdateAccount(Account account) {
        List<Account> accounts = this.repository.findAll().stream()
            .filter(a -> !Objects.equals(a.getId(), account.getId()))
            .collect(Collectors.toList());
        accounts.add(account);
        checkUniqueSipUsername(accounts);
    }

    private void checkUniqueUser(List<Account> accounts) {
        this.validator.validateUniqueField(accounts, Account::getUser, "user", ENTITY_NAME);
    }

    private void checkUniqueSipUsername(List<Account> accounts) {
        Function<Account, String> extractor = (account) -> account.getSip().getUsername();
        this.validator.validateUniqueField(accounts, extractor, "user", ENTITY_NAME);
    }

}
