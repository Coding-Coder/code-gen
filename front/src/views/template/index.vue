<template>
  <div class="app-container">
    <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-bottom: 10px;" @click="onAdd">新增模板</el-button>
    <el-table
      :data="tableData"
      border
      highlight-current-row
    >
      <el-table-column
        prop="groupName"
        label="组名称"
        width="200"
      />
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable: function() {
      this.groupId = this.$route.query.groupId;
      if (typeof this.groupId === 'undefined') {
        this.groupId = '';
      }
      this.post(`/template/list?groupId=${this.groupId}`, {}, function(resp) {
        this.tableData = resp.data
      })
    },
    onTableUpdate: function(row) {
      this.goRoute(`edit/${row.id}`)
    },
    onTableDelete: function(row) {
      this.confirm(`确认要删除【${row.name}】吗？`, function(done) {
        this.post('/template/del', row, function() {
          done()
          this.tip('删除成功')
          this.loadTable()
        })
      })
    },
    onAdd: function() {
      this.goRoute('edit/0')
    }
  }
}
</script>
