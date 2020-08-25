
CREATE DATABASE IF NOT EXISTS `gen` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
USE `gen`;


CREATE TABLE `datasource_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `db_type` int(11) NOT NULL DEFAULT '0' COMMENT '数据库类型，1：MySql, 2:Oracle, 3:sqlserver',
  `driver_class` varchar(64) NOT NULL DEFAULT '' COMMENT '数据库驱动',
  `db_name` varchar(64) NOT NULL DEFAULT '' COMMENT '数据库名称',
  `host` varchar(64) NOT NULL DEFAULT '' COMMENT '数据库host',
  `port` int(11) NOT NULL DEFAULT '0' COMMENT '数据库端口',
  `username` varchar(64) NOT NULL DEFAULT '' COMMENT '数据库用户名',
  `password` varchar(64) NOT NULL DEFAULT '' COMMENT '数据库密码',
  `is_deleted` int(11) NOT NULL DEFAULT '0' COMMENT '是否已删除，1：已删除，0：未删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='数据源配置表';


CREATE TABLE `template_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '模板名称',
  `file_name` varchar(128) NOT NULL DEFAULT '' COMMENT '文件名称',
  `content` text NOT NULL COMMENT '内容',
  `is_deleted` int(11) NOT NULL DEFAULT '0' COMMENT '是否删除，1：已删除，0：未删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='模板表';


INSERT INTO `template_config` (`id`, `name`, `file_name`, `content`, `is_deleted`) VALUES
	(1,'entity','${context.javaBeanName}.java','package ${context.packageName}.entity;\n\n#if(${table.hasDateField})\nimport java.util.Date;\n#end\n#if(${table.hasLocalDateField})\nimport java.time.LocalDate;\n#end\n#if(${table.hasLocalDateTimeField})\nimport java.time.LocalDateTime;\n#end\n#if(${table.hasBigDecimalField})\nimport java.math.BigDecimal;\n#end\n\n#if( "${table.comment}" != "" )\n/**\n * ${table.comment}\n */\n#end\npublic class ${context.javaBeanName} {\n#foreach($column in $columns)\n#if( "${column.comment}" != "" )\n	/** ${column.comment} */\n#end\n	private ${column.javaTypeBox} ${column.javaFieldName};\n#end\n\n#foreach(${column} in ${columns})\n	public void set${column.javaFieldNameUF}(${column.javaTypeBox} ${column.javaFieldName}) {\n		this.${column.javaFieldName} = ${column.javaFieldName};\n	}\n	\n	public ${column.javaTypeBox} get${column.javaFieldNameUF}() {\n		return this.${column.javaFieldName};\n	}\n	\n#end\n\n	@Override\n    public boolean equals(Object o) {\n        if (this == o) { return true; }\n        if (o == null || getClass() != o.getClass()) {return false;}\n        ${context.javaBeanName} that = (${context.javaBeanName}) o;\n        return ${pk.javaFieldName}.equals(that.${pk.javaFieldName});\n    }\n\n    @Override\n    public int hashCode() {\n        return java.util.Objects.hash(${pk.javaFieldName});\n    }\n    \n    @Override\n    public String toString() {\n        return "${context.javaBeanName}{" +\n#foreach(${column} in ${columns})\n		#if($velocityCount == 1)\n		"${column.javaFieldName}=" + ${column.javaFieldName} +\n		#else\n		",${column.javaFieldName}=\'" + ${column.javaFieldName} + "\'" + \n		#end\n#end\n                \'}\';\n    }\n	\n}',0),
	(2,'mybatis','${context.javaBeanName}Mapper.xml','#set($jq="$")\n<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE  mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >\n<mapper namespace="${context.packageName}.mapper.${context.javaBeanName}Mapper">\n	<resultMap id="BaseResultMap" type="${context.packageName}.entity.${context.javaBeanName}">\n    #foreach($column in $columns)    \n        <result column="${column.columnName}" property="${column.javaFieldName}" />\n	#end\n	</resultMap>  \n    \n    <!-- 表字段 -->\n    <sql id="baseColumns">\n    #foreach($column in $columns)\n    #if($velocityCount > 1),#end t.${column.columnName}\n    #end\n    </sql> \n    \n    <!-- 查询全部 -->\n    <select id="listAll" resultMap="BaseResultMap">\n		SELECT         \n        	<include refid="baseColumns" />\n		FROM ${table.tableName} t\n	</select>\n \n 	<!-- 根据主键获取单条记录 -->\n    <select id="getById" resultMap="BaseResultMap" parameterType="${pk.javaTypeBox}">\n		SELECT         \n        	<include refid="baseColumns" />\n		FROM ${table.tableName} t\n		WHERE ${pk.columnName} = #{${pk.javaFieldName}}\n	</select>\n\n	<!-- 插入全部字段 -->\n    <insert id="insert" parameterType="${context.packageName}.entity.${context.javaBeanName}"\n		keyProperty="${context.javaPkName}" keyColumn="${context.pkName}" useGeneratedKeys="true"\n    >\n	INSERT INTO ${table.tableName}\n    <trim prefix="(" suffix=")" suffixOverrides=",">	 \n    #foreach($column in $columns) \n    	#if(!${column.isIdentityPk}) \n    	${column.columnName},\n    	#end          \n    #end\n    </trim>\n    <trim prefix="VALUES (" suffix=")" suffixOverrides=",">            \n    #foreach($column in $columns) \n    	#if(!${column.isIdentityPk})                     \n        #{${column.javaFieldName}},                   \n    	#end          \n    #end\n    </trim>\n	</insert>\n    \n    <!-- 插入不为NULL的字段 -->\n    <insert id="insertIgnoreNull" parameterType="${context.packageName}.entity.${context.javaBeanName}"\n        keyProperty="${pk.javaFieldName}" keyColumn="${context.pkName}" useGeneratedKeys="true"\n        >\n        INSERT INTO ${table.tableName}    \n        <trim prefix="(" suffix=")" suffixOverrides=",">	 \n\n            #foreach($column in $columns) \n                #if(!${column.isIdentityPk}) \n                    <if test="${column.javaFieldName} != null">\n                   ${column.columnName},\n                    </if>\n                #end          \n            #end\n        </trim>\n        <trim prefix="VALUES (" suffix=")" suffixOverrides=",">            \n            #foreach($column in $columns) \n                #if(!${column.isIdentityPk})  \n                    <if test="${column.javaFieldName} != null" >\n                    #{${column.javaFieldName}},                    \n                    </if>\n                #end          \n            #end\n        </trim>\n    </insert>\n\n	<!-- 更新,更新全部字段 -->\n    <update id="update" parameterType="${context.packageName}.entity.${context.javaBeanName}">\n    UPDATE ${table.tableName}\n     <set>		\n     #foreach($column in $columns) \n         #if(!${column.isPk})               \n         ${column.columnName}=#{${column.javaFieldName}},        \n         #end          \n     #end\n     </set>	\n    WHERE ${pk.columnName} = #{${pk.javaFieldName}}\n    </update>  \n    \n    \n    <!-- 更新不为NULL的字段 -->\n    <update id="updateIgnoreNull" parameterType="${context.packageName}.entity.${context.javaBeanName}">\n    UPDATE ${table.tableName}\n    <set>\n    	#foreach($column in $columns) \n            #if(!${column.isPk})  \n                <if test="${column.javaFieldName} != null" >\n                ${column.columnName}=#{${column.javaFieldName}},                 \n                </if>\n            #end          \n        #end\n    </set>\n    WHERE ${pk.columnName} = #{${pk.javaFieldName}}\n    </update>\n\n		\n	<!-- 根据主键删除记录 -->\n	<delete id="delete" parameterType="${context.packageName}.entity.${context.javaBeanName}">\n		UPDATE ${table.tableName}\n		SET is_deleted=1\n		WHERE ${pk.columnName} = #{${pk.javaFieldName}}\n	</delete>\n\n\n</mapper>',0),
	(3,'dao','${context.javaBeanName}Mapper.java','package ${context.packageName}.mapper;\n\nimport java.util.List;\nimport org.apache.ibatis.annotations.Mapper;\nimport ${context.packageName}.entity.${context.javaBeanName};\n\n@Mapper\npublic interface ${context.javaBeanName}Mapper {\n\n	/**\n     * 查询所有记录\n     *\n     * @return 返回集合，没有返回空List\n     */\n	List<${context.javaBeanName}> listAll();\n\n\n	/**\n     * 根据主键查询\n     *\n     * @param id 主键\n     * @return 返回记录，没有返回null\n     */\n	${context.javaBeanName} getById(${pk.javaTypeBox} ${pk.javaFieldName});\n	\n	/**\n     * 新增，插入所有字段\n     *\n     * @param ${context.javaBeanNameLF} 新增的记录\n     * @return 返回影响行数\n     */\n	int insert(${context.javaBeanName} ${context.javaBeanNameLF});\n	\n	/**\n     * 新增，忽略null字段\n     *\n     * @param ${context.javaBeanNameLF} 新增的记录\n     * @return 返回影响行数\n     */\n	int insertIgnoreNull(${context.javaBeanName} ${context.javaBeanNameLF});\n	\n	/**\n     * 修改，修改所有字段\n     *\n     * @param ${context.javaBeanNameLF} 修改的记录\n     * @return 返回影响行数\n     */\n	int update(${context.javaBeanName} ${context.javaBeanNameLF});\n	\n	/**\n     * 修改，忽略null字段\n     *\n     * @param ${context.javaBeanNameLF} 修改的记录\n     * @return 返回影响行数\n     */\n	int updateIgnoreNull(${context.javaBeanName} ${context.javaBeanNameLF});\n	\n	/**\n     * 删除记录\n     *\n     * @param ${context.javaBeanNameLF} 待删除的记录\n     * @return 返回影响行数\n     */\n	int delete(${context.javaBeanName} ${context.javaBeanNameLF});\n	\n}',0),
	(4,'vue','${context.javaBeanNameLF}.vue','#set($jq="$")
<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchFormData" class="demo-form-inline" size="mini">
      #foreach($column in $columns)
      	#if(!${column.isPk})
        <el-form-item
      	#if( "${column.comment}" != "" )
        label="${column.comment}"
        #else
        label="${column.javaFieldName}"
        #end
      >
      	<el-input v-model="searchFormData.${column.javaFieldName}" :clearable="true" placeholder="${column.comment}" style="width: 250px;" />
      </el-form-item>
        #end
      #end
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 10px;" @click="onAdd">新增</el-button>
    <el-table
      :data="pageInfo.rows"
      border
      highlight-current-row
    >
    #foreach($column in $columns)
      <el-table-column
        prop="${column.javaFieldName}"
        #if( "${column.comment}" != "" )
        label="${column.comment}"
        #else
        label="${column.javaFieldName}"
        #end
      />
     #end
     <el-table-column>
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="onTableUpdate(scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="onTableDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="margin-top: 5px"
      :current-page="searchFormData.pageIndex"
      :page-size="searchFormData.pageSize"
      :page-sizes="[5, 10, 20, 40]"
      :total="pageInfo.total"
      layout="total, sizes, prev, pager, next"
      @size-change="onSizeChange"
      @current-change="onPageIndexChange"
    />
    <!--dialog-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="resetForm(''dialogForm'')"
    >
      <el-form
        ref="dialogForm"
        :rules="dialogFormRules"
        :model="dialogFormData"
        label-width="120px"
        size="mini"
      >
      #foreach($column in $columns)
      	#if(!${column.isPk})
        <el-form-item
      	prop="${column.javaFieldName}"
        #if( "${column.comment}" != "" )
        label="${column.comment}"
        #else
        label="${column.javaFieldName}"
        #end
       >
          <el-input v-model="dialogFormData.${column.javaFieldName}" />
        </el-form-item>
        #end
      #end
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from ''axios''
// 创建axios实例
const client = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间,60秒
})
export default {
  data() {
    return {
      searchFormData: {
        #foreach($column in $columns)
        ${column.javaFieldName}: '''',
        #end
        pageIndex: 1,
        pageSize: 10
      },
      pageInfo: {
        rows: [],
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '''',
      dialogFormData: {
        #foreach($column in $columns)
        #if($velocityCount > 1),#end ${column.javaFieldName}: ''''
        #end
      },
      dialogFormRules: {
        #foreach($column in $columns)
        #if($velocityCount > 1),#end ${column.javaFieldName}: [
          { required: true, message: ''不能为空'', trigger: ''blur'' }
        ]
        #end
      }
    }
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.post(''/${context.javaBeanNameLF}/list'', this.searchFormData, resp => {
        this.pageInfo.rows = resp.data
      })
    },
    onTableUpdate(row) {
      this.dialogTitle = ''修改''
      this.dialogVisible = true
      this.${jq}nextTick(() => {
        Object.assign(this.dialogFormData, row)
      })
    },
    onTableDelete(row) {
      this.confirm(`确认要删除该记录吗？`, function(done) {
        const data = {
          ${pk.javaFieldName}: row.${pk.javaFieldName}
        }
        this.post(''/${context.javaBeanNameLF}/del'', data, () => {
          done()
          this.tip(''删除成功'')
          this.loadTable()
        })
      })
    },
    onDialogSave() {
      this.${jq}refs.dialogForm.validate((valid) => {
        if (valid) {
          const uri = this.dialogFormData.${pk.javaFieldName} ? ''/${context.javaBeanNameLF}/update'' : ''/${context.javaBeanNameLF}/add''
          this.post(uri, this.dialogFormData, () => {
            this.dialogVisible = false
            this.loadTable()
          })
        }
      })
    },
    onSizeChange(size) {
      this.searchFormData.pageSize = size
      this.loadTable()
    },
    onAdd() {
      this.dialogTitle = ''新增''
      this.dialogVisible = true
      this.dialogFormData.${pk.javaFieldName} = 0
    },
    onPageIndexChange(pageIndex) {
      this.searchFormData.pageIndex = pageIndex
      this.loadTable()
    },
    /**
     * 请求接口
     * @param uri uri
     * @param data 请求数据
     * @param callback 成功时回调
     * @param errorCallback 错误时回调
     */
    post(uri, data, callback, errorCallback) {
      const that = this
      client.post(uri, data).then(function(response) {
        const resp = response.data
        const code = resp.code
        if (code === ''0'') { // 成功
          callback && callback.call(that, resp)
        } else {
          that.${jq}message.error(resp.msg)
        }
      }).catch(function(error) {
        console.error(error)
        errorCallback && errorCallback(error)
        that.${jq}message.error(error.message)
      })
    }
  }
}
</script>',0),
(5, 'Model-C#', '${context.className}.cs', 'using Newtonsoft.Json;

namespace ${context.packageName}
{
#if( "${table.comment}" != "" )
 	/// <summary>
    /// ${table.comment}
    /// </summary>
#end
    public class ${context.className}
    {
#foreach($column in $csharpColumns)
#if( "${column.comment}" != "" )
        /// <summary>
        /// ${column.comment}
        /// </summary>
#end
        [JsonProperty("${column.field}")]
		public ${column.fieldType} ${column.property} { get; set; }

#end
    }
}');




