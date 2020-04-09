export function getToken() {
    let token = localStorage.getItem('token');
    if (!token || token == 'null')
        token = null;
    return token;
}

export function getComId() {
    let comId = localStorage.getItem('comId');
    if (!comId || comId == 'null')
        comId = null;
    return comId;
}

export function getBaseInfo() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    if (isAndroid) {
        console.log(window.ulife)
        window.ulife.getBaseInfo();
        window.setBaseInfo = setAndroidBaseInfo;
    }
    if (isiOS) {
        window.webkit.messageHandlers.getBaseInfo.postMessage(null);
        window.setBaseInfo = setIOSBaseInfo;

    }

    return true;
}

//IOS设置token
function setIOSBaseInfo(token, comId) {
    localStorage.setItem('token', token)
    localStorage.setItem('comId', comId)
    getData();
}

//安卓设置token
function setAndroidBaseInfo(obj) {
    obj = JSON.parse(obj)
    localStorage.setItem('token', obj.token)
    localStorage.setItem('comId', obj.comId)
    console.log('设置');

    getData();
}