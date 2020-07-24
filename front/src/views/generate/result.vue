<template>
  <div class="app-container">
    <el-backtop />
    <div v-if="loading">生成中...</div>
    <div v-else>
      <el-button type="text" icon="el-icon-back" @click="goRoute('/generate/code')">返回</el-button>
      <el-container>
        <el-aside>
          <el-input
            v-show="treeData.length > 0"
            v-model="filterText"
            prefix-icon="el-icon-search"
            placeholder="搜索"
            size="mini"
            clearable
            style="margin-bottom: 10px;"
          />
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="id"
            default-expand-all
            highlight-current
            @current-change="onTreeSelect"
          />
        </el-aside>
        <el-main>
          <el-button
            v-show="content.length > 0"
            type="text"
            :data-clipboard-text="content"
            class="copyBtn">复制代码</el-button>
          <codemirror
            v-model="content"
            :options="cmOptions"
          />
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/neat.css'
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/clike/clike')
require('codemirror/mode/htmlembedded/htmlembedded')
require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/mode/xml/xml')
const mode_map = {
  'js': 'text/javascript',
  'java': 'text/x-java',
  'jsp': 'application/x-jsp',
  'html': 'text/html',
  'aspx': 'application/x-aspx',
  'xml': 'xml'
}
export default {
  components: { codemirror },
  data() {
    return {
      loading: true,
      clientParam: {
        datasourceConfigId: '',
        tableNames: [],
        templateConfigIdList: [],
        packageName: ''
      },
      treeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      content: '',
      cmOptions: {
        value: '',
        mode: 'text/x-java',
        theme: 'neat',
        readOnly: true
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    const config = this.$route.params.config || ''
    if (config) {
      this.clientParam = JSON.parse(config)
      this.onGenerate()
    }
    this.initCopy()
  },
  destroyed() {
    this.cleanCopy()
  },
  methods: {
    onGenerate() {
      if (this.clientParam.tableNames.length === 0) {
        this.tip('请勾选表', 'error')
        return
      }
      if (this.clientParam.templateConfigIdList.length === 0) {
        this.tip('请勾选模板', 'error')
        return
      }
      this.post('/generate/code', this.clientParam, resp => {
        this.loading = false
        const rows = resp.data
        this.treeData = this.buildTreeData(rows)
      })
    },
    // 树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    buildTreeData(rows) {
      const treeData = []
      const codeMap = {}
      // 把列表数据转换到map中,key为表名
      // value是个List
      for (let i = 0, len = rows.length; i < len; i++) {
        const row = rows[i]
        let list = codeMap[row.tableName]
        if (!list) {
          list = []
          codeMap[row.tableName] = list
        }

        list.push({ templateName: row.templateName, content: row.content })
      }
      // 把这个map对象转成tree格式数据
      for (const tableName in codeMap) {
        const codeFileArr = codeMap[tableName]
        const treeElement = {
          text: tableName,
          children: this.buildChildren(codeFileArr)
        }

        treeData.push(treeElement)
      }
      return treeData
    },
    buildChildren(codeFileArr) {
      const children = []
      for (let i = 0, len = codeFileArr.length; i < len; i++) {
        const codeFile = codeFileArr[i]
        const child = {
          text: codeFile.templateName,
          attributes: {
            content: codeFile.content
          }
        }
        children.push(child)
      }
      return children
    },
    onTreeSelect(data) {
      if (data.children && data.children.length > 0) {
        return
      }
      this.content = data.attributes.content
      this.changeMod(data.text)
    },
    changeMod(fileName) {
      const suffix = this.getSuffix(fileName)
      this.cmOptions.mode = mode_map[suffix] || 'text/javascript'
    },
    getSuffix(fileName) {
      const index = fileName.lastIndexOf('.')
      if (index === -1) {
        return 'js'
      }
      return fileName.substring(index + 1, fileName.length)
    }
  }
}
</script>

