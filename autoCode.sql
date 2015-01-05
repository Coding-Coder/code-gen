/*
SQLyog Ultimate v11.24 (32 bit)
MySQL - 5.0.85-community-nt : Database - auto_code
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`auto_code` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `auto_code`;

/*Table structure for table `back_user` */

DROP TABLE IF EXISTS `back_user`;

CREATE TABLE `back_user` (
  `username` varchar(20) NOT NULL,
  `password` varchar(50) NOT NULL,
  `add_time` datetime NOT NULL,
  PRIMARY KEY  (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `back_user` */

insert  into `back_user`(`username`,`password`,`add_time`) values ('admin','admin','2014-06-24 10:12:49');

/*Table structure for table `datasource_config` */

DROP TABLE IF EXISTS `datasource_config`;

CREATE TABLE `datasource_config` (
  `dc_id` int(11) NOT NULL auto_increment,
  `name` varchar(20) default NULL,
  `driver_class` varchar(50) default NULL,
  `jdbc_url` varchar(100) default NULL,
  `username` varchar(50) default NULL,
  `password` varchar(50) default NULL,
  `back_user` varchar(20) default NULL,
  PRIMARY KEY  (`dc_id`),
  KEY `f_username_user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;


/*Table structure for table `template_config` */

DROP TABLE IF EXISTS `template_config`;

CREATE TABLE `template_config` (
  `tc_id` int(11) NOT NULL auto_increment,
  `name` varchar(50) default NULL,
  `save_path` varchar(100) default NULL,
  `content` text,
  `back_user` varchar(20) default NULL,
  PRIMARY KEY  (`tc_id`),
  KEY `f_backuser` (`back_user`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `template_config` */

insert  into `template_config`(`tc_id`,`name`,`save_path`,`content`,`back_user`) values (2,'Entity',NULL,'package ${context.packageName}.entity;\r\n\r\npublic class ${context.javaBeanName} {\r\n#foreach($column in $columns) \r\n	private ${column.javaType} ${column.javaFieldName};\r\n#end\r\n\r\n#foreach(${column} in ${columns}) \r\n	public void set${column.javaFieldNameUF}(${column.javaType} ${column.javaFieldName}){\r\n		this.${column.javaFieldName} = ${column.javaFieldName};\r\n	}\r\n\r\n	public ${column.javaType} get${column.javaFieldNameUF}(){\r\n		return this.${column.javaFieldName};\r\n	}\r\n\r\n#end}','admin'),(3,'DAO',NULL,'package ${context.packageName}.dao;\r\n\r\nimport ${context.packageName}.entity.${context.javaBeanName};\r\nimport org.durcframework.dao.BaseDao;\r\n\r\npublic interface ${context.javaBeanName}Dao extends BaseDao<${context.javaBeanName}> {\r\n}','admin'),(4,'Service',NULL,'package ${context.packageName}.service;\r\n\r\nimport ${context.packageName}.dao.${context.javaBeanName}Dao;\r\nimport ${context.packageName}.entity.${context.javaBeanName};\r\nimport org.durcframework.service.CrudService;\r\nimport org.springframework.stereotype.Service;\r\n\r\n@Service\r\npublic class ${context.javaBeanName}Service extends CrudService<${context.javaBeanName}, ${context.javaBeanName}Dao> {\r\n\r\n}\r\n','admin'),(5,'SearchEntity',NULL,'package ${context.packageName}.entity;\r\n\r\nimport java.util.Date;\r\n\r\nimport org.durcframework.entity.SearchEntity;\r\nimport org.durcframework.expression.annotation.ValueField;\r\n\r\npublic class ${context.javaBeanName}Sch extends SearchEntity{\r\n\r\n#foreach($column in $columns) \r\n    private ${column.javaTypeBox} ${column.javaFieldName}Sch;\r\n#end\r\n\r\n#foreach(${column} in ${columns}) \r\n    public void set${column.javaFieldNameUF}Sch(${column.javaTypeBox} ${column.javaFieldName}Sch){\r\n        this.${column.javaFieldName}Sch = ${column.javaFieldName}Sch;\r\n    }\r\n    \r\n    @ValueField(column = \"${column.columnName}\")\r\n    public ${column.javaTypeBox} get${column.javaFieldNameUF}Sch(){\r\n        return this.${column.javaFieldName}Sch;\r\n    }\r\n\r\n#end\r\n\r\n}','admin'),(6,'Mybatis',NULL,'<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\r\n<!DOCTYPE  mapper PUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\" \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\" >\r\n<mapper namespace=\"${context.packageName}.dao.${context.javaBeanName}Dao\">\r\n    <resultMap id=\"queryResultMap\" type=\"${context.packageName}.entity.${context.javaBeanName}\">\r\n        #foreach($column in $columns)\r\n        <result column=\"${column.columnName}\" property=\"${column.javaFieldName}\" jdbcType=\"${column.mybatisJdbcType}\" />\r\n        #end\r\n    </resultMap>\r\n\r\n    <select id=\"find\" parameterType=\"org.durcframework.expression.ExpressionQuery\"\r\n		resultMap=\"queryResultMap\">\r\n		SELECT *\r\n		FROM ${table.tableName} t\r\n		<include refid=\"expressionBlock.where\" />\r\n		<choose>\r\n			<when test=\"sortname == null\">\r\n				ORDER BY ${context.javaPkName} desc\r\n			</when>\r\n			<otherwise>\r\n				ORDER BY #{sortname,jdbcType=VARCHAR} ${sortorder}\r\n			</otherwise>\r\n		</choose>\r\n		<if test=\"!isQueryAll\">\r\n			LIMIT\r\n			#{firstResult,jdbcType=INTEGER},#{pageSize,jdbcType=INTEGER}\r\n		</if>\r\n	</select>\r\n\r\n\r\n    <select id=\"findTotalCount\" parameterType=\"org.durcframework.expression.ExpressionQuery\"\r\n		resultType=\"java.lang.Integer\">\r\n		SELECT count(*) FROM ${table.tableName} t\r\n		<include refid=\"expressionBlock.where\" />\r\n    </select>\r\n\r\n    <insert id=\"save\" parameterType=\"org.durcframework.autocode.entity.DataSourceConfig\"\r\n#if(${pkColumn.isIdentity})\r\n    keyProperty=\"${context.javaPkName}\" keyColumn=\"${context.pkName}\" useGeneratedKeys=\"true\"\r\n#end\r\n    >\r\n	INSERT INTO ${table.tableName}\r\n         (\r\n #set ($i=0) \r\n        #foreach($column in $columns) \r\n            #if(!${column.isIdentityPk})               \r\n        #if($i > 0),#end ${column.columnName}\r\n               #set($i=$i+1)\r\n            #end          \r\n        #end\r\n          )\r\n	VALUES (\r\n        #set ($i=0) \r\n        #foreach($column in $columns) \r\n            #if(!${column.isIdentityPk})               \r\n        #if($i > 0),#end #{${column.javaFieldName},jdbcType=${column.mybatisJdbcType}}\r\n               #set($i=$i+1)\r\n            #end          \r\n        #end\r\n \r\n        )\r\n	</insert>\r\n\r\n\r\n    <update id=\"update\" parameterType=\"${context.packageName}.entity.${context.javaBeanName}\">\r\n    UPDATE ${table.tableName}\r\n    SET \r\n#set ($i=0) \r\n        #foreach($column in $columns) \r\n            #if(!${column.isPk})               \r\n        #if($i > 0),#end ${column.columnName}=#{${column.javaFieldName},jdbcType=${column.mybatisJdbcType}}\r\n               #set($i=$i+1)\r\n            #end          \r\n        #end	\r\n    WHERE ${context.pkName} = #{${context.javaPkName},jdbcType=${context.mybatisPkType}}\r\n    </update>\r\n\r\n    <select id=\"get\" resultMap=\"queryResultMap\" parameterType=\"java.io.Serializable\">\r\n		SELECT *\r\n		FROM ${table.tableName}\r\n		WHERE ${context.pkName} = #{${context.javaPkName},jdbcType=${context.mybatisPkType}}\r\n	</select>\r\n	\r\n	<delete id=\"del\" parameterType=\"${context.packageName}.entity.${context.javaBeanName}\">\r\n		DELETE FROM ${table.tableName}\r\n		WHERE ${context.pkName} = #{${context.javaPkName},jdbcType=${context.mybatisPkType}}\r\n	</delete>\r\n\r\n</mapper>','admin');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
