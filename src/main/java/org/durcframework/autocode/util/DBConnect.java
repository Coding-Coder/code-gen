package org.durcframework.autocode.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.durcframework.autocode.entity.DataSourceConfig;

public class DBConnect {
	public static Connection getConnection(DataSourceConfig config) throws ClassNotFoundException, SQLException
			 {
		
		Class.forName(config.getDriverClass());
		return DriverManager.getConnection(config.getJdbcUrl(),
				config.getUsername(), config.getPassword());
	}

	/**
	 * 测试连接,返回错误信息,无返回内容说明连接成功
	 * 
	 * @param config
	 * @return 返回错误信息,无返回内容说明连接成功
	 */
	public static String testConnection(DataSourceConfig dataSourceConfig) {
		Connection con = null;
		String ret = null;
		try {
			con = DBConnect.getConnection(dataSourceConfig);
			// 不为空说明连接成功
			if (con == null) {
				ret = dataSourceConfig.getDbName() + "连接失败";
			}
		} catch (ClassNotFoundException e) {
			ret = dataSourceConfig.getDbName() + "连接失败" + "<br>错误信息:"
					+ "找不到驱动" + dataSourceConfig.getDriverClass();
		} catch (SQLException e) {
			ret = dataSourceConfig.getDbName() + "连接失败" + "<br>错误信息:"
					+ e.getMessage();
		} finally {
			if (con != null) {
				try {
					con.close(); // 关闭连接,该连接无实际用处
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		
		return ret;
	}
}
