import request from '@/util/request'

//公告列表
export function getNoticeList(params) {
    return request({
        url: '/wuye/notice/app',
        method: 'get',
        params
    })
}

//公告详情
export function getNoticeDetails(id) {
    return request({
        url: `/wuye/notice/app/${id}`,
        method: 'get'
    })
}