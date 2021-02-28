<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 筛选表单 -->
      <el-form label-width="40px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!--
            button 按钮的 click 事件有个默认参数
            当你没有指定参数的时候 他会默认传递一个没用的数据
           -->
          <el-button :disabled="loading" type="primary" @click="loadArticles()"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查询结果 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{ this.totalCount }} 条结果:</span>
      </div>
      <!-- 表格 -->
      <el-table
        class="list-table"
        :data="articles"
        style="width: 100%"
        size="small"
        v-loading="loading"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div></el-image
            >
            <!--   <img
              class="article-cover"
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img class="article-cover" v-else src="./pic_bg.png" alt="" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据 那么就在 template 上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布日期"> </el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板 则把需要自定义的内容放到 template 里面 -->
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="$router.push('/publish?id=' + scope.row.id)">
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!--
        :total="totalCount" 自动计算 以10条每页默认计算
        可以自定义 page-size
        total/page-size
       -->
      <el-pagination
        @current-change="onCurrentChange"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      // 文章列表
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核成功', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      // 总数据数量
      totalCount: 0,
      // 每页展示数量
      pageSize: 10,
      // 查询文章的状态 不传就是全部
      status: null,
      // 文章频道
      channels: [],
      // 查询文章的频道
      channelId: null,
      // 范围日期
      rangeDate: null,
      loading: true,
      // 当前页码
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    this.loadArticles(1)
    this.loadChannels()
  },
  methods: {
    // 加载文章
    loadArticles (page) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize, // 每页大小
        status: this.status, // 查询文章的状态
        channel_id: this.channelId, // 查询文章的频道
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        // console.log(res)
        // total_count: totalCount 重命名
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        this.loading = false
      })
    },
    // 加载频道
    loadChannels () {
      getChannels().then(res => {
        this.channels = res.data.data.channels
        // console.log(this.channels)
      })
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    // 删除文章
    onDeleteArticle (articleId) {
      this.$confirm('确定删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId).then(res => {
          // console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadArticles(this.page)
        }).catch(err => {
          console.log('删除失败', err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
}
</style>
