<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH + '/excel/%E6%B5%8B%E8%AF%95%E6%95%B0%E6%8D%AE.xls'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'eduService/subject/importSubject'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                OSS_PATH: process.env.OSS_PATH, //阿里云oss地址
                BASE_API: process.env.BASE_API, // 接口API地址
                importBtnDisabled:false,// 按钮是否禁用,
                loading: false,
                fileUploadBtnText: "上传到服务器",
            }
        },
        created(){

        },
        methods:{
            //提交表单的方法
            submitUpload(){
                this.importBtnDisabled = true
                this.loading = true
                //提交表单
                this.$refs.upload.submit()
            },
            //上传成功调用的方法
            fileUploadSuccess(response) {
                if(response.code==21000) {
                    this.loading = false
                    this.$message({
                        type: 'success',
                        message: '导入成功'
                    })
                    //跳转回到列表页面
                    this.$router.push({ path: '/edu/subject/list' })
                } else {
                    //获取返回list集合
                    const messages = response.data
                    let msgString = '<ul>'
                    messages.forEach(msg => {
                        msgString += `<li>${msg}</li>`
                    })
                    msgString += '</ul>'
                    this.$alert(msgString, response.message, {
                        dangerouslyUseHTMLString: true
                    })
                    //跳转回到列表页面
                    this.$router.push({ path: '/edu/subject/list' })
                }
            },
            //上传失败调用的方法
            fileUploadError() {
                this.loading = false
                this.$message({
                    type: 'error',
                    message: '导入失败'
                })
            }
        }
    }
</script>