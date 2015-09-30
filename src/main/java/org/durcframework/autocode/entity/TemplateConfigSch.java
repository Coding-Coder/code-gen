package org.durcframework.autocode.entity;

import org.durcframework.core.SearchEntity;
import org.durcframework.core.expression.annotation.LikeDoubleField;
import org.durcframework.core.expression.annotation.ValueField;

public class TemplateConfigSch extends SearchEntity{

    private Integer tcIdSch;
    private String nameSch;
    private String savePathSch;
    private String contentSch;
    private String backUserSch;

    public void setTcIdSch(Integer tcIdSch){
        this.tcIdSch = tcIdSch;
    }
    
    @ValueField(column = "tc_id")
    public Integer getTcIdSch(){
        return this.tcIdSch;
    }
  
    @LikeDoubleField(column = "name")
    public String getNameSch() {
		return nameSch;
	}

	public void setNameSch(String nameSch) {
		this.nameSch = nameSch;
	}

	public void setSavePathSch(String savePathSch){
        this.savePathSch = savePathSch;
    }
    
    @ValueField(column = "save_path")
    public String getSavePathSch(){
        return this.savePathSch;
    }

    public void setContentSch(String contentSch){
        this.contentSch = contentSch;
    }
    
    @ValueField(column = "content")
    public String getContentSch(){
        return this.contentSch;
    }

    public void setBackUserSch(String backUserSch){
        this.backUserSch = backUserSch;
    }
    
    @ValueField(column = "back_user")
    public String getBackUserSch(){
        return this.backUserSch;
    }


}