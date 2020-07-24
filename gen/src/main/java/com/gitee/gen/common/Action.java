package com.gitee.gen.common;

/**
 * @author tanghc
 */
public class Action {

    private static final String CODE_SUCCESS = "0";
    private static final String CODE_ERROR = "100";

    private static Result ok = new Result();
    static {
        ok.setCode(CODE_SUCCESS);
    }

    public static Result ok() {
        return ok;
    }

    public static Result ok(Object data) {
        Result result = new Result();
        result.setCode(CODE_SUCCESS);
        result.setData(data);
        return result;
    }

    public static Result err(String msg) {
        Result result = new Result();
        result.setCode(CODE_ERROR);
        result.setMsg(msg);
        return result;
    }
}
