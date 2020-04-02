import request from '@/util/request'

//获取用户房间
export function getMemberRoom() {
    return request({
        url: '/wuye/api/repair/app/room',
        method: 'get'
    })
}

//获取报修记录
export function getQuickRepairHistory(params) {
    return request({
        url: '/wuye/api/repair/app/my_record',
        method: 'get',
        params
    })
}

//提交报修信息
export function submitInfo(params) {
    return request({
        url: '/wuye/api/repair/app/repair',
        method: 'post',
        data: params
    })
}

//图片上传
export function uploaderImg(params) {
    return request({
        url: '/wuye/api/repair/app/image',
        method: 'post',
        data: params
    })
}

//获取详情
export function getdetails(id) {
    return request({
        url: `/wuye/api/repair/app/detail/${id}`,
        method: 'get'
    })
}

//取消
export function cancel(id) {
    return request({
        url: `/wuye/api/repair/app/cancel/${id}`,
        method: 'put'
    })
}