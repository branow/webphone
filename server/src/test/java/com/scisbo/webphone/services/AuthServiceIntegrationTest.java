package com.scisbo.webphone.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.function.BiFunction;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.common.mongodb.EmbeddedMongoDbAbstractIT;
import com.scisbo.webphone.models.Account;
import com.scisbo.webphone.models.Contact;
import com.scisbo.webphone.models.HistoryRecord;

@EnableMongoRepositories("com.scisbo.webphone.repositories")
@SpringJUnitConfig(AuthService.class)
public class AuthServiceIntegrationTest extends EmbeddedMongoDbAbstractIT {

    @Autowired
    private AuthService service;

    @Autowired
    private MongoTemplate template;

    @ParameterizedTest(name = "[{index}] requester={0}, owener={1}, expected={2}")
    @MethodSource("provideTestCanRetrieveAccountInfo")
    public void testCanRetrieveActiveAccount(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            return this.service.canRetrieveActiveAccount(auth, getUser(account));
        });
    }

    @ParameterizedTest(name = "[{index}] requester={0}, resource={1}, expected={2}")
    @MethodSource("provideTestCanRetrieveAccountInfo")
    public void testCanRetrieveContacts(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            return this.service.canRetrieveContacts(auth, getUser(account));
        });
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owener={1}, expected={2}")
    @MethodSource("provideTestCanRetrieveAccountInfo")
    public void testCanRetrieveContact(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, contactAdapter(this.service::canRetrieveContact));
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owener={1}, expected={2}")
    @MethodSource("provideTestCanModifyAccountInfo")
    public void testCanCreateContact(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            return this.service.canCreateContact(auth, getUser(account));
        });
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owener={1}, expected={2}")
    @MethodSource("provideTestCanModifyAccountInfo")
    public void testCanUpdateContact(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, contactAdapter(this.service::canUpdateContact));
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owner={1}, expected={2}")
    @MethodSource("provideTestCanModifyAccountInfo")
    public void testCanDeleteContact(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, contactAdapter(this.service::canDeleteContact));
    }

    private Tester contactAdapter(BiFunction<JwtAuthenticationToken, String, Boolean> tester) {
        return (auth, account) -> {
            var id = "contact-id";
            if (account != null) {
                var contact = Contact.builder().id(id).user(account.getUser()).build();
                this.template.insert(contact);
            }
            return tester.apply(auth, id);
        };
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owner={1}, expected={2}")
    @MethodSource("provideTestCanRetrieveAccountInfo")
    public void testCanRetrieveRecords(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            return this.service.canRetrieveContacts(auth, getUser(account));
        });
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owner={1}, expected={2}")
    @MethodSource("provideTestCanRetrieveAccountInfo")
    public void testCanRetrieveContactRecords(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            var user = getUser(account);
            var contactId = "contact-id";
            if (account != null) {
                var contact = Contact.builder().id(contactId).user(account.getUser()).build();
                this.template.insert(contact);
            }
            return this.service.canRetrieveContactRecords(auth, user, contactId);
        });
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owener={1}, expected={2}")
    @MethodSource("provideTestCanRetrieveAccountInfo")
    public void testCanCreateRecord(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            return this.service.canCreateRecord(auth, getUser(account));
        });
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owener={1}, expected={2}")
    @MethodSource("provideTestCanModifyAccountInfo")
    public void testCanDeleteRecords(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            return this.service.canDeleteRecords(auth, getUser(account));
        });
    }

    @ParameterizedTest(name = "[{index}] requester={0}, owner={1}, expected={2}")
    @MethodSource("provideTestCanModifyAccountInfo")
    public void testCanDeleteRecord(Requester requester, Owner owner, boolean expected) {
        test(requester, owner, expected, (auth, account) -> {
            var id = "record-id";
            if (account != null) {
                var record = HistoryRecord.builder().id(id).user(account.getUser()).build();
                this.template.insert(record);
            }
            return this.service.canDeleteRecord(auth, id);
        });
    }

    static Stream<Arguments> provideTestCanRetrieveAccountInfo() {
        return Stream.of(
            scenario(requester(user(), none()), null, false),
            scenario(requester(user(), none()), owner(), false),
            scenario(requester(user(), none()), owner(preset(), false), false),
            scenario(requester(user(), none()), owner(preset(), true), true),
            scenario(requester(user(), none()), owner(usual(), false), false),
            scenario(requester(user(), none()), owner(usual(), true), false),

            scenario(requester(user(), inactive()), owner(), false),
            scenario(requester(user(), inactive()), owner(preset(), true), true),
            scenario(requester(user(), inactive()), owner(usual(), true), false),

            scenario(requester(user(), active()), owner(), true),
            scenario(requester(user(), active()), owner(preset(), true), true),
            scenario(requester(user(), active()), owner(usual(), true), false),

            scenario(requester(admin(), none()), owner(), false),
            scenario(requester(admin(), none()), owner(preset(), false), true),
            scenario(requester(admin(), none()), owner(preset(), true), true),
            scenario(requester(admin(), none()), owner(usual(), true), false),

            scenario(requester(admin(), inactive()), owner(), true),
            scenario(requester(admin(), inactive()), owner(preset(), false), true),
            scenario(requester(admin(), inactive()), owner(preset(), true), true),
            scenario(requester(admin(), inactive()), owner(usual(), true), false),

            scenario(requester(admin(), active()), owner(), true),
            scenario(requester(admin(), active()), owner(preset(), false), true),
            scenario(requester(admin(), active()), owner(preset(), true), true),
            scenario(requester(admin(), active()), owner(usual(), true), false)
        );
    }

    private static Stream<Arguments> provideTestCanModifyAccountInfo() {
        return Stream.of(
            scenario(requester(user(), none()), null, false),
            scenario(requester(user(), inactive()), owner(), false),
            scenario(requester(user(), none()), owner(preset(), false), false),
            scenario(requester(user(), none()), owner(preset(), true), false),
            scenario(requester(user(), none()), owner(usual(), false), false),
            scenario(requester(user(), none()), owner(usual(), true), false),

            scenario(requester(user(), inactive()), owner(), false),
            scenario(requester(user(), inactive()), owner(preset(),true), false),
            scenario(requester(user(), inactive()), owner(usual(), true), false),

            scenario(requester(user(), active()), owner(), true),
            scenario(requester(user(), active()), owner(preset(), true), false),
            scenario(requester(user(), active()), owner(usual(), true), false),

            scenario(requester(admin(), none()), owner(), false),
            scenario(requester(admin(), none()), owner(preset(), false), true),
            scenario(requester(admin(), none()), owner(preset(), true), true),
            scenario(requester(admin(), none()), owner(usual(), false), false),

            scenario(requester(admin(), inactive()), owner(), true),
            scenario(requester(admin(), inactive()), owner(preset(), false), true),
            scenario(requester(admin(), inactive()), owner(preset(), true), true),
            scenario(requester(admin(), inactive()), owner(usual(), false), false),

            scenario(requester(admin(), active()), owner(), true),
            scenario(requester(admin(), active()), owner(preset(), false), true),
            scenario(requester(admin(), active()), owner(preset(), true), true),
            scenario(requester(admin(), active()), owner(usual(), false), false)
        );
    }

    @ParameterizedTest(name = "[{index}] requester={0}, expected={1}")
    @MethodSource("provideTestHasAdminAccount")
    public void testIsAdmin(Requester requester, boolean expected) {
        if (requester.account != null) {
            this.template.insert(requester.account);
        }
        var role = requester.auth.getTokenAttributes().get("preferred_username");
        var account = requester.account();
        var message = String.format("role=%s, account=%s", role, account);
        var actual = this.service.isAdmin(requester.auth);
        assertEquals(expected, actual, message);
    }

    static Stream<Arguments> provideTestHasAdminAccount() {
        return Stream.of(
            Arguments.of(requester(user(), none()), false),
            Arguments.of(requester(user(), inactive()), false),
            Arguments.of(requester(user(), active()), false),
            Arguments.of(requester(admin(), none()), true),
            Arguments.of(requester(admin(), inactive()), true),
            Arguments.of(requester(admin(), active()), true)
        );
    }

    private<T> void test(Requester requester, Owner owner, boolean expected, Tester tester) {
        if (requester.account != null) {
            this.template.insert(requester.account);
        }

        Account ownerAccount = null;

        if (owner != null) {
            if (owner.present()) {
                ownerAccount = owner.account;
                this.template.insert(ownerAccount);
            } else {
                ownerAccount = requester.account;
            }
        }

        var role = requester.auth.getTokenAttributes().get("preferred_username");
        var account = requester.account();
        var message = String.format("role=%s, account=%s, owner=%s", role, account, owner);
        var actual = tester.apply(requester.auth, ownerAccount);
        assertEquals(expected, actual, message);
    }

    enum User {
        DEFAULT("default"),
        USUAL("other-user");
        final String value;
        private User(String value) {
            this.value = value;
        }
    }

    enum Role {
        USER("user"),
        ADMIN("admin");
        final String value;
        private Role(String value) {
            this.value = value;
        }
    }

    enum AccountMode {
        NONE,
        ACTIVE,
        INACTIVE;
    }

    static Role user() { return Role.USER; }
    static Role admin() { return Role.ADMIN; }
    static User preset() { return User.DEFAULT; }
    static User usual() { return User.USUAL; }
    static AccountMode none() { return AccountMode.NONE; }
    static AccountMode active() { return AccountMode.ACTIVE; }
    static AccountMode inactive() { return AccountMode.INACTIVE; }

    static Requester requester(Role role, AccountMode accountMode) {
        var user = "this-user";

        var auth = mock(JwtAuthenticationToken.class);
        when(auth.getName()).thenReturn(user);
        when(auth.getTokenAttributes())
            .thenReturn(Map.of("preferred_username", role.value));

        Account account = null;
        if (accountMode != AccountMode.NONE) {
            account = Account.builder()
                .id(user)
                .user(user)
                .username(role.value)
                .active(accountMode == AccountMode.ACTIVE)
                .build();
        }

        return new Requester(auth, account);
    }

    static Owner owner() {
        return new Owner(false, null);
    }

    static Owner owner(User user, boolean active) {
        var account = Account.builder()
            .id(user.value)
            .user(user.value)
            .active(active)
            .build();

        return new Owner(true, account);
    }

    static Arguments scenario(Requester requester, Owner owner, boolean expected) {
        return Arguments.of(requester, owner, expected);
    }

    record Requester(JwtAuthenticationToken auth, Account account) {}
    record Owner(boolean present, Account account) {}

    interface Tester extends BiFunction<JwtAuthenticationToken, Account, Boolean> {}

    String getUser(Account account) {
        return account != null ? account.getUser() : "unexisting-user";
    }

}
