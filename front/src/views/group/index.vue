<template>
  <div class="app-container">
    <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 10px;" @click="onTableAdd">新增模板组</el-button>
    <el-table
      :data="tableData"
      border
      highlight-current-row
    >
      <el-table-column
        prop="groupName"
        label="模板组名称"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="onSelectTemplate(scope.row)">查看模板</el-button>
          <el-button type="text" size="mini" @click="onTableUpdate(scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="onTableDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="groupTitle"
      :visible.sync="groupDlgShow"
    >
      <el-form
        ref="dialogForm"
        :model="formData"
        :rules="formRules"
        size="mini"
        label-width="120px"
      >
        <el-form-item prop="name" label="模板组名称">
          <el-input v-model="formData.groupName" show-word-limit maxlength="100" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSave">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      groupTitle: '',
      groupDlgShow: false,
      formData: {
        id: 0,
        groupName: ''
      },
      formRules: {
        groupName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable: function() {
      this.post('/group/list', {}, function(resp) {
        this.tableData = resp.data
      })
    },
    onTableAdd: function(row) {
      this.groupTitle = '增加模板组'
      this.formData = {
        id: 0,
        groupName: ''
      }
      this.groupDlgShow = true
    },
    onTableUpdate: function(row) {
      this.groupTitle = '修改模板组'
      this.post(`/group/get/${row.id}`, {}, function(resp) {
        this.formData = resp.data
      })
      this.groupDlgShow = true
    },
    onTableDelete: function(row) {
      this.confirm(`确认要删除【${row.groupName}】吗？`, function(done) {
        this.post('/group/del', row, function() {
          done()
          this.tip('删除成功')
          this.loadTable()
        })
      })
    },
    onAdd: function() {
      this.goRoute('edit/0')
    },
    onSelectTemplate: function (row){
      this.goRoute(`/template/list?groupId=${row.id}`)
    },
    onSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          console.log(this.formData.id)
          const opt = this.formData.id ? 'update' : 'add'
          console.log(opt)
          const uri = `/group/${opt}`
          this.post(uri, this.formData, resp => {
            if (opt === 'add') {
              this.formData.id = resp.data.id
            }
            this.tip('保存成功')
            this.loadTable()
            this.groupDlgShow = false
          })
        }
      })
    }
  }
}
</script>
