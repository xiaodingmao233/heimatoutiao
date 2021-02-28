/**
 * 文章相关请求模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body 参数使用 data 设置
    // Query 参数使用 params 设置
    // Headers 参数使用 headers 设置
    params
  })
}

/**
 * 获取文章频道
 */
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

/**
 * 删除文章
 */
export const deleteArticle = articleId => {
  return request({
    method: 'delete',
    // 接口文档中写的路径参数需要在 url 中传递
    // 凡是看见接口路径中有 :xxx 格式的字段 即需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/**
 * 新建文章
 */
export const addArticle = (data, draft) => {
  return request({
    method: 'post',
    url: '/mp/v1_0/articles',
    data,
    params: {
      draft // 是否存为草稿 true 为草稿
    }
  })
}

/**
 * 获取指定文章
 */
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/**
 * 编辑文章
 */
export const updateArticle = (articleId, draft, data) => {
  return request({
    method: 'put',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft: draft // 是否存为草稿 true 为草稿
    },
    data
  })
}

/**
 * 修改文章评论状态
 */
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'put',
    url: '/mp/v1_0/comments/status',
    params: {
      // 对象的属性名不受代码规范限制
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
