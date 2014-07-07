package org.durcframework.autocode.generator.sqlserver;

import java.util.Map;
import java.util.Set;

import org.durcframework.autocode.generator.ColumnDefinition;
import org.durcframework.autocode.generator.ColumnSelector;
import org.durcframework.autocode.generator.DataBaseConfig;

public class SqlServerColumnSelector extends ColumnSelector {
	
	

	public SqlServerColumnSelector(DataBaseConfig dataBaseConfig) {
		super(dataBaseConfig);
	}

	
	/**
SELECT  
	SCHEMA_NAME(bt.schema_id) AS [schema]
	, col.name AS table_name
	, bt.name AS type
	, col.is_identity
	,(
			SELECT COUNT(1) FROM sys.indexes IDX 
			    INNER JOIN sys.index_columns IDXC 
			        ON IDX.[object_id]=IDXC.[object_id] 
			            AND IDX.index_id=IDXC.index_id 
			    LEFT JOIN sys.key_constraints KC 
			        ON IDX.[object_id]=KC.[parent_object_id] 
			            AND IDX.index_id=KC.unique_index_id 
			    INNER JOIN sys.objects O 
			        ON O.[object_id]=IDX.[object_id]
			WHERE O.[object_id]=col.[object_id] 
			AND O.type='U' 
			AND O.is_ms_shipped=0 
			AND IDX.is_primary_key=1
			AND IDXC.Column_id=col.column_id
		) AS is_pk
FROM sys.columns col 
LEFT OUTER JOIN sys.types bt on bt.user_type_id = col.system_type_id 
WHERE col.object_id = object_id('back_user_opt_rec')
ORDER BY [schema] ASC,column_name ASC 
	 */
	@Override
	protected String getTableDetailSQL(String tableName) {
		
		StringBuilder sb = new StringBuilder();
		sb
		.append("SELECT")
		.append("	 col.name AS column_name")
		.append("	, bt.name AS type")
		.append("	, col.is_identity")
		.append("	,(")
		.append("		SELECT COUNT(1) FROM sys.indexes IDX ")
		.append("		INNER JOIN sys.index_columns IDXC ")
		.append("		ON IDX.[object_id]=IDXC.[object_id] ")
		.append("		AND IDX.index_id=IDXC.index_id ")
		.append("		LEFT JOIN sys.key_constraints KC ")
		.append("		ON IDX.[object_id]=KC.[parent_object_id] ")
		.append("		AND IDX.index_id=KC.unique_index_id ")
		.append("		INNER JOIN sys.objects O ")
		.append("		ON O.[object_id]=IDX.[object_id] ")
		.append("		WHERE O.[object_id]=col.[object_id] ")
		.append("		AND O.type='U' ")
		.append("		AND O.is_ms_shipped=0 ")
		.append("		AND IDX.is_primary_key=1 ")
		.append("		AND IDXC.Column_id=col.column_id ")
		.append("	) AS is_pk ")
		.append("FROM sys.columns col ")
		.append("LEFT OUTER JOIN sys.types bt on bt.user_type_id = col.system_type_id ")
		.append("WHERE col.object_id = object_id('").append(tableName).append("') ")
		.append("ORDER BY col.column_id");
		
		return sb.toString();
	}


	/*
	 * [{COLUMN_NAME=opt_date, SCHEMA=sys, IS_IDENTITY=false, IS_PK=0, TYPE=datetime}
	 * , {COLUMN_NAME=opt_id, SCHEMA=sys, IS_IDENTITY=true, IS_PK=1, TYPE=int}
	 * , {COLUMN_NAME=passport_name, SCHEMA=sys, IS_IDENTITY=false, IS_PK=0, TYPE=varchar}
	 * , {COLUMN_NAME=remark, SCHEMA=sys, IS_IDENTITY=false, IS_PK=0, TYPE=varchar}]
	 */
	@Override
	protected ColumnDefinition buildColumnDefinition(Map<String, Object> rowMap) {
		Set<String> columnSet = rowMap.keySet();
		
		for (String columnInfo : columnSet) {
			rowMap.put(columnInfo.toUpperCase(), rowMap.get(columnInfo));
		}
		
		ColumnDefinition columnDefinition = new ColumnDefinition();
		
		columnDefinition.setColumnName((String)rowMap.get("COLUMN_NAME"));
		columnDefinition.setIsIdentity((Boolean)rowMap.get("IS_IDENTITY"));
		boolean isPk = (Integer)rowMap.get("IS_PK") == 1;
		columnDefinition.setIsPk(isPk);
		columnDefinition.setType((String)rowMap.get("TYPE"));
		
		return columnDefinition;
	}

}
