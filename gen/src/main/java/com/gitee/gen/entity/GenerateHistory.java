package com.gitee.gen.entity;


import lombok.Data;

import java.util.Date;

/**
 * 构建历史
 */
@Data
public class GenerateHistory {
    private Integer id;
    private String configContent;
    private String md5Value;
    private Date generateTime;
}