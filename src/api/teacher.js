import request from '@/utils/request'

const api_name = '/eduService/teacher'
export default {
    //讲师列表（条件查询）
    //params: current(当前页),limit(每页记录数),searchObj(查询条件封装对象)
    getTeacherPageList(current,limit,searchObj){
        return request({
            url: `${api_name}/${current}/${limit}`,
            method: 'get',
            params: searchObj
          })
    },
    // 删除讲师（根据id逻辑删除）
    removeById(teacherId){
        return request({
            url: `${api_name}/${teacherId}`,
            method: 'delete'
        })
    },
    // 添加讲师
    saveTeacher(teacher){
        return request({
            url: `${api_name}`,
            method: 'post',
            data: teacher
        })
    },
    // 根据id查询讲师信息
    getTeacherById(id){
        return request({
            url: `${api_name}/${id}`,
            method: 'get',
        })
    },
    // 根据id更新讲师信息
    updateTeacherById(teacher){
        return request({
            url: `${api_name}/edit`,
            method: 'put',
            data: teacher
        })
    }
}