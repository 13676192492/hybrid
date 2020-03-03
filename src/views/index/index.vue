<template>
  <div class="home">
      <h2 class="tips">
        {{msg}}
        <p class="small">{{small}}</p>
      </h2>
    <img alt="Vue logo" src="@/assets/logo.png">
  </div>
</template>

<script>
// @ is an alias to /src
import {test} from '@/api/index'
export default {
  name: 'Home',
  data(){
      return {
          msg:'base-project',
          small:'模板'
      }
  },
  mounted(){
      let params = {
          user:'admin',
          passwork:'123456'
      }
      test(params).then(res=>{

      });
  }
}
</script>

<style lang="scss" scoped>
    .tips{
        color:#456;

        .small{
            font-size: 12px;
            color:#321;
        }
    }
</style>
