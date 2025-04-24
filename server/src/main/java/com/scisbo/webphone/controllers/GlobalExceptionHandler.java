package com.scisbo.webphone.controllers;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.scisbo.webphone.dtos.controller.response.ErrorResponse;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.exceptions.InvalidValueException;
import com.scisbo.webphone.exceptions.PhotoUploadException;
import com.scisbo.webphone.utils.validation.ValidationResultFormatter;

import lombok.RequiredArgsConstructor;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final ValidationResultFormatter validationResultFormatter;

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({
        MissingPathVariableException.class,
        MissingServletRequestParameterException.class,
        MissingServletRequestPartException.class,
        ServletRequestBindingException.class,
        IllegalArgumentException.class,
        HttpMessageNotReadableException.class,
    })
    public ErrorResponse handleBadRequest(Exception e) {
        return new ErrorResponse("error.bad.request", e.getMessage());
    }


    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidValueException.class)
    public ErrorResponse handleInvalidValue(InvalidValueException e) {
        return new ErrorResponse(
            "error.invalid.value",
            e.getMessage(),
            Map.of("name", e.getName(), "value", e.getValue())
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PhotoUploadException.class)
    public ErrorResponse handlePhotoUpload(PhotoUploadException e) {
        return new ErrorResponse(
            "error.photo.upload",
            e.getMessage(),
            Map.of("url", e.getUrl())
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ErrorResponse handleEntityAlreadyExists(EntityAlreadyExistsException e) {
        return new ErrorResponse(
            "error.entity.already.exists",
            e.getMessage(),
            Map.of(
                "entity", e.getEntity(),
                "fieldName", e.getFieldName(),
                "fieldValue", e.getFieldValue()
            )
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(EntityNotFoundException.class)
    public ErrorResponse handleEntityNotFound(EntityNotFoundException e) {
        return new ErrorResponse(
            "error.entity.not.found",
            e.getMessage(),
            Map.of(
                "entity", e.getEntity(),
                "fieldName", e.getFieldName(),
                "fieldValue", e.getFieldValue()
            )
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorResponse handleMethodArgumentNotValid(
        MethodArgumentNotValidException e
    ) {
        BindingResult result = e.getBindingResult();
        String message = result.getAllErrors().stream()
            .map(ObjectError::getDefaultMessage)
            .sorted()
            .collect(Collectors.joining("; "));
        Object details = validationResultFormatter.formatFieldErrors(result.getFieldErrors());
        return new ErrorResponse("error.validation", message, details);
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(AccessDeniedException.class)
    public ErrorResponse handleAccessDeniedException(
        AccessDeniedException e
    ) {
        return new ErrorResponse("error.access.denied", e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler({
        NoHandlerFoundException.class,
        NoResourceFoundException.class,
    })
    public ErrorResponse handleNotFound(Exception e) {
        return new ErrorResponse("error.not.found", e.getMessage());
    }

    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ErrorResponse handleHttpRequestMethodNotSupported(
        HttpRequestMethodNotSupportedException e
    ) {
        return new ErrorResponse("error.method.not.supported", e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ErrorResponse handleHttpMediaTypeNotAcceptable(
        HttpMediaTypeNotAcceptableException e
    ) {
        return new ErrorResponse("error.media.type.not.acceptable", e.getMessage());
    }

    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ErrorResponse handleHttpMediaTypeNotSupported(
        HttpMediaTypeNotSupportedException e
    ) {
        return new ErrorResponse("error.media.type.not.supported", e.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ErrorResponse handle(Exception e) {
        System.err.println(e);
        return new ErrorResponse("error.server", "An unexpected error occurred");
    }

}
