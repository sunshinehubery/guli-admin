import request from '@/utils/request'

const api_name = '/eduService/subject'

export default {
    // 嵌套课程数据查询列表
    nestedList(){
        return request({
            url: `${api_name}/list`,
            method: 'get',
        })
    },
    //删除二级分类课程通过主键id
    removeById(id){
        return request({
            url: `${api_name}/${id}`,
            method: 'delete',
        })
    }
}