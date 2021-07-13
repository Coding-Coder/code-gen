<template>
  <div class="app-container">
    <el-backtop />
    <div v-if="loading">生成中...</div>
    <div v-else>
      <el-container>
        <el-aside>
          <el-tooltip placement="top" content="包含如下的文件夹及文件" :open-delay="500">
            <el-button icon="el-icon-download" type="text" @click="downloadAll">下载全部</el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="仅下载所有文件，不包含文件夹" :open-delay="500">
            <el-button icon="el-icon-download" type="text" @click="downloadWithNoFolder">下载(仅文件)</el-button>
          </el-tooltip>
          <el-button v-if="!loading" icon="el-icon-refresh" type="text" @click="reGenerate" style="float: right;">再次生成</el-button>
          <el-input v-show="treeData.length > 0" v-model="filterText" prefix-icon="el-icon-search" placeholder="搜索" size="mini" clearable style="margin-bottom: 10px;"/>
          <el-tree ref="tree" :data="treeData" :props="defaultProps" :filter-node-method="filterNode" node-key="id" default-expand-all highlight-current @current-change="onTreeSelect"/>
        </el-aside>
        <el-main v-show="fileInfo.content.length > 0">
          <el-button type="text" icon="el-icon-document-copy" :data-clipboard-text="fileInfo.content" class="copyBtn">复制代码</el-button>
          <el-button icon="el-icon-download" type="text" @click="downloadText(fileInfo.fileName, fileInfo.content)">下载当前文件</el-button>
          <codemirror v-model="fileInfo.content" :options="cmOptions"/>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import JSZip from 'jszip'
import DateUtils from '@/utils/date.js'
import { saveAs } from 'file-saver'
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
  'cs': 'text/x-csharp',
  'jsp': 'application/x-jsp',
  'html': 'text/html',
  'vue': 'application/x-ejs',
  'aspx': 'application/x-aspx',
  'xml': 'application/xml'
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
        label: 'fileName'
      },
      content: '',
      fileInfo: {
        content: '',
        fileName: ''
      },
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
    reGenerate(){
      this.onGenerate()
      this.tip('生成成功')
      this.fileInfo = {
        content: '',
        fileName: ''
      }
      this.cmOptions.mode = 'text/x-java'
    },
    // 树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.fileName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    buildTreeData(rows) {
      const treeData = []
      const codeMap = {}
      // 把列表数据转换到map中,key为模板名
      // value是个List
      for (let i = 0, len = rows.length; i < len; i++) {
        const row = rows[i]
        const folder = row.folder
        let list = codeMap[folder]
        if (!list) {
          list = []
          codeMap[folder] = list
        }
        list.push(row)
      }
      // 把这个map对象转成tree格式数据
      for (const folder in codeMap) {
        const codeFileArr = codeMap[folder]
        // 父节点
        const treeElement = {
          fileName: folder,
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
          fileName: codeFile.fileName,
          content: codeFile.content
        }
        children.push(child)
      }
      return children
    },
    onTreeSelect(data) {
      if (data.children && data.children.length > 0) {
        return
      }
      this.fileInfo = data
      this.changeMod(data.fileName)
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
    },
    downloadAll() {
      var data = this.treeData
      var zip = new JSZip()
      data.forEach(row => {
        var children = row.children
        var isFolder = children.length > 0
        if (isFolder) {
          // 创建文件夹(如果点分割则创建多级目录)
          var splitFolders = row.fileName.split(".");
          var folderZip = zip;
          for(var j = 0,len=splitFolders.length; j < len; j++) {
            folderZip = folderZip.folder(splitFolders[j]);
          }
          children.forEach(child => {
            // 文件放入文件夹中
            folderZip.file(child.fileName, child.content)
          })
        }
      })
      // 下载
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        // see FileSaver.js
        saveAs(content, `code-${DateUtils.formatDateTime(new Date(),DateUtils.date_format.pureDatetimePattern)}.zip`)
      })
    },
    downloadWithNoFolder() {
      var data = this.treeData
      var zip = new JSZip()
      data.forEach(row => {
        var children = row.children
        var isFolder = children.length > 0
        if (isFolder) {
          children.forEach(child => {
            // 文件放入文件夹中
            zip.file(child.fileName, child.content)
          })
        }
      })
      // 下载
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        // see FileSaver.js
        saveAs(content, `code-${DateUtils.formatDateTime(new Date(),DateUtils.date_format.pureDatetimePattern)}.zip`)
      })
    }
  }
}
</script>

