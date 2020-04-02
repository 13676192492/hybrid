<template>
  <div class="body">
    <div class="box">
      <img src="@/assets/images/propertyPay/paySuccess.png" alt="" />
      <small>支付成功</small>
      <van-button type="primary" block color="#4073F2" to="./details"
        >查看支付记录</van-button
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Button } from "vant";

Vue.use(Button);
export default {};
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100vh;
  background-color: #fff;

  .box {
    width: 100%;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 50%;
    }

    small {
      color: #4073f2;
      margin-bottom: 10%;
      font-size: 1.2rem;
    }

    .van-button--block {
      width: 90%;
      border-radius: 5px;
    }

    .van-button::before{
        background-color: #3661CD;
    }
  }
}
</style>
