package org.durcframework.autocode.generator;

import java.util.HashMap;
import java.util.Map;

import org.durcframework.autocode.generator.mysql.MySqlService;
import org.durcframework.autocode.generator.sqlserver.SqlServerService;
import org.durcframework.core.DurcException;

public class SQLServiceFactory {

	private static Map<String, SQLService> SERVICE_MAP = new HashMap<String, SQLService>(
			20);

	public static SQLService build(DataBaseConfig dataBaseConfig) {
		String driverClass = dataBaseConfig.getDriverClass();
		SQLService service = SERVICE_MAP.get(driverClass);

		if (service == null) {

			service = findSqlService(driverClass);

			if (service != null) {
				SERVICE_MAP.put(driverClass, service);
			} else {
				throw new DurcException("本系统暂不支持该数据源("
						+ dataBaseConfig.getDriverClass() + ")");
			}

		}

		return service;
	}

	private static SQLService findSqlService(String driverClass) {
		if (driverClass.contains("mysql")) {
			return new MySqlService();
		}
		if (driverClass.contains("jtds")) {
			return new SqlServerService();
		}
		if (driverClass.contains("sqlserver")) {
			return new SqlServerService();
		}
		// ... 添加其他数据库

		return null;
	}

}
