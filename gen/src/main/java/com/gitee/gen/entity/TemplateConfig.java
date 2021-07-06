package com.gitee.gen.entity;


import lombok.Data;

/**
 * 模板表
 */
@Data
public class TemplateConfig {
    private Integer id;
    private Integer groupId;
    private String groupName;
    /**
     * 模板名称
     */
    private String name;
    /**
     * 目录
     */
    private String folder;
    /**
     * 文件名称
     */
    private String fileName;
    /**
     * 内容
     */
    private String content;
    /**
     * 是否删除，1：已删除，0：未删除
     */
    private Integer isDeleted;
}
