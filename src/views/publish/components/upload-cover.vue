<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img
        class="cover-image"
        ref="cover-image"
        :src="value"
      >
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="first">
          <!--
            ref 有两个作用
            1、 作用到普通 HTML 标签上可以获取 DOM
            2、 作用到组件上可以获取组件
           -->
          <image-list
            :is-show-action="false"
            :is-show-add="false"
            ref="image-list"
          ></image-list>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input type="file" ref="file" @change="onFileChange">
          <img ref="preview-image" width="100px">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageList from '../../image/components/image-list'
import { uploadImage } from '@/api/image'
export default {
  name: 'UploadCover',
  components: {
    ImageList
  },
  props: ['value'],
  // props: ['cover-image'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    showCoverSelect () {
      this.dialogVisible = true
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    onFileChange () {
      // console.log('file change')
      const file = this.$refs.file

      const blob = window.URL.createObjectURL(file.files[0])
      this.$refs['preview-image'].src = blob
      // console.log(blob)
      // this.$refs.file.value = ''
    },
    onCoverConfirm () {
      // 如果 tab 是上传图片 并且 input-file 有选择的文件 才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          console.log(res)
          this.dialogVisible = false
          this.$refs['cover-image'].src = res.data.data.url

          // this.$emit('update-cover', res.data.data.url)
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式 父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        // console.log(imageList.selected)
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-image {
  width: 100%;
  height: 100%;
  }
}
</style>
