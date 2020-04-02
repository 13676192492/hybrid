<template>
  <div class="body">
    <van-row type="flex" class="tab">
      <van-col span="8" class="title">缴费项目</van-col>
      <van-col span="4">应收</van-col>
      <van-col span="4">滞纳金</van-col>
      <van-col span="4">优惠</van-col>
      <van-col span="4">应缴</van-col>
    </van-row>
    <van-row
      type="flex"
      class="list"
      v-for="(item, index) in list"
      :key="index"
    >
      <van-col span="8" class="title">{{ item.item_name }}</van-col>
      <van-col span="4" @click="showMask(item.receivable_amount)">{{
        item.receivable_amount | changeMoney
      }}</van-col>
      <van-col span="4" @click="showMask(item.late_fee)">{{
        item.late_fee | changeMoney
      }}</van-col>
      <van-col span="4" @click="showMask(item.discount_amount)">{{
        item.discount_amount | changeMoney
      }}</van-col>
      <van-col span="4" @click="showMask(item.pay_amount)">{{
        item.pay_amount | changeMoney
      }}</van-col>
    </van-row>
    <van-row type="flex" class="list footer">
      <van-col span="8" class="title">合计</van-col>
      <van-col span="4" @click="showMask(money1)">{{
        money1 | changeMoney
      }}</van-col>
      <van-col span="4" @click="showMask(money2)">{{
        money2 | changeMoney
      }}</van-col>
      <van-col span="4" @click="showMask(money3)">{{
        money3 | changeMoney
      }}</van-col>
      <van-col span="4" @click="showMask(money4)">{{
        money4 | changeMoney
      }}</van-col>
    </van-row>
    <van-cell value="滞纳金" title="" is-link to="./lateFee" />

    <van-popup
      v-model="show"
      :style="{ width: '50vw', height: '20vw' }"
      class="mask"
      >{{ text }}</van-popup
    >
  </div>
</template>

<script>
import Vue from "vue";
import { Col, Row, Popup } from "vant";

Vue.use(Popup);
Vue.use(Col);
Vue.use(Row);
export default {
  data() {
    return {
      show: false,
      text: null,
      list: [],
      money1: 0,
      money2: 0,
      money3: 0,
      money4: 0
    };
  },
  filters: {
    changeMoney(val) {
      return val.toFixed(2).toLocaleString();
    }
  },
  mounted() {
    this.list = this.$store.state.info;
    for (let i of this.list) {
      this.money1 += i.receivable_amount;
      this.money2 += i.late_fee;
      this.money3 += i.discount_amount;
      this.money4 += i.pay_amount;
    }
  },
  methods: {
    showMask(item = 0) {
      this.show = true;
      this.text = item;
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  background-color: #fff;
  .tab {
    height: 4.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #eee;

    div {
      //   text-align: center;
      color: #303133;
      font-weight: bold;
      font-size: 1.3rem;
    }
  }

  .list {
    height: 3.6rem;
    display: flex;
    align-items: center;
    justify-content: center;

    div {
      font-size: 1.3rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 1%;
      //   text-align: center;
      color: #909399;
    }
  }

  .footer {
    height: 4.6rem;
    border-top: 1px solid #eee;
  }
  .title {
    padding-left: 5vw !important;
  }
  .mask {
    font-size: 7vw;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
