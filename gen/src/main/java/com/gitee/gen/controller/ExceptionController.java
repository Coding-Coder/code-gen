package com.gitee.gen.controller;

import com.gitee.gen.common.Action;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局错误处理
 *
 * @author tanghc
 */
@RestControllerAdvice
public class ExceptionController {

    @ExceptionHandler(Exception.class)
    public Object exceptionHandler(Exception e) {
        return Action.err(e.getMessage());
    }

}
