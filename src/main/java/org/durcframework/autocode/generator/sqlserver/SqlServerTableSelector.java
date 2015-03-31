package org.durcframework.autocode.generator.sqlserver;

import org.durcframework.autocode.generator.DataBaseConfig;
import org.durcframework.autocode.generator.TableSelector;

public class SqlServerTableSelector extends TableSelector {
	// 查询数据库中表名
	// 返回格式schema.表名
	static String SQL_SHOW_TABLES = "SELECT SS.name + '.' + t.name"
			+ " FROM sysobjects t"
			+ " INNER JOIN sys.objects SO ON t.name = SO.name"
			+ " INNER JOIN sys.schemas  SS ON SO.schema_id = SS.schema_id"
			+ " WHERE t.xtype='u'" + " ORDER BY SS.name ASC,t.name ASC";

	public SqlServerTableSelector(DataBaseConfig dataBaseConfig) {
		super(dataBaseConfig);
	}

	@Override
	protected String getShowTablesSQL() {
		return SQL_SHOW_TABLES;
	}

}
