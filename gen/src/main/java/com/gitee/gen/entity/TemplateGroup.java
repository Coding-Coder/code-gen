package com.gitee.gen.entity;

/**
 * @author : zsljava
 * @date Date : 2020-12-15 9:49
 * @Description: TODO
 */
public class TemplateGroup {
    private Integer id;
    private String groupName;
    private Integer isDeleted;

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return this.id;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupName() {
        return this.groupName;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getIsDelete() {
        return this.isDeleted;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) { return true; }
        if (o == null || getClass() != o.getClass()) {return false;}
        TemplateGroup that = (TemplateGroup) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TemplateGroup{" +
                "id=" + id +
                ",groupName='" + groupName + "'" +
                ",isDelete='" + isDeleted + "'" +
                '}';
    }

}