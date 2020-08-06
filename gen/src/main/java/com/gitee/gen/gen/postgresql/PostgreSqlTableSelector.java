package com.gitee.gen.gen.postgresql;

import com.gitee.gen.gen.ColumnSelector;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.TableDefinition;
import com.gitee.gen.gen.TableSelector;

import java.util.List;
import java.util.Map;

/**
 * @author tanghc
 */
public class PostgreSqlTableSelector extends TableSelector {
    public PostgreSqlTableSelector(ColumnSelector columnSelector, GeneratorConfig generatorConfig) {
        super(columnSelector, generatorConfig);
    }

    private static String SHOW_TABLE_SQL =
            "SELECT relname, " +
                "CAST ( obj_description ( relfilenode, 'pg_class' ) AS VARCHAR ) AS cmt " +
            "FROM pg_class C " +
            "WHERE relkind='r' AND relname NOT LIKE 'pg_%%' AND relname NOT LIKE 'sql_%%' AND relchecks=0 " +
            "%s " +
            "ORDER BY relname";

    @Override
    protected String getShowTablesSQL(String showParam) {
        List<String> tableNames = wrapTableNames();
        String and = "";
        if (!tableNames.isEmpty()) {
            and = String.format("AND relname IN (%s)  ", String.join(",", tableNames));
        }
        return String.format(SHOW_TABLE_SQL, and);
    }

    @Override
    protected TableDefinition buildTableDefinition(Map<String, Object> tableMap) {
        TableDefinition tableDefinition = new TableDefinition();
        tableDefinition.setTableName((String)tableMap.get("RELNAME"));
        tableDefinition.setComment((String)tableMap.get("CMT"));
        return tableDefinition;
    }
}
