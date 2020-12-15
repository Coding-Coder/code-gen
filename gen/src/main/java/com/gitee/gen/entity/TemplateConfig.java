package com.gitee.gen.entity;


import java.util.Objects;

/**
 * 模板表
 */
public class TemplateConfig {
    private Integer id;
    private Integer groupId;
    private String groupName;
    /** 模板名称 */
    private String name;
    /** 文件名称 */
    private String fileName;
    /** 内容 */
    private String content;
    /** 是否删除，1：已删除，0：未删除 */
    private Integer isDeleted;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TemplateConfig that = (TemplateConfig) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(groupId, that.groupId) &&
                Objects.equals(groupName, that.groupName) &&
                Objects.equals(name, that.name) &&
                Objects.equals(fileName, that.fileName) &&
                Objects.equals(content, that.content) &&
                Objects.equals(isDeleted, that.isDeleted);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, groupId, groupName, name, fileName, content, isDeleted);
    }

    @Override
    public String toString() {
        return "TemplateConfig{" +
                "id=" + id +
                ", groupId=" + groupId +
                ", groupName='" + groupName + '\'' +
                ", name='" + name + '\'' +
                ", fileName='" + fileName + '\'' +
                ", content='" + content + '\'' +
                ", isDeleted=" + isDeleted +
                '}';
    }
}