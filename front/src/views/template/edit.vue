<template>
  <div class="app-container">
    <el-backtop />
    <el-container>
      <el-aside width="360px">
        <h3>Velocity变量</h3>
        <div v-for="item in treeData" :key="item.text" class="velocity-var">
          <div v-if="!item.children">
            <li>
              {{ item.text }}
            </li>
          </div>
          <div v-else>
            <h4>{{ item.text }}</h4>
            <li v-for="child in item.children" :key="child.text">
              {{ child.text }}
            </li>
          </div>
        </div>
      </el-aside>
      <el-main>
        <el-form
          ref="dialogForm"
          :rules="formRules"
          :model="formData"
          size="mini"
          label-position="top"
        >
          <el-form-item prop="name" label="模板名称">
            <el-input v-model="formData.name" show-word-limit maxlength="64" />
          </el-form-item>
          <el-form-item prop="fileName" label="文件名称">
            <el-input v-model="formData.fileName" placeholder="可使用velocity变量" show-word-limit maxlength="100" />
          </el-form-item>
          <el-form-item prop="content" label="模板内容">
            <el-link type="primary" :underline="false" href="https://www.cnblogs.com/codingsilence/archive/2011/03/29/2146580.html" target="_blank">Velocity语法</el-link>
            <codemirror
              v-model="formData.content"
              :options="cmOptions"
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="onSave">保 存</el-button>
        <el-button @click="goRoute('/template/list')">返 回</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<style>
  .el-form-item--mini .el-form-item__content,
  .el-form-item--mini .el-form-item__label,
  .el-form-item__content {
   line-height: 20px;
  }
  .velocity-var {}
  .velocity-var li {
    font-size: 14px;
    color: #606266;
    line-height: 25px;
  }
</style>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/neat.css'

require('codemirror/mode/velocity/velocity')
export default {
  components: { codemirror },
  data() {
    return {
      formData: {
        id: 0,
        name: '',
        fileName: '',
        content: ''
      },
      formRules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        fileName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      cmOptions: {
        value: '',
        mode: 'text/velocity',
        theme: 'neat',
        readOnly: false
      },
      // tree
      treeData: [{
        text: '${pk}：主键对象,同${column}'
      }, {
        text: '${context}',
        children: [{
          text: '${context.dbName}：数据库名'
        }, {
          text: '${context.packageName}：包名'
        }, {
          text: '${context.javaBeanName}：Java类名'
        }, {
          text: '${context.javaBeanNameLF}：Java类名且首字母小写'
        }, {
          text: '${context.pkName}：表主键名'
        }, {
          text: '${context.javaPkName}：表主键对应的java字段名'
        }, {
          text: '${context.javaPkType}：主键的java类型'
        }, {
          text: '${context.mybatisPkType}：主键对应的mybatis类型'
        }]
      }, {
        text: '${table}',
        children: [{
          text: '${table.tableName}：数据库表名'
        }, {
          text: '${table.comment}：表注释'
        }]
      }, {
        text: '#foreach($column in $columns)',
        children: [{
          text: '${column.columnName}：表中字段名'
        }, {
          text: '${column.type}：字段的数据库类型'
        }, {
          text: '${column.javaFieldName}：java字段名'
        }, {
          text: '${column.javaFieldNameUF}：java字段名首字母大写'
        }, {
          text: '${column.javaType}：字段的java类型'
        }, {
          text: '${column.javaTypeBox}：字段的java装箱类型,如Integer'
        }, {
          text: '${column.isIdentity}：是否自增,返回boolean'
        }, {
          text: '${column.isPk}：是否主键,返回boolean'
        }, {
          text: '${column.isIdentityPk}：是否自增主键,返回boolean'
        }, {
          text: '${column.mybatisJdbcType}：mybatis定义的jdbcType'
        }, {
          text: '${column.comment}：字段注释'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  created() {
    const id = this.$route.params.id || 0
    if (id > 0) {
      this.post(`/template/get/${id}`, {}, function(resp) {
        this.formData = resp.data
      })
    }
  },
  methods: {
    onSave: function() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const opt = this.formData.id ? 'update' : 'add'
          const uri = `/template/${opt}`
          this.post(uri, this.formData, function() {
            this.tip('保存成功')
          })
        }
      })
    }
  }
}
</script>
