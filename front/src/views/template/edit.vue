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
          <el-form-item prop="groupId" label="组名称">
            <el-select
              v-model="formData.groupId"
              placeholder="选择模板所在组"
              @change="onDataGroupChange"
            >
              <el-option
                v-for="item in groupData"
                :key="item.id"
                :label="`${item.groupName}`"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

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
        <el-tabs v-model="activeName" type="card" @tab-click="onTabClick">
          <el-tab-pane v-for="item in velocityConfig" :key="item.name" :label="item.label" :name="item.name" :content="item" />
        </el-tabs>
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
      groupData: {},
      formData: {
        id: 0,
        groupId: '',
        groupName: '',
        name: '',
        fileName: '',
        content: ''
      },
      formRules: {
        groupId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
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
      activeName: 'java',
      treeData: [],
      velocityConfig: [],
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
    this.loadVelocityVar()
    this.loadGroups()
  },
  methods: {
    loadVelocityVar() {
      this.getFile(`velocity/java.json?q=${new Date().getTime()}`, content => {
        this.velocityConfig.push({
          name: 'java',
          label: 'Java变量',
          data: content.data
        })
        this.treeData = content.data
      })
      this.getFile(`velocity/csharp.json?q=${new Date().getTime()}`, content => {
        this.velocityConfig.push({
          name: 'csharp',
          label: 'C#变量',
          data: content.data
        })
      })
    },
    loadGroups() {
      this.post(`/group/list/`, {}, function(resp) {
        this.groupData = resp.data
      })
    },
    onDataGroupChange(groupId){
      console.log(groupId)
      this.formData.groupId = groupId;
      this.groupData.find((item)=>{
        if(item.id === groupId){
          this.formData.groupName = item.groupName
        }
      });
      console.log(this.formData.groupName)
    },
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
    },
    onTabClick(tab) {
      const item = tab.$attrs.content
      this.treeData = item.data
    }
  }
}
</script>
