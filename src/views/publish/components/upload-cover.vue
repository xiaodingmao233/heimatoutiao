<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-image" src="http://toutiao-img.itheima.net/FhJIMaluxPwb0TSn9JA6VLMPZ_re" alt="">
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="first">素材库</el-tab-pane>
        <el-tab-pane label="上传图片" name="second">上传图片</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadCover',
  components: {},
  props: {},
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
      console.log(tab, event)
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
