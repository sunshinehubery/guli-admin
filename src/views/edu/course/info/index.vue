<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="eduCourseDto.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          @change="subjectLevelOneChanged"
          v-model="eduCourseDto.subjectParentId"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="eduCourseDto.subjectId" placeholder="请选择">
        <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="eduCourseDto.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
          <div style="bottom: 0;width: 100%;background: #fff">
            <el-pagination
                    small
                    @current-change="getTeacherPageList"
                    @size-change="handleSizeChange"
                    :current-page="current"
                    :page-size="limit"
                    :page-sizes="[1,2,5,10,20]"
                    layout="sizes,prev,next"
                    :total="total">
            </el-pagination>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="eduCourseDto.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>
      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <Tinymce v-model="eduCourseDto.description" :height="300"/>
      </el-form-item>
      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="OSS_API+'oss/file/upload?host=cover'"
          class="avatar-uploader">
          <img :src="eduCourseDto.cover" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="eduCourseDto.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/course'
import subject from '@/api/subject'
import teacher from '@/api/teacher'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  title: '',
  subjectParentId: '',
  subjectId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: process.env.OSS_PATH + '/cover/default.jpg',
  price: 0
}
export default {
  components:{Tinymce},
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      eduCourseDto: defaultForm, // 表单课程信息
      subjectNestedList: [], //一级分类列表
      subSubjectList: [], //二级分类列表
      teacherList: [], // 讲师列表 
      current: 1, // 当前页
      limit: 5, // 每页记录数
      total: 0, // 总页数
      OSS_API: process.env.OSS_API, //上传图片组件api
    }
  },
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if(this.$route.params && this.$route.params.id){
        const id = this.$route.params.id
        this.getCourseInfoById(id)
      }else{
        this.eduCourseDto = {...defaultForm}
        // 初始化分类列表
        this.initSubjectList()
        // 初始化讲师列表
        this.getTeacherPageList()
      }
    },
    // 根据ID查询课程
    getCourseInfoById(id){
      course.getCourseInfoById(id).then(response => {
          this.eduCourseDto = response.data.data
          subject.nestedList().then(response => {
            this.subjectNestedList = response.data.data
            for(let i = 0; i < this.subjectNestedList.length; i++){
              if(this.subjectNestedList[i].id === this.eduCourseDto.subjectParentId){
                this.subSubjectList = this.subjectNestedList[i].subjectVoList
              }
            }
          })
          // 初始化讲师列表
        this.getTeacherPageList()
      }).catch(response => {
        this.$message({
          code: 'error',
          message: '获取数据失败！'
        })
      })
    },
    next() {
      this.saveBtnDisabled = true
      this.saveOrUpdateData()
    },
    // 保存课程数据
    saveOrUpdateData(){
      course.saveCourseInfo(this.eduCourseDto).then(response => {
        if(response.data.code == 20000){
          this.$message({
            type: 'success',
            message: response.data.message
          })
          // 保存成功将response传递给下一个then
          return response
        }else{
          this.$message({
              type: 'error',
              message: response.data.message
          })
        }
      }).then(response => {
        this.$router.push({ path: '/edu/course/chapter/' + response.data.data })
      }).catch(response => {
        this.$message({
          code: 'error',
          message: '保存失败!'
        })
      })
    },
    //获取一级分类
    initSubjectList(){
      subject.nestedList().then(response => {
        this.subjectNestedList = response.data.data
      })
    },
    //触发change事件，显示一级分类里面所有的二级分类
    subjectLevelOneChanged(value) {
      //获取选择一级分类的id值
      //根据一级分类id值，获取下面的所有二级分类

      //1 遍历所有一级分类集合
      //2 获取每个一级分类
      //3 判断value值和遍历出来的每个一级分类id值是否一样，
      //如果一样，获取下面二级分类，是child
      for(var i=0;i<this.subjectNestedList.length;i++) {
        //获取每个一级分类
        var levelOne = this.subjectNestedList[i]
        //判断value值和遍历出来的每个一级分类id值是否一样
        if(levelOne.id === value) {
            //获取下面二级分类，是children
            this.subSubjectList = levelOne.subjectVoList
            this.eduCourseDto.subjectId = ''
        }
      }
    },
    // 修改每页获取条数
    handleSizeChange(val){
      this.limit = val
      this.getTeacherPageList()
    },
    // 获取讲师列表信息（分页）
    getTeacherPageList(current = 1) {
      this.current = current
      this.listLoading = true
      teacher.getTeacherPageList(this.current, this.limit, this.searchObj)
        .then(response => {
          this.teacherList = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(response => {
          console.log(response)
        })
    },
    //  校验
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 /1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 上传成功回调
    handleAvatarSuccess(res, file){
      this.eduCourseDto.cover = res.data
    },
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .el-pagination {
    text-align: center
  }
  .tinymce-container {
    line-height: 29px;
  }
</style>
