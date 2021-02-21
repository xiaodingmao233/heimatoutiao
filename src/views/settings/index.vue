<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="4">
          <label for="file" style="cursor: pointer;">
            <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar>
          </label>
          <p style="cursor: pointer;" @click="$refs.file.click()">点击修改头像</p>
          <input id="file" type="file" hidden ref="file" @change="onFileChange">
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="perviewImage"
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      user: {
        email: '',
        id: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false,
      perviewImage: '',
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.loadUser()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    loadUser () {
      getUserProfile().then(res => {
        // console.log(res)
        this.user = res.data.data
      })
    },
    onFileChange () {
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])

      this.perviewImage = blobData

      this.dialogVisible = true
      // 解决选择相同文件不触发 change 事件的问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      const image = this.$refs['preview-image']
      // 裁切器 .replace 方法
      if (this.cropper) {
        this.cropper.replace(this.perviewImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1, // 1 / 1 裁切比例 16 / 9
        viewMode: 1, // 无法裁切图片外部
        dragMode: 'none', // 无法移动画布
        cropBoxResizable: false
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 销毁裁切器 重新初始化 性能消耗较大
      // this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像 请求提交 fd
        updateUserPhoto(fd).then(res => {
          console.log(res)
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示

          // 直接把裁切结果的文件对象转为 blob数据 本地预览
          this.user.photo = window.URL.createObjectURL(file)

          // 把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
