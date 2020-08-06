package com.gitee.gen.gen.mysql;

import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.ColumnDefinition;
import com.gitee.gen.gen.ColumnSelector;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.Set;

/**
 * mysql表信息查询
 *
 */
public class MySqlColumnSelector extends ColumnSelector {
	
	public MySqlColumnSelector(GeneratorConfig generatorConfig) {
		super(generatorConfig);
	}

	/**
	 * SHOW FULL COLUMNS FROM 表名
	 */
	@Override
	protected String getColumnInfoSQL(String tableName) {
		return "SHOW FULL COLUMNS FROM " + tableName;
	}
	
	/*
	 * {FIELD=username, EXTRA=, COMMENT=用户名, COLLATION=utf8_general_ci, PRIVILEGES=select,insert,update,references, KEY=PRI, NULL=NO, DEFAULT=null, TYPE=varchar(20)}
	 */
	@Override
	protected ColumnDefinition buildColumnDefinition(Map<String, Object> rowMap){
		Set<String> columnSet = rowMap.keySet();
		
		for (String columnInfo : columnSet) {
			rowMap.put(columnInfo.toUpperCase(), rowMap.get(columnInfo));
		}
		
		ColumnDefinition columnDefinition = new ColumnDefinition();
		
		columnDefinition.setColumnName((String)rowMap.get("FIELD"));
		
		boolean isIdentity = "auto_increment".equalsIgnoreCase((String)rowMap.get("EXTRA"));
		columnDefinition.setIsIdentity(isIdentity);
		
		boolean isPk = "PRI".equalsIgnoreCase((String)rowMap.get("KEY"));
		columnDefinition.setIsPk(isPk);
		
		String type = (String)rowMap.get("TYPE");
		columnDefinition.setType(buildType(type));
		
		columnDefinition.setComment((String)rowMap.get("COMMENT"));
		
		return columnDefinition;
	}
	
	// 将varchar(50)转换成VARCHAR
	private String buildType(String type){
		if (StringUtils.hasText(type)) {
			int index = type.indexOf("(");
			if (index > 0) {
				return type.substring(0, index).toUpperCase();
			}
			return type;
		}
		return "VARCHAR";
	}
	
}
