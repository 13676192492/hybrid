import request from '@/util/request'

//投诉建议评价
export function complaintEvaluate(params) {
    return request({
        url: '/wuye/api/complaint/app/evaluation',
        method: 'post',
        data: params
    })
}

//报修评价
export function repairEvaluate(params) {
    return request({
        url: `/wuye/api/repair/app/evaluation/${params.id}`,
        method: 'post',
        data: params
    })
}