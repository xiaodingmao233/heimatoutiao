<template>
  <div class="image-list">
    <div class="action-head" style="margin-bottom: 20px">
      <el-radio-group @change="loadImages(1)" v-model="collect" size="mini">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button size="mini" type="success" @click="dialogUploadVisible=true">上传素材</el-button>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col class="image-item" :xs="12" :sm="6" :lg="4" v-for="(image, id) in images" :key="id">
          <el-image
            style="height: 100px"
            :src="image.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <el-button
              :loading='image.loading'
              type="success"
              :icon="image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              size="mini"
              circle
              @click="onCollect(image)"
            ></el-button>
            <el-button
              :loading='image.loading'
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="onDelete(image)"
            ></el-button>
        <!-- <i
              @click="onCollect(image)"
              style="cursor: pointer;"
              :class="{
                'el-icon-star-on': image.is_collected,
                'el-icon-star-off': !image.is_collected
              }"
            ></i>
            <i class="el-icon-delete"></i> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="totalCount"
      :page-size="pageSize"
      :current-page="page"
    >
    </el-pagination>
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
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageList',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      totalCount: 0,
      pageSize: 20,
      page: 1,
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
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res.data.data.results)
        const results = res.data.data.results
        results.forEach(image => {
          image.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(this.page)
    },
    handleCurrentChange (page) {
      this.loadImages(page)
    },
    onCollect (image) {
      // console.log(image)
      image.loading = true
      collectImage(image.id, !image.is_collected).then(res => {
        // console.log(res)
        image.is_collected = !image.is_collected
        image.loading = false
      })
    },
    onDelete (image) {
      image.loading = true
      deleteImage(image.id).then(res => {
        this.loadImages(this.page)
        image.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.action-head {
  display: flex;
  justify-content: space-between;
}

.image-item {
  position: relative;
  .image-action {
    position: absolute;
    right: 5px;
    bottom: 4px;
    left: 5px;
    height: 40px;
    background: rgba(53, 50, 50, 0.5);

    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 22px;
  }
}
</style>
