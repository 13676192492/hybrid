import request from '@/util/request'

//获取列表信息
export function getList(params) {
    return request({
        url: '/wuye/api/app/getOrder',
        method: 'get',
        params
    })
}