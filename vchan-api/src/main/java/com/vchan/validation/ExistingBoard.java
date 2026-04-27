package com.vchan.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = BoardValidator.class)  // Links annotation to logic
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ExistingBoard {
    String message() default "Non - existing board";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
