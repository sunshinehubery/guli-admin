<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
    <el-button type="text" @click="dialogFormVisible = true">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      node-key="id"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => addTwodialog(data)">添加二级分类</el-button>
          <el-button
            v-if="node.level == 2"
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
      <el-form :model="eduSubject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="eduSubject.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;eduSubject.title='';eduSubject.parentId=''">取 消</el-button>
        <el-button type="primary" @click="append()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import subject from '@/api/subject'
export default {
  data() {
    return {
      filterText: '',
      subjectList: [],
      defaultProps: {
        children: 'subjectVoList',
        label: 'title'
      },
      dialogFormVisible: false,
      eduSubject: {
        title: '',
        parentId: ''
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val)
    }
  },
  created() {
    this.fetchNodeList()
  },
  methods: {
    fetchNodeList() {
      subject.nestedList().then(response => {
        if (response.data.code === 20000) {
          this.subjectList = response.data.data
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    remove(node, data) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return subject.removeById(data.id)
      }).then(() => {
        // 刷新列表
        // this.fetchNodeList()// 刷新列表（需要查库）
        this.$refs.subjectTree.remove(node) // 删除节点，效率更高
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败操作
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    // 添加分类（一级或二级）
    append(){
      if(!this.eduSubject.parentId){
        this.appendLevelOne()
      }else{
        this.appendLevelTwo()
      }
    },
    // 保存课程一级分类
    appendLevelOne() {
      subject.saveLevelOne(this.eduSubject).then(
        response => {
          if(response.data.code == 20000){
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.dialogFormVisible = false// 如果保存成功则关闭对话框
            this.fetchNodeList()// 刷新列表
            this.eduSubject.title = '' // 清空标题
          }else{
            this.$message({
              type: 'error',
              message: response.data.message
            })
          }
        }
      ).catch(response => {
        this.$message({
          code: 'error',
          message: '保存失败!'
        })
      })
    },
    addTwodialog(data){
      this.dialogFormVisible = true
      this.eduSubject.parentId = data.id
    },
    // 保存课程二级分类
    appendLevelTwo(){
      subject.saveLevelTwo(this.eduSubject).then(
        response => {
          if(response.data.code == 20000){
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.dialogFormVisible = false// 如果保存成功则关闭对话框
            this.fetchNodeList()// 刷新列表
            this.eduSubject.title = '' // 清空标题
            this.eduSubject.parentId = '' // 清空父类id
          }else{
            this.$message({
              type: 'error',
              message: response.data.message
            })
          }
        }
      ).catch(response => {
        this.$message({
          code: 'error',
          message: '保存失败!'
        })
      })
    }
  }
}
</script>
