package com.vchan.validation;

import com.vchan.dto.Board;
import com.vchan.repo.BoardRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class BoardValidator implements ConstraintValidator<ExistingBoard, String> {

    @Autowired
    private BoardRepository boardRepository;
    private List<String> existingBoardCodes;

    @Override
    public void initialize(ExistingBoard constraintAnnotation) {
        existingBoardCodes = boardRepository.getBoards().stream().map(Board::code).toList();
    }

    @Override
    public boolean isValid(String code, ConstraintValidatorContext context) {
        if (code == null || code.isBlank()) return false;
        return existingBoardCodes.contains(code);
    }
}
