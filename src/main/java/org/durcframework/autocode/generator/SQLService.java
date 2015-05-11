package org.durcframework.autocode.generator;


public interface SQLService {

	public TableSelector getTableSelector(DataBaseConfig dataBaseConfig);

	public ColumnSelector getColumnSelector(DataBaseConfig dataBaseConfig);

}
