package com.scisbo.webphone.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.scisbo.webphone.common.web.RestUtils;
import com.scisbo.webphone.dtos.controller.request.CreateAccountRequest;
import com.scisbo.webphone.dtos.controller.request.CreateContactRequest;
import com.scisbo.webphone.dtos.controller.request.CreateHistoryRecordRequest;
import com.scisbo.webphone.dtos.controller.request.NumberRequest;
import com.scisbo.webphone.dtos.controller.request.SipRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateAccountRequest;
import com.scisbo.webphone.dtos.controller.request.UpdateContactRequest;
import com.scisbo.webphone.dtos.service.AccountDto;
import com.scisbo.webphone.dtos.service.ContactDto;
import com.scisbo.webphone.dtos.service.CreateContactDto;
import com.scisbo.webphone.dtos.service.HistoryRecordDto;
import com.scisbo.webphone.dtos.service.PhotoDto;
import com.scisbo.webphone.dtos.service.SipDto;
import com.scisbo.webphone.log.core.SpelLoggerFactory;
import com.scisbo.webphone.mappers.AccountMapper;
import com.scisbo.webphone.mappers.ContactMapper;
import com.scisbo.webphone.mappers.HistoryMapper;
import com.scisbo.webphone.mappers.PageMapper;
import com.scisbo.webphone.mappers.PhotoMapper;
import com.scisbo.webphone.models.CallStatus;
import com.scisbo.webphone.models.converters.CallStatusConverter;
import com.scisbo.webphone.models.converters.NumberTypeConverter;
import com.scisbo.webphone.services.AccountService;
import com.scisbo.webphone.services.AuthService;
import com.scisbo.webphone.services.ContactService;
import com.scisbo.webphone.services.HistoryService;
import com.scisbo.webphone.services.PhotoService;
import com.scisbo.webphone.utils.validation.SimpleValidationResultFormatter;

@WebMvcTest(properties = "server.servlet.context-path=")
@Import({
    WebSecurityConfig.class,
    ContactMapper.class,
    HistoryMapper.class,
    PhotoMapper.class,
    AccountMapper.class,
    PageMapper.class,
    NumberTypeConverter.class,
    CallStatusConverter.class,
    SimpleValidationResultFormatter.class,
})
public class WebSecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ContactService contactService;

    @MockitoBean
    private HistoryService historyService;

    @MockitoBean
    private PhotoService photoService;

    @MockitoBean
    private AccountService accountService;

    @MockitoBean("authService")
    private AuthService authService;

    @MockitoBean
    private SpelLoggerFactory spelLoggerFactory;

    @ParameterizedTest(name = "[{index}] Request: {0}")
    @MethodSource("provideTestRequest_withoutJwt_responseUnauthorized")
    public void testRequest_withoutJwt_responseUnauthorized(MockHttpServletRequestBuilder req) throws Exception {
        this.mockMvc
            .perform(req)
            .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest(name = "[{index}] Request: {0}, Mock {1}")
    @MethodSource("provideTestRequest_withJwt_responseForbidden")
    public void testRequest_withJwt_responseForbidden(
        MockHttpServletRequestBuilder req,
        Consumer<AuthService> mock
    ) throws Exception {
        mock.accept(this.authService);
        this.mockMvc
            .perform(req)
            .andExpect(status().isForbidden());
    }

    @ParameterizedTest(name = "[{index}] Request: {0}, Mock {1}")
    @MethodSource("provideTestRequest_withJwt_responseSuccess")
    public void testRequest_withJwt_responseSuccess(
        MockHttpServletRequestBuilder req,
        Consumer<ServiceMap> mock
    ) throws Exception {

        mock.accept(new ServiceMap(
            this.authService,
            this.contactService,
            this.historyService,
            this.photoService,
            this.accountService
        ));

        this.mockMvc
            .perform(req)
            .andExpect(status().is2xxSuccessful());
    }

    private static Stream<Arguments> provideTestRequest_withoutJwt_responseUnauthorized() {
        return Stream.of(
            Arguments.of(get("/api/history/user/user-id-123")),
            Arguments.of(get("/api/history/user/user-id-123/contact/contact-id-123")),
            Arguments.of(post("/api/history/user/user-id-123")),
            Arguments.of(delete("/api/history/user/user-id-123")),
            Arguments.of(delete("/api/history/record-id-123")),

            Arguments.of(get("/api/contacts/user/user-id-123")),
            Arguments.of(get("/api/contacts/contact-id-123")),
            Arguments.of(post("/api/contacts/user/user-id-123")),
            Arguments.of(put("/api/contacts/contact-id-123")),
            Arguments.of(delete("/api/contacts/contact-id-123")),

            Arguments.of(get("/api/photos/photo-id-123")),
            Arguments.of(post("/api/photos")),

            Arguments.of(get("/api/accounts")),
            Arguments.of(get("/api/accounts/account-id-123")),
            Arguments.of(post("/api/accounts")),
            Arguments.of(put("/api/accounts/account-id-123")),
            Arguments.of(delete("/api/contacts/account-id-123"))
        );
    }

    private static Stream<Arguments> provideTestRequest_withJwt_responseForbidden() {
        return Stream.of(
            Arguments.of(
                withJwt(get("/api/history/user/user1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canRetrieveRecords(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(get("/api/history/user/user1/contact/contact1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canRetrieveContactRecords(any(JwtAuthenticationToken.class), eq("user1"), eq("contact1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(post("/api/history/user/user1"), "user")
                .header("Content-Type", "application/json")
                .content(RestUtils.toJson(getCreateHistoryRecordRequest())),
                (Consumer<AuthService>) (service) -> {
                    when(service.canRetrieveContactRecords(any(JwtAuthenticationToken.class), eq("user1"), eq("contact1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(delete("/api/history/user/user1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canDeleteRecords(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(delete("/api/history/record1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canDeleteRecord(any(JwtAuthenticationToken.class), eq("record1")))
                        .thenReturn(false);
                }
            ),

            Arguments.of(
                withJwt(get("/api/contacts/user/user1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canRetrieveContacts(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(get("/api/contacts/contact1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canRetrieveContact(any(JwtAuthenticationToken.class), eq("contact1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(post("/api/contacts/user/user1"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getCreateContactRequest())),
                (Consumer<AuthService>) (service) -> {
                    when(service.canCreateContact(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(post("/api/contacts/user/user1/batch"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getCreateContactsRequest())),
                (Consumer<AuthService>) (service) -> {
                    when(service.canCreateContact(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(put("/api/contacts/contact1"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getUpdateContactRequest())),
                (Consumer<AuthService>) (service) -> {
                    when(service.canUpdateContact(any(JwtAuthenticationToken.class), eq("contact1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(delete("/api/contacts/contact1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canDeleteContact(any(JwtAuthenticationToken.class), eq("contact1")))
                        .thenReturn(false);
                }
            ),

            Arguments.of(
                withJwt(get("/api/accounts"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.isAdmin(any())).thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(get("/api/accounts/user/user1/active"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.canRetrieveActiveAccount(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(get("/api/accounts/account1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(post("/api/accounts"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getCreateAccountRequest())),
                (Consumer<AuthService>) (service) -> {
                    when(service.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(put("/api/accounts/account1"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getUpdateAccountRequest())),
                (Consumer<AuthService>) (service) -> {
                    when(service.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(false);
                }
            ),
            Arguments.of(
                withJwt(delete("/api/accounts/account1"), "user"),
                (Consumer<AuthService>) (service) -> {
                    when(service.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(false);
                }
            )
        );
    }

    private static Stream<Arguments> provideTestRequest_withJwt_responseSuccess() {
        return Stream.of(
            Arguments.of(
                withJwt(get("/api/history/user/user1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canRetrieveRecords(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(true);
                    when(map.historyService.getPageByUser(any(), any()))
                        .thenReturn(new PageImpl<>(List.of()));
                }
            ),
            Arguments.of(
                withJwt(get("/api/history/user/user1/contact/contact1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canRetrieveContactRecords(any(JwtAuthenticationToken.class), eq("user1"), eq("contact1")))
                        .thenReturn(true);
                    when(map.historyService.getPageSummaryByContactId(any(), any(), any()))
                        .thenReturn(new PageImpl<>(List.of()));
                }
            ),
            Arguments.of(
                withJwt(post("/api/history/user/user1"), "user")
                .header("Content-Type", "application/json")
                .content(RestUtils.toJson(getCreateHistoryRecordRequest())),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canCreateRecord(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(true);
                    when(map.historyService.create(any()))
                        .thenReturn(HistoryRecordDto.builder().status(CallStatus.MISSED).build());
                }
            ),
            Arguments.of(
                withJwt(delete("/api/history/user/user1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canDeleteRecords(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(true);
                }
            ),
            Arguments.of(
                withJwt(delete("/api/history/record1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canDeleteRecord(any(JwtAuthenticationToken.class), eq("record1")))
                        .thenReturn(true);
                }
            ),

            Arguments.of(
                withJwt(get("/api/contacts/user/user1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canRetrieveContacts(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(true);
                    when(map.contactService.getByUser(any(), any(), any()))
                        .thenReturn(new PageImpl<>(List.of()));
                }
            ),
            Arguments.of(
                withJwt(get("/api/contacts/contact1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canRetrieveContact(any(JwtAuthenticationToken.class), eq("contact1")))
                        .thenReturn(true);
                    when(map.contactService.getById(any()))
                        .thenReturn(ContactDto.builder().numbers(List.of()).build());
                }
            ),
            Arguments.of(
                withJwt(post("/api/contacts/user/user1"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getCreateContactRequest())),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canCreateContact(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(true);
                    when(map.contactService.create(eq("user1"), any(CreateContactDto.class)))
                        .thenReturn(ContactDto.builder().numbers(List.of()).build());
                }
            ),
            Arguments.of(
                withJwt(post("/api/contacts/user/user1/batch"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getCreateContactsRequest())),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canCreateContact(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(true);
                    when(map.contactService.create(eq("user1"), any(List.class)))
                        .thenReturn(List.of());
                }
            ),
            Arguments.of(
                withJwt(put("/api/contacts/contact1"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getUpdateContactRequest())),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canUpdateContact(any(JwtAuthenticationToken.class), eq("contact1")))
                        .thenReturn(true);
                    when(map.contactService.update(any()))
                        .thenReturn(ContactDto.builder().numbers(List.of()).build());
                }
            ),
            Arguments.of(
                withJwt(delete("/api/contacts/contact1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canDeleteContact(any(JwtAuthenticationToken.class), eq("contact1")))
                        .thenReturn(true);
                }
            ),

            Arguments.of(
                withJwt(get("/api/photos/photo1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.photoService.getById(any()))
                        .thenReturn(PhotoDto.builder().build());
                }
            ),

            Arguments.of(
                withJwt(get("/api/accounts"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(true);
                    when(map.accountService.getAll(null, PageRequest.of(0, 50)))
                        .thenReturn(new PageImpl<>(List.of(), PageRequest.of(0, 50), 1));
                }
            ),
            Arguments.of(
                withJwt(get("/api/accounts/account1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(true);
                    when(map.accountService.get("account1"))
                        .thenReturn(AccountDto.builder().sip(SipDto.builder().build()).build());
                }
            ),
            Arguments.of(
                withJwt(get("/api/accounts/user/user1/active"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.canRetrieveActiveAccount(any(JwtAuthenticationToken.class), eq("user1")))
                        .thenReturn(true);
                    when(map.accountService.getActiveByUser("user1"))
                        .thenReturn(AccountDto.builder().sip(SipDto.builder().build()).build());
                }
            ),
            Arguments.of(
                withJwt(post("/api/accounts"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getCreateAccountRequest())),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(true);
                    when(map.accountService.create(any()))
                        .thenReturn(AccountDto.builder().sip(SipDto.builder().build()).build());
                }
            ),
            Arguments.of(
                withJwt(put("/api/accounts/account1"), "user")
                    .header("Content-Type", "application/json")
                    .content(RestUtils.toJson(getUpdateAccountRequest())),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(true);
                    when(map.accountService.update(any()))
                        .thenReturn(AccountDto.builder().sip(SipDto.builder().build()).build());
                }
            ),
            Arguments.of(
                withJwt(delete("/api/accounts/account1"), "user"),
                (Consumer<ServiceMap>) (map) -> {
                    when(map.authService.isAdmin(any(JwtAuthenticationToken.class)))
                        .thenReturn(true);
                }
            )
        );
    }

    private static MockHttpServletRequestBuilder withJwt(MockHttpServletRequestBuilder req, String sub) {
        return req.with(jwt().jwt(jwt -> jwt.claim("sub", sub)));
    }

    private static record ServiceMap(
        AuthService authService,
        ContactService contactService,
        HistoryService historyService,
        PhotoService photoService,
        AccountService accountService
    ) {}

    private static CreateHistoryRecordRequest getCreateHistoryRecordRequest() {
        return CreateHistoryRecordRequest.builder()
           .number("1234")
           .status("incoming")
           .startDate(OffsetDateTime.now())
           .build();
    }

    private static List<CreateContactRequest> getCreateContactsRequest() {
        return List.of(CreateContactRequest.builder()
            .name("name")
            .numbers(List.of(
                NumberRequest.builder()
                    .type("work")
                    .number("1234")
                    .build()))
            .build());
    }

    private static CreateContactRequest getCreateContactRequest() {
        return CreateContactRequest.builder()
            .name("name")
            .numbers(List.of(
                NumberRequest.builder()
                    .type("work")
                    .number("1234")
                    .build()))
            .build();
    }

    private static UpdateContactRequest getUpdateContactRequest() {
        return UpdateContactRequest.builder()
            .name("name")
            .numbers(List.of(
                NumberRequest.builder()
                    .type("work")
                    .number("1234")
                    .build()))
            .build();
    }

    private static CreateAccountRequest getCreateAccountRequest() {
        return CreateAccountRequest.builder()
            .user("user")
            .username("username")
            .active(true)
            .sip(SipRequest.builder()
                .username("username")
                .password("password")
                .domain("domain")
                .proxy("proxy")
                .build())
            .build();
    }

    private static UpdateAccountRequest getUpdateAccountRequest() {
        return UpdateAccountRequest.builder()
            .username("username")
            .active(true)
            .sip(SipRequest.builder()
                .username("username")
                .password("password")
                .domain("domain")
                .proxy("proxy")
                .build())
            .build();
    }

}
