<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ this.$route.query.id ? '修改文章':'发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form :rules="rules" ref="publish-form" :model="article" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap height="300" v-model="article.content" :extensions="extensions" placeholder="Write something …"></el-tiptap>
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel,index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{ this.$route.query.id ? '修改':'发布' }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import { uploadImage } from '@/api/image'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  props: {},
  data () {
    return {
      article: {
        title: '',
        content: '',
        cover: {
          type: 0, // -1自动 0无图 1单图 3三图
          images: []
        },
        channel_id: null
      },
      channels: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new Image({
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              // console.log(res)
              return res.data.data.url
            })
          }
        }),
        new ListItem(),
        new BulletList(),
        new OrderedList()
      ],
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              console.log('11')
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // console.log(this.$route.query.id)
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () { },
  methods: {
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            updateArticle(this.$route.query.id, draft, this.article).then(res => {
              // console.log(res)
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$router.push('/article')
            })
          } else {
            addArticle(this.article, draft).then(res => {
              // console.log(res)
              this.$message({
                type: 'success',
                message: '发表成功'
              })
              this.$router.push('/article')
            })
          }
        } else {

        }
      })
    },
    loadChannels () {
      getChannels().then(res => {
        this.channels = res.data.data.channels
        // console.log(this.channels)
      })
    },
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        // console.log(res)
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
