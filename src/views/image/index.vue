<template>
 <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head" style="margin-bottom: 20px">
        <el-radio-group @change="onCollectChange" v-model="collect" size="mini">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button size="mini" type="success" @click="dialogUploadVisible=true">上传素材</el-button>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :xs="12" :sm="6" :lg="4" v-for="(image, id) in images" :key="id">
            <el-image
              style="height: 100px"
              :src="image.url"
              fit="cover"
            ></el-image>
          </el-col>
        </el-row>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="1000">
      </el-pagination>
    </el-card>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
      width="30%"
      center
    >
      <el-upload
        class="upload-demo"
        :headers="uploadHeaders"
        :on-success="onUploadSuccess"
        name="image"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
 </div>
</template>

<script>
import { getImages } from '@/api/image'
export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.loadImages(1)
  },
  methods: {
    loadImages (page = 1) {
      getImages({
        collect: this.collect,
        page,
        per_page: 20
      }).then(res => {
        // console.log(res.data.data.results)
        this.images = res.data.data.results
      })
    },
    onCollectChange () {
      this.loadImages(1)
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(false)
    },
    handleCurrentChange (page) {
      this.loadImages(page)
    }
  }
}
</script>

<style scoped lang="less">
.action-head {
  display: flex;
  justify-content: space-between;
}
</style>
