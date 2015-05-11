package org.durcframework.autocode.database;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.ibatis.datasource.pooled.PooledDataSourceFactory;
import org.apache.ibatis.jdbc.SQL;
import org.apache.ibatis.jdbc.SqlRunner;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.scripting.xmltags.DynamicSqlSource;
import org.apache.ibatis.scripting.xmltags.TextSqlNode;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.transaction.TransactionFactory;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;


public class MybatisTest {

	private static Connection conn=null;
	private static SqlRunner sqlRunner;
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Properties properties = new Properties();
		properties.setProperty("driver", "com.mysql.jdbc.Driver");
		properties.setProperty("url", "jdbc:mysql://localhost:3306/auto_code");
		properties.setProperty("username", "root");
		properties.setProperty("password", "root");
		PooledDataSourceFactory pooledDataSourceFactory = new PooledDataSourceFactory();
		pooledDataSourceFactory.setProperties(properties);
		DataSource dataSource = pooledDataSourceFactory.getDataSource();

		TransactionFactory transactionFactory = new JdbcTransactionFactory();
		Environment environment = new Environment("development",
				transactionFactory, dataSource);
		Configuration configuration = new Configuration(environment);
		//configuration.addMapper(BlogMapper.class);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder()
				.build(configuration);
		
		SqlSession session = sqlSessionFactory.openSession();
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("dc_id", 2);
		
		SQL sql = new SQL();
		sql.SELECT("*")
		.FROM("datasource_config")
		.WHERE("dc_id=${dc_id}");
		
		
		String sqlStr = sql.toString();
		System.out.println("sqlStr:" + sqlStr);
		try {
			conn = sqlSessionFactory.getConfiguration().getEnvironment().getDataSource().getConnection();
			sqlRunner=new SqlRunner(conn);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		TextSqlNode node =new TextSqlNode(sqlStr);	
		DynamicSqlSource s=new DynamicSqlSource(sqlSessionFactory.getConfiguration(),
				node);	
		//此外对于静态SQL，ibatis还提供了StaticSqlSource
		BoundSql boundSql = s.getBoundSql(params);
		
			try {
				System.out.println("boundSql.getSql():" + boundSql.getSql());
				List<Map<String, Object>> map = sqlRunner.selectAll(boundSql.getSql(), new Object[]{});
				conn.commit();
			} catch (SQLException e) {
				try {
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
				e.printStackTrace();
			}finally{
				try {
					conn.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
	}

}

/*
 	private Connection conn=null;
	private SqlRunner sqlRunner;
	
	{
		
		try {
			conn = sessionFactory.getConfiguration().getEnvironment().getDataSource().getConnection();
			sqlRunner=new SqlRunner(conn);
		} catch (SQLException e) {
			logger.error(e);
		}

	}

public void deletPerson(Map keysMap) {
		BEGIN(); // Clears ThreadLocal variable
		DELETE_FROM("PERSON");
		WHERE("ID = #{id}");


		TextSqlNode node =new TextSqlNode(SQL());	
		DynamicSqlSource s=new DynamicSqlSource(sessionFactory.getConfiguration(),
				node);	
		//此外对于静态SQL，ibatis还提供了StaticSqlSource
		BoundSql sql = s.getBoundSql(keysMap);
		logger.debug(sql.getSql());		
		

		try {
			sqlRunner.delete(sql.getSql(),keysMap.get("id"));
			conn.commit();
		} catch (Exception e) {
			conn.rollback();
			throw e;
		}		
}
 * */
