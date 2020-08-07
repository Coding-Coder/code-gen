package com.gitee.gen.gen.postgresql;

import com.gitee.gen.gen.ColumnSelector;
import com.gitee.gen.gen.GeneratorConfig;
import com.gitee.gen.gen.TableDefinition;
import com.gitee.gen.gen.TableSelector;

import java.util.List;
import java.util.Map;

import static com.gitee.gen.util.FieldUtil.convertString;

/**
 * @author tanghc
 */
public class PostgreSqlTableSelector extends TableSelector {
    public PostgreSqlTableSelector(ColumnSelector columnSelector, GeneratorConfig generatorConfig) {
        super(columnSelector, generatorConfig);
    }

    private static String SHOW_TABLE_SQL =
            "SELECT relname, " +
                "obj_description(oid) AS cmt " +
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
        tableDefinition.setTableName(convertString(tableMap.get("RELNAME")));
        tableDefinition.setComment(convertString(tableMap.get("CMT")));
        return tableDefinition;
    }
}
