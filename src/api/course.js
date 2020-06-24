import request from '@/utils/request'

const api_name = '/eduService/course'

export default{
  // 新增课程
  saveCourseInfo(eduCourseDto) {
    return request({
      url: `${api_name}/save-course-info`,
      method: post,
      data: eduCourseDto
    })
  }
}
