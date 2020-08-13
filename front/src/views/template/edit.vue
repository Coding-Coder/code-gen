<template>
  <div class="app-container">
    <el-backtop />
    <el-row :gutter="20">
      <el-col :span="16">
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
              ref="editor"
              v-model="formData.content"
              :options="cmOptions"
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="onSave">保 存</el-button>
        <el-button @click="goRoute('/template/list')">返 回</el-button>
      </el-col>
      <el-col :span="8">
        <h3>Velocity变量</h3>
        <p class="velocity-tip">
          点击变量直接插入
        </p>
        <div v-for="item in treeData" :key="item.expression" class="velocity-var">
          <div v-if="!item.children">
            <li>
                <a @click="onExpressionClick(item.expression)">{{ item.expression }}</a>：{{ item.text }}
            </li>
          </div>
          <div v-else>
            <h4>{{ item.expression }}</h4>
            <li v-for="child in item.children" :key="child.expression">
                <a @click="onExpressionClick(child.expression)">{{ child.expression }}</a>：{{ child.text }}
            </li>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style>
  .el-form-item--mini .el-form-item__content,
  .el-form-item--mini .el-form-item__label,
  .el-form-item__content {
   line-height: 20px;
  }
  .velocity-tip {
    color: #606266;
    font-size: 13px;
  }
  .velocity-var {}
  .velocity-var li {
    font-size: 14px;
    color: #606266;
    line-height: 26px;
  }
  .velocity-var a {
    color: #409EFF;
    font-weight: 500;
  }
  .velocity-var a:hover {
    color: rgba(64, 158, 255, 0.75);
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
        lineNumbers: true,
        readOnly: false
      },
      isVelocityBarFixed: false,
      // tree
      treeData: [{
        expression: '${pk}',
        text: '主键对象,同${column}'
      }, {
        expression: '${context}',
        text: '',
        children: [{
          expression: '${context.dbName}',
          text: '数据库名'
        }, {
          expression: '${context.packageName}',
          text: '包名'
        }, {
          expression: '${context.javaBeanName}',
          text: 'Java类名'
        }, {
          expression: '${context.javaBeanNameLF}',
          text: 'Java类名且首字母小写'
        }, {
          expression: '${context.pkName}',
          text: '表主键名'
        }, {
          expression: '${context.javaPkName}',
          text: '表主键对应的java字段名'
        }, {
          expression: '${context.javaPkType}',
          text: '主键的java类型'
        }, {
          expression: '${context.mybatisPkType}',
          text: '主键对应的mybatis类型'
        }]
      }, {
        expression: '${table}',
        text: '',
        children: [{
          expression: '${table.tableName}',
          text: '数据库表名'
        }, {
          expression: '${table.comment}',
          text: '表注释'
        }]
      }, {
        expression: '#foreach($column in $columns) #end',
        text: '',
        children: [{
          expression: '${velocityCount}',
          text: 'foreach循环下标，从1开始'
        }, {
          expression: '${column.columnName}',
          text: '表中字段名'
        }, {
          expression: '${column.type}',
          text: '字段的数据库类型'
        }, {
          expression: '${column.javaFieldName}',
          text: 'java字段名'
        }, {
          expression: '${column.javaFieldNameUF}',
          text: 'java字段名首字母大写'
        }, {
          expression: '${column.javaType}',
          text: '字段的java类型'
        }, {
          expression: '${column.javaTypeBox}',
          text: '字段的java装箱类型,如Integer'
        }, {
          expression: '${column.isIdentity}',
          text: '是否自增,返回boolean'
        }, {
          expression: '${column.isPk}',
          text: '是否主键,返回boolean'
        }, {
          expression: '${column.isIdentityPk}',
          text: '是否自增主键,返回boolean'
        }, {
          expression: '${column.mybatisJdbcType}',
          text: 'mybatis定义的jdbcType'
        }, {
          expression: '${column.comment}',
          text: '字段注释'
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
    onExpressionClick(exp) {
      const codemirror = this.$refs.editor.codemirror
      // 插入表达式
      codemirror.replaceSelection(exp)
      // 重新获得光标
      codemirror.focus()
    },
    onSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const opt = this.formData.id ? 'update' : 'add'
          const uri = `/template/${opt}`
          this.post(uri, this.formData, resp => {
            if (opt === 'add') {
              this.formData.id = resp.data.id
            }
            this.tip('保存成功')
          })
        }
      })
    }
  }
}
</script>
