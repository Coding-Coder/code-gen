<template>
  <div class="app-container">
    <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 10px;" @click="onGroupAdd">添加模板组</el-button>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item in groupData" :key="item.id" :name="`${item.id}`" :label="item.groupName">
        <span slot="label">
          {{ item.groupName }}
          <el-dropdown
            v-show="item.id === currentTab.id"
            trigger="click"
            style="margin-left: 5px;"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              <el-tooltip placement="top" content="更多操作" :open-delay="500">
                <a class="el-icon-setting el-icon--right"></a>
              </el-tooltip>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit" :command="onGroupInfoUpdate">修改</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" :command="onGroupInfoDelete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-tab-pane>
      <el-button type="text" size="mini" icon="el-icon-plus" style="margin-bottom: 10px;" @click="onAdd">新增模板</el-button>
      <el-button type="text" size="mini" icon="el-icon-upload2" style="margin-bottom: 10px;" @click="onImportTemplates">批量导入</el-button>
      <el-button type="text" size="mini" icon="el-icon-download" style="margin-bottom: 10px;" @click="downloadTemplates">导出模板</el-button>
      <el-table
        :data="tableData"
        border
        highlight-current-row
      >
        <el-table-column
          prop="name"
          label="模板名称"
          width="200"
        />
        <el-table-column
          prop="fileName"
          label="文件名称"
        />
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="onTableUpdate(scope.row)">修改</el-button>
            <el-button type="text" size="mini" @click="onTableDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>
    <el-dialog title="批量导入模板" :visible.sync="importDialogVisible" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-upload  v-if="!importLoading" drag multiple accept=".txt,.vm" action="http://xx.nothing" :limit="20"
                  :show-file-list="false"
                  :http-request="uploadTemplates">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-table v-if="importLoading" :data="importFiles" style="width: 100%">
        <el-table-column prop="name" label="文件" width="180"></el-table-column>
        <el-table-column prop="state" label="状态"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import JSZip from "jszip"
import { saveAs } from 'file-saver'

export default {
  data() {
    return {
      activeName: '',
      tableData: [],
      groupData: [],
      currentTab: { id: 0 },
      importDialogVisible: false,
      importLoading: false,
      importFiles: [],
    }
  },
  created() {
    this.reload()
  },
  methods: {
    reload() {
      this.loadGroup()
    },
    loadGroup: function() {
      this.post('/group/list', {}, function(resp) {
        this.groupData = resp.data
        let id = this.currentTab.id
        if (!id && this.groupData.length > 0) {
          id = this.groupData[0].id
        }
        if (id) {
          this.selectTab(id)
        }
      })
    },
    selectTab(id) {
      for (const group of this.groupData) {
        if (group.id === id) {
          this.currentTab = group
          break
        }
      }
      this.loadTable(id)
    },
    loadTable: function(groupId) {
      this.activeName = `${groupId}`
      this.post(`/template/list?groupId=${groupId}`, {}, function(resp) {
        this.tableData = resp.data
      })
    },
    handleClick(tab) {
      const id = parseInt(tab.name)
      if (id) {
        this.selectTab(parseInt(id))
      }
    },
    onTableUpdate: function(row) {
      this.goRoute(`edit/${row.id}`)
    },
    onTableDelete: function(row) {
      this.confirm(`确认要删除【${row.name}】吗？`, function(done) {
        this.post('/template/del', row, function() {
          done()
          this.tip('删除成功')
          this.reload()
        })
      })
    },
    onAdd: function() {
      this.goRoute(`edit/0?groupId=${this.currentTab.id}`)
    },
    // group
    onGroupInfoUpdate() {
      this.onGroupUpdate(this.currentTab)
    },
    onGroupInfoDelete() {
      this.onGroupDelete(this.currentTab)
    },
    onGroupAdd: function() {
      this.groupTitle = '增加模板组'
      this.$prompt('请输入组名称', '增加模板组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: '',
        inputPattern: /^.{1,64}$/,
        inputErrorMessage: '不能为空且长度在64以内'
      }).then(({ value }) => {
        const data = {
          groupName: value
        }
        this.post('/group/add', data, resp => {
          this.currentTab = resp.data
          this.reload()
        })
      }).catch(() => {
      })
    },
    onGroupUpdate: function(row) {
      this.$prompt('请输入组名称', '修改模板组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.groupName,
        inputPattern: /^.{1,64}$/,
        inputErrorMessage: '不能为空且长度在64以内'
      }).then(({ value }) => {
        const data = {
          id: row.id,
          groupName: value
        }
        this.post('/group/update', data, resp => {
          this.reload()
        })
      }).catch(() => {
      })
    },
    onGroupDelete: function(row) {
      this.confirm(`确认要删除【${row.groupName}】吗？`, function(done) {
        this.post('/group/del', row, function() {
          done()
          this.tip('删除成功')
          this.currentTab.id = 0
          this.reload()
        })
      })
    },
    onImportTemplates() {
      this.importFiles = []
      this.importLoading = false
      this.importDialogVisible = true
    },
    uploadTemplates(target) {
      this.importLoading = true
      const file = target.file
      this.importFiles.push({
        name: file.name,
        state: "上传中..."
      })
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onloadend = async () => {
        let content = reader.result
        let templateName = file.name
        let splitIdx = templateName.lastIndexOf(".");
        if (splitIdx !== -1) {
          templateName = templateName.substring(0, splitIdx)
        }
        let data = {
          groupId: this.currentTab.id,
          groupName: this.currentTab.groupName,
          name: templateName,
          content: content,
        }
        await this.saveTemplate(data)
        this.importFiles.forEach(item => {
          if(item.name === file.name) {
            item.state = "成功"
          }
        })
      }
      return true
    },
    saveTemplate(data) {
      const uri = '/template/save'
      this.post(uri, data)
    },
    downloadTemplates() {
      const folder = this.currentTab.groupName;
      const filename = folder + ".zip"
      const zip = new JSZip()
      const folderZip = zip.folder(folder)
      this.tableData.forEach(row => {
        folderZip.file(row.name + ".vm", row.content)
      })
      // 下载
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        // see FileSaver.js
        saveAs(content, filename)
      })
    }
  }
}
</script>
