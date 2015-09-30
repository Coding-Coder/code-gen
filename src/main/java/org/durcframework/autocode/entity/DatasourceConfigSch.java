package org.durcframework.autocode.entity;

import org.durcframework.core.SearchEntity;
import org.durcframework.core.expression.annotation.ValueField;

public class DatasourceConfigSch extends SearchEntity{

    private Integer dcIdSch;
    private String nameSch;
    private String driverClassSch;
    private String jdbcUrlSch;
    private String usernameSch;
    private String passwordSch;
    private String backUserSch;

    public void setDcIdSch(Integer dcIdSch){
        this.dcIdSch = dcIdSch;
    }
    
    @ValueField(column = "dc_id")
    public Integer getDcIdSch(){
        return this.dcIdSch;
    }

    public void setNameSch(String nameSch){
        this.nameSch = nameSch;
    }
    
    @ValueField(column = "name")
    public String getNameSch(){
        return this.nameSch;
    }

    public void setDriverClassSch(String driverClassSch){
        this.driverClassSch = driverClassSch;
    }
    
    @ValueField(column = "driver_class")
    public String getDriverClassSch(){
        return this.driverClassSch;
    }

    public void setJdbcUrlSch(String jdbcUrlSch){
        this.jdbcUrlSch = jdbcUrlSch;
    }
    
    @ValueField(column = "jdbc_url")
    public String getJdbcUrlSch(){
        return this.jdbcUrlSch;
    }

    public void setUsernameSch(String usernameSch){
        this.usernameSch = usernameSch;
    }
    
    @ValueField(column = "username")
    public String getUsernameSch(){
        return this.usernameSch;
    }

    public void setPasswordSch(String passwordSch){
        this.passwordSch = passwordSch;
    }
    
    @ValueField(column = "password")
    public String getPasswordSch(){
        return this.passwordSch;
    }

    public void setBackUserSch(String backUserSch){
        this.backUserSch = backUserSch;
    }
    
    @ValueField(column = "back_user")
    public String getBackUserSch(){
        return this.backUserSch;
    }


}