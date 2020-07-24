package com.gitee.gen.entity;


/**
 * 模板表
 */
public class TemplateConfig {
    private Integer id;
    /** 模板名称 */
    private String name;
    /** 文件名称 */
    private String fileName;
    /** 内容 */
    private String content;
    /** 是否删除，1：已删除，0：未删除 */
    private Integer isDeleted;

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return this.id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return this.content;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getIsDeleted() {
        return this.isDeleted;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) { return true; }
        if (o == null || getClass() != o.getClass()) {return false;}
        TemplateConfig that = (TemplateConfig) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TemplateConfig{" +
                "id=" + id +
                ",name='" + name + "'" +
                ",fileName='" + fileName + "'" +
                ",content='" + content + "'" +
                ",isDeleted='" + isDeleted + "'" +
                '}';
    }

}