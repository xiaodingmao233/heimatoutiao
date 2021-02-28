<template>
  <div class="comment-container">
   <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        class="table-list"
        :data="articles"
        style="width: 100%"
        stripe
      >
        <el-table-column
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
        >
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
        >
        </el-table-column>
        <el-table-column
          label="评论状态"
        >
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.disabled"
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [],
      pageSize: 10,
      totalCount: 0,
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.loadArticles()
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      // this.pageSize = val // 在:page-size.sync="pageSize" 加上.sync修饰符后就可以省略此步骤
      this.loadArticles(1)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.loadArticles(val)
    },
    loadArticles (page = 1) {
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize // 每页大小
      }).then(res => {
        // console.log(res)
        const results = res.data.data.results
        results.forEach(item => {
          item.disabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
        // console.log(this.articles)
      })
    },
    onStatusChange (article) {
      // console.log(article)
      article.disabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // console.log(res)
        article.disabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启成功' : '关闭成功'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-list {
  margin-bottom: 30px;
}
</style>
