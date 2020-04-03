//修改时间格式
export function changeTimeFormat(time, type = 0) {
    let date = new Date(time);
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();

    if (type == 0) {
        month = setDate(month);
        day = setDate(day);
        return `${year}-${month}-${day}`;
    } else if (type == 1) {
        return `${year}年 ${month}月`
    } else if (type == 2) {
        month = setDate(month);
        return `${year}-${month}`
    }else if (type == 3) {
        let hours = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
        month = setDate(month);
        day = setDate(day);
        min = setDate(min)
        hours = setDate(hours)
        sec = setDate(sec)
        return `${date.getFullYear()}-${month}-${day} ${hours}:${min}:${sec}`
    }

}

function setDate(param) {
    // console.log(param);
    if (param < 10) param = '0' + param
    return param
}