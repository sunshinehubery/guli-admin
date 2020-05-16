<template>
  <div class="app-container">
    <el-form label-width="120px">
        <el-form-item label="讲师名称">
            <el-input v-model="teacher.name"/>
        </el-form-item>
        <el-form-item label="讲师排序">
            <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
        </el-form-item>
        <el-form-item label="讲师头衔">
            <el-select v-model="teacher.level" clearable placeholder="请选择">
            <!--
                数据类型一定要和取出的json中的一致，否则没法回填
                因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
            </el-select>
        </el-form-item>
        <el-form-item label="讲师资历">
            <el-input v-model="teacher.career"/>
        </el-form-item>
        <el-form-item label="讲师简介">
            <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
        </el-form-item>
        <!-- 讲师头像：TODO -->
        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacher from '@/api/teacher'


const defaultForm = {
    name: '',
    sort: 0,
    level: '',
    career: '',
    intro: '',
    avatar: ''
}
export default {
    data(){
        return{
            teacher: defaultForm,
            saveBtnDisabled: false // 保存按钮是否禁用,
        }
    },
    created(){
        this.init()
    },
    methods: {
        init(){
            if(this.$route.params && this.$route.params.id){
                console.log(id)
                const id = this.$route.params.id
                this.getTeacherById(id)
            }
        },
        // 新增或修改
        saveOrUpdate(){
            this.saveBtnDisabled = true
            if (!this.teacher.id) {
                this.saveData()
            } else {
                this.updateTeacherById()
            }
        },
        // 新增讲师
        saveData(){
            teacher.saveTeacher(this.teacher).then(response => {
                return this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
            }).then(resposne => {
                this.$router.push({ path: '/teacher/list' })
            }).catch((response) => {
                // console.log(response)
                this.$message({
                    type: 'error',
                    message: '保存失败'
                })
            })
        },
        // 根据id查询讲师信息
        getTeacherById(id){
            teacher.getTeacherById(id).then(response => {
                this.teacher = response.data.data.item
            }).catch((response) => {
                this.$message({
                    type: 'error',
                    message: '获取数据失败'
                })
            })
        },
        // 根据id更新讲师信息
        updateTeacherById(){
            this.saveBtnDisabled = true
            teacher.updateTeacherById(this.teacher).then(response => {
                return this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
            }).then(resposne => {
                this.$router.push({ path: '/teacher/list' })
            }).catch((response) => {
                // console.log(response)
                this.$message({
                    type: 'error',
                    message: '保存失败'
                })
            })
        }
    }
}
</script>