import request from '@/utils/request'

export const uploadImage = data => {
  return request({
    method: 'post',
    url: '/mp/v1_0/user/images',
    data
  })
}

export const getImages = params => {
  return request({
    method: 'get',
    url: '/mp/v1_0/user/images',
    params
  })
}
