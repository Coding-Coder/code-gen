<template>
  <div>
    <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-bottom: 10px;" @click="onHistoryDel">删除</el-button>
    <el-table :data="tableData" border highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="generateTime" label="生成时间" width="155"/>
      <el-table-column prop="datasource" label="数据源" width="300"/>
      <el-table-column label="packageName" width="170">
        <template slot-scope="scope">
          {{ scope.row.configContent.packageName }}
        </template>
      </el-table-column>
      <el-table-column label="删除前缀" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.configContent.delPrefix }}
        </template>
      </el-table-column>
      <el-table-column label="表名">
        <template slot-scope="scope">
          <div v-if="scope.row.configContent.tableNames.length <= 5">
            {{ scope.row.configContent.tableNames.join('、') }}
          </div>
          <div v-else>
            {{ showArray(scope.row.configContent.tableNames, 3, '、') }}
            <el-popover placement="left" width="400" trigger="click">
              <el-table :data="scope.row.configContent.tableNames" max-height="400px">
                <el-table-column label="表名">
                  <template slot-scope="scope">{{ scope.row }}</template>
                </el-table-column>
              </el-table>
              <el-button type="text" slot="reference">更多</el-button>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="templateNames" label="模板组" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.templateGroupName }}
        </template>
      </el-table-column>
      <el-table-column prop="templateNames" label="模板" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.templateNames && scope.row.templateNames.join('、') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="onGenerate(scope.row)">再次生成</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'GenerateHistory',
  data() {
    return {
      tableData: [],
      multipleSelectionHistoryIds:[]
    }
  },
  created() {
    this.loadTable()
  },
  methods: {
    loadTable: function() {
      this.post('/history/list', {}, function(resp) {
        this.tableData = resp.data
      })
    },
    onGenerate(row) {
      const config = JSON.stringify(row.configContent)
      this.goRoute(`result/${config}`)
    },
    showArray(array, limit, split) {
      if (!array || array.length === 0) {
        return ''
      }
      const ret = []
      for (let i = 0; i < Math.min(limit, array.length); i++) {
        ret.push(array[i])
      }
      return ret.join(split)
    },
    handleSelectionChange(selectedRows){
      console.log(selectedRows);
      this.multipleSelectionHistoryIds = selectedRows
        .filter(row => row.hidden === undefined || row.hidden === false)
        .map(row => row.historyId)
      console.log(this.multipleSelectionHistoryIds)
    },
    onHistoryDel(){
      this.confirm(`确认要删除构建历史记录吗？`, function(done) {
        this.post('/history/delBatch', this.multipleSelectionHistoryIds, function() {
          done()
          this.tip('删除成功')
          this.loadTable()
        })
      })
    }
  }
}
</script>
