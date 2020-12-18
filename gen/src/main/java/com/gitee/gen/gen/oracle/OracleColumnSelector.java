package com.gitee.gen.gen.oracle;

import com.gitee.gen.gen.ColumnDefinition;
import com.gitee.gen.gen.ColumnSelector;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.TypeFormatter;
import org.apache.commons.lang.StringUtils;

import java.util.Map;
import java.util.Set;

/**
 * oracle表信息查询
 */
public class OracleColumnSelector extends ColumnSelector {

	private static final TypeFormatter TYPE_FORMATTER = new OracleTypeFormatter();

	private static final String COLUMN_SQL = "select "
			+ " utc.column_name as FIELD,utc.data_type TYPE, utc.data_scale SCALE, utc.data_length 最大长度, "
			+ " 		CASE utc.nullable WHEN 'N' THEN '否' ELSE '是' END 可空, "
			+ " utc.data_default 默认值,ucc.comments COMMENTS,UTC.table_name 表名, "
			+ " CASE UTC.COLUMN_NAME "
			+ " WHEN (select "
			+ " 		col.column_name "
			+ " 		from "
			+ " 		user_constraints con,user_cons_columns col "
			+ " 		where "
			+ " 	con.constraint_name=col.constraint_name and con.constraint_type='P' "
			+ " 		and col.table_name='%s')   THEN 'true' ELSE 'false' END AS KEY "
			+ " 		from "
			+ " user_tab_columns utc,user_col_comments ucc "
			+ " 		where "
			+ " utc.table_name = ucc.table_name "
			+ " and utc.column_name = ucc.column_name "
			+ " and utc.table_name = '%s' "
			+ " order by "
			+ " column_id ";

	public OracleColumnSelector(GeneratorConfig generatorConfig) {
		super(generatorConfig);
	}

	@Override
	protected String getColumnInfoSQL(String tableName) {
		return String.format(COLUMN_SQL, tableName, tableName);
	}
	
	@Override
	protected ColumnDefinition buildColumnDefinition(Map<String, Object> rowMap){
		Set<String> columnSet = rowMap.keySet();
		
		for (String columnInfo : columnSet) {
			rowMap.put(columnInfo.toUpperCase(), rowMap.get(columnInfo));
		}
		
		ColumnDefinition columnDefinition = new ColumnDefinition();
		
		columnDefinition.setColumnName((String)rowMap.get("FIELD"));

		columnDefinition.setIsIdentity(false);
		
		boolean isPk = "true".equalsIgnoreCase((String)rowMap.get("KEY"));
		columnDefinition.setIsPk(isPk);
		
		String type = (String)rowMap.get("TYPE");
		// 如果是number
		if (StringUtils.containsIgnoreCase(type, "number")) {
			// 有精度则为decimal，否则是int
			Object scaleCol = rowMap.get("SCALE");
			if (scaleCol == null) {
				scaleCol = 0;
			}
			String scale = String.valueOf(scaleCol);
			type = "0".equals(scale) ? "int" : "decimal";
		}
		columnDefinition.setType(TYPE_FORMATTER.format(type));
		
		columnDefinition.setComment((String)rowMap.get("COMMENTS"));

		return columnDefinition;
	}
	

}
