<template>
  <ul>
    <li>
      <a href="./#/propertyPay">缴费页面</a>
    </li>
     <li>
      <a href="./#/quickRepair">快速报修</a>
    </li>
     <li>
      <a href="./#/notice">通知公告</a>
    </li>
     <li>
      <a href="./#/complaintSuggestion">投诉建议</a>
    </li>

    <li>token：<input type="text" v-model="token"></li>
    <li>小区id：<input type="text" v-model="comId"></li>
    <li><button @click="set">保存</button></li>
  </ul>
</template>
<style lang="scss" scoped>
li{
    text-align: center;
    line-height: 5rem;
    font-size: 2rem;
}
button{
    margin-top: 5%;
}
</style>
<script>
export default {
    data(){
        return {
            token:null,
            comId:null
        }
    },
    methods:{
        async set(){
            console.log(this.token)
            
            await localStorage.setItem('token',this.token)
            await localStorage.setItem('comId',this.comId)
            await alert('成功')
        }
    }
}
</script>
