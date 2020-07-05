import request from '@/utils/request'

const api_name = '/eduService/course'

export default{
  // 新增课程
  saveCourseInfo(eduCourseDto) {
    return request({
      url: `${api_name}/save-course-info`,
      method: 'post',
      data: eduCourseDto
    })
  },
  // 根据ID查询课程
  getCourseInfoById(id){
    return request({
      url: `${api_name}/courseInfo/${id}`,
      method: 'get'
    })
  }
}