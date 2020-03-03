import request from '@/util/request'

export function test(params){
    return request({
        url: '/api/user/login',
        method: 'post',
        data: params
    })
}