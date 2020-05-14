<template>
    <thead>讲师列表</thead>
</template>

<script>
import teacher from '@/api/teacher'

export default {
    data() {
        return {
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
        getTeacherPageList(){
            teacher.getTeacherPageList(this.current,this.limit,this.searchObj)
                .then(response => {
                    console.log(response)
                })
                .catch(response => {
                    console.log(response)
                })
        }
    }
}
</script>