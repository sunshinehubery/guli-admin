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
    }
}