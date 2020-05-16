<template>
    <div class="app-container">
        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="searchObj.name" placeholder="讲师名"/>
        </el-form-item>
        <el-form-item>
            <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
                <el-option :value="1" label="高级讲师"/>
                <el-option :value="2" label="首席讲师"/>
            </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
            <el-date-picker
                v-model="searchObj.begin"
                type="datetime"
                placeholder="选择开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00"/>
        </el-form-item>
        <el-form-item>
            <el-date-picker
                v-model="searchObj.end"
                type="datetime"
                placeholder="选择截止时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00"/>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getTeacherPageList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>
        <!-- 表格 -->
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="数据加载中"
            border
            fit
            highlight-current-row>
        <el-table-column
            label="序号"
            width="70"
            align="center">
            <template slot-scope="scope">
                {{ (current - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="100" />
        <el-table-column label="头衔" width="80">
            <template slot-scope="scope">
                {{ scope.row.level===1?'高级讲师':'首席讲师' }}
            </template>
        </el-table-column>
        <el-table-column prop="intro" label="资历" :show-overflow-tooltip='true' />
        <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
        <el-table-column prop="sort" label="排序" width="60" align="center" />
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <router-link :to="'/edu/teacher/edit/'+scope.row.id">
                    <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                </router-link>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            :current-page="current"
            :page-size="limit"
            :total="total"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="fetchData"/>
     </div>
</template>

<script>
import teacher from '@/api/teacher'

export default {
    data() {
        return {
            listLoading: true, // 是否显示loading信息
            list: null, // 讲师列表
            current: 1, // 当前页
            limit: 5, // 每页记录数
            total: 0, // 总页数
            searchObj: {} //查询条件封装对象
        }
    },
    created() {
        this.getTeacherPageList()
    },
    methods: {
        // 调用api层获取数据库中的数据
        getTeacherPageList(){
            this.listLoading = true
            teacher.getTeacherPageList(this.current,this.limit,this.searchObj)
                .then(response => {
                    console.log(response)
                    this.list = response.data.data.rows
                    this.total = response.data.data.total
                    this.listLoading = false
                })
                .catch(response => {
                    console.log(response)
                })
        },
        // 清空查询表单数据，初始化页面
        resetData(){
            this.searchObj = {}
            this.getTeacherPageList()
        }
    }
}
</script>