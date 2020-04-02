<template>
  <div class="body">
    <van-row type="flex" class="tab">
      <van-col span="6" class="title">缴费项目</van-col>
      <van-col span="8">开始计算日期</van-col>
      <van-col span="6">已计费天数</van-col>
      <van-col span="4">比率</van-col>
    </van-row>
    <van-row type="flex" class="list" v-for="(item, index) in info" :key="index">
      <van-col span="6" class="title">{{ item.item_name }}</van-col>
      <van-col span="8">{{ item.calculate_date }}</van-col>
      <van-col span="6">{{ item.billing_days }}</van-col>
      <van-col span="4">{{ item.proportion}}%</van-col>
    </van-row>
    <p class="tips">滞纳金 = 应收*比率*已计费天数</p>
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
      info: null
    };
  },
  filters: {
    changeMoney(val) {
      return val.toFixed(2).toLocaleString();
    }
  },
  mounted() {
    this.info = this.$store.state.info;
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

  .tips{
      border-top: 1px solid #eee;
      padding: 4%;
      font-size: 1.3rem;
      color: #909399;
  }
}
</style>
