import request from '@/util/request'

//图片上传
export function uploaderImg(params) {
    return request({
        url: '/wuye/api/complaint/app/image',
        method: 'post',
        data: params
    })
}

//获取列表
export function getList(params) {
    return request({
        url: `/wuye/api/complaint/app/my_record`,
        method: 'get',
        params
    })
}

//提交
export function submitInfo(params) {
    return request({
        url: '/wuye/api/complaint/app/complaintbox',
        method: 'post',
        data: params
    })
}

//获取详情
export function getdetails(id) {
    return request({
        url: `/wuye/api/complaint/app/detail/${id}`,
        method: 'get'
    })
}