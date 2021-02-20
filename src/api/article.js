import request from '@/utils/request'

export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

export const deleteArticle = articleId => {
  return request({
    method: 'delete',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

export const addArticle = (data, draft) => {
  return request({
    method: 'post',
    url: '/mp/v1_0/articles',
    data,
    params: {
      draft
    }
  })
}

export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

export const updateArticle = (articleId, draft, data) => {
  return request({
    method: 'put',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft: draft
    },
    data
  })
}

export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'put',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
