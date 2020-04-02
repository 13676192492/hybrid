<template>
  <div class="body">
    <ul class="header">
      <li>{{ info.room_address }}</li>
      <li class="money">{{ info.total_amount | changeMoney}}</li>
      <li class="payType">
        <img src="@/assets/images/propertyPay/success.png" alt="" />
        支付成功
      </li>
    </ul>
    <div class="center">
      <div class="cell">
        <span class="title">缴费单号</span>
        <span>{{ info.bill_no }}</span>
      </div>
      <div class="cell">
        <span class="title">费用日期</span>
        <span>{{ changeTime(info) }}</span>
      </div>
      <van-cell-group class="info">
        <van-cell title="缴费项目" class="title" />
        <van-cell
          v-for="(item, index) in info.wyCostDetailsVoList"
          :key="index"
          :title="item.item_name"
          :value="item.receivable_amount | changeMoney"
        />
        <!-- <van-cell title="垃圾处理费" value="12" />
        <van-cell title="水费" value="13" />
        <van-cell title="电费" value="14" /> -->
        <van-cell value="查看明细" is-link class="run" to="./detailed">
          <template slot="title">
            <span class="custom-title"></span>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group class="baseInfo">
        <van-cell title="缴费住户" class="title" :value="info.username" />
        <van-cell title="付款方式" class="title" :value="info.payment_method" />
        <van-cell title="支付时间" class="title" :value="info.pay_time | updateTime" />
        <van-cell title="备注" class="title" :value="info.note" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { changeTimeFormat } from "@/util/updateTime";

export default {
  data() {
    return {
      info: {}
    };
  },
  created() {
    this.info = this.$store.state.detailsInfo;
    console.log(this.info)
  },
  filters: {
    changeMoney(val) {
      return val.toFixed(2).toLocaleString();
    },
    updateTime(val) {
      return changeTimeFormat(val, 3);
    }
  },
  methods: {
    changeTime(item) {
      let startTime = changeTimeFormat(item.start_time),
        endTime = changeTimeFormat(item.end_time);
      return `${startTime} 至 ${endTime}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  background-color: #fff;

  .header {
    height: 55vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-bottom: 1px solid #eee;

    li {
      margin: 2% 0;
      font-size: 1.3rem;
    }

    .money {
      font-size: 8vw;
      font-weight: bold;
      color: #303133;
    }

    .payType {
      color: #909399;
      font-size: 3vw;

      img {
        width: 4.5vw;
      }
    }
  }

  .center {
    .cell {
      width: 97%;
      margin-left: 3%;
      height: 4.6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;

      span {
        color: #909399;
        padding-right: 3%;
        font-size: 1.2rem;
      }
    }
    .title {
      color: #303133 !important;
      font-size: 1.4rem !important;
    }

    .van-cell:not(:last-child)::after {
      border: none;
    }
    .van-cell {
      color: #909399;
      padding: 6px 12px;
    }
    .run {
      span {
        color: #4073f2 !important;
      }
      .van-icon-arrow::before {
        color: #4073f2 !important;
      }
    }

    .info {
      border-bottom: 1px solid #eee;
    }

    .baseInfo {
      .van-cell__value {
        span {
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>
