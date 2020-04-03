<template>
  <van-tabs
    v-model="active"
    color="#4073F2"
    title-active-color="#4073F2"
    line-width="30%"
    @change="changeTab"
  >
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-tab title="待缴">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="tipText"
          @load="getListData"
        >
          <div class="beforList" v-for="(item, index) in list" :key="index">
            <div class="header">
              <van-checkbox
                shape="square"
                @click="checkedEvent(item)"
                :name="item.total_amount"
                v-model="item.isCheck"
                class="orderNum"
                >{{ item.bill_no }}</van-checkbox
              >

              <p class="money">¥ {{ item.total_amount | changeMoney }}</p>
            </div>
            <div class="center">
              <van-cell-group>
                <van-cell
                  v-for="(info, index) in item.wyCostDetailsVoList"
                  :key="index"
                  :title="info.item_name"
                  :value="info.receivable_amount | changeMoney"
                />
                <van-cell
                  value="查看明细"
                  @click="run(item.wyCostDetailsVoList)"
                  is-link
                  class="run"
                >
                  <template slot="title">
                    <span class="custom-title"></span>
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
            <div class="footer">
              <van-cell-group>
                <van-cell title="缴费月份" :value="changeTime(item)" />
                <van-cell title="房间" :value="item.room_address" />
                <van-cell title="备注" :value="item.note" />
              </van-cell-group>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="已缴">
        <div class="paid">
          <van-field
            readonly
            clickable
            name="datetimePicker"
            :value="value"
            label="缴费月份"
            :placeholder="value"
            right-icon="arrow"
            input-align="right"
            @click="showPicker = true"
            class="payBox"
          />
          <van-popup v-model="showPicker" position="bottom">
            <van-datetime-picker
              type="year-month"
              :min-date="minDate"
              :formatter="formatter"
              @confirm="onConfirm"
              @cancel="closePicker"
            />
          </van-popup>
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="tipText"
            @load="getListData"
          >
            <div class="paidList" v-for="(item, index) in list" :key="index">
              <div class="center">
                <van-cell-group>
                  <div class="cellBox">
                    <van-cell title="缴费单号" :value="item.bill_no" />
                    <van-cell
                      title="缴费金额"
                      :value="item.total_amount | changeMoney"
                      class="moneyInput"
                    />
                    <van-cell title="缴费月份" :value="changeTime(item)" />
                  </div>

                  <van-cell
                    value="查看详情"
                    is-link
                    class="run"
                    @click="toDetails(item)"
                  >
                    <template slot="title">
                      <span class="custom-title">{{ item.pay_time }}</span>
                    </template>
                  </van-cell>
                </van-cell-group>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>

      <not-data v-if="isNotData" />
    </van-pull-refresh>
    <van-submit-bar
      :price="payMoney"
      v-show="active == 0"
      button-text="支付"
      @submit="onSubmit"
    >
      <van-checkbox v-model="isAll" :name="0" @click="checkAll"
        >全选</van-checkbox
      >
    </van-submit-bar>
  </van-tabs>
</template>

<script>
import Vue from "vue";
import {
  Checkbox,
  CheckboxGroup,
  DatetimePicker,
  Popup,
  Form,
  Field,
  SubmitBar,
  List
} from "vant";
import NotData from "@/components/NotData";
import { Toast } from "vant";
import { getList } from "@/api/propertyPay.js";
import { changeTimeFormat } from "@/util/updateTime";
import { param2Obj } from "@/util";

//测试更改小区ID
import { getComId } from "@/util/getData";

Vue.use(SubmitBar);
Vue.use(Field);
Vue.use(Form);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(List);

export default {
  name: "propertyPay",
  components: {
    NotData
  },
  data() {
    return {
      finished: false,
      tipText: "",
      loading: false,
      isLoading: false,
      checked: 0,
      isNotData: false,
      minDate: new Date(2018, 1, 0),
      payMoney: 0,
      isAll: false,
      showPicker: false,
      value: "",
      list: [],
      checkedArr: [],
      active: 0,
      params: {
        bill_status: 1,
        community_id: getComId(),
        pay_date: null
      }
    };
  },
  filters: {
    changeMoney(val) {
      return val.toFixed(2).toLocaleString();
    },
    updateTime(val) {
      return changeTimeFormat(val, 3);
    }
  },
  mounted() {
    this.getListData();
  },
  methods: {
    //路由跳转（明细）
    run(arr) {
      this.$store.commit("update", arr);
      this.$router.push({ path: "./detailed" });
    },
    //路由跳转（详情）
    toDetails(item) {
      this.$store.commit("update", item.wyCostDetailsVoList);
      this.$store.commit("details", item);
      this.$router.push({ path: "./details" });
    },
    //取消
    closePicker() {
      this.showPicker = false;
      this.value = "";
      this.params.pay_date = null;
      this.getListData();
    },
    //切换tab
    changeTab() {
      this.list = [];
      this.finished = false;
      if (this.active == 1) {
        this.params.bill_status = 2;
      } else {
        this.value = "";
        this.params.bill_status = 1;
        this.params.pay_date = null;
      }
      this.getListData();
    },
    //选择事件
    checkedEvent(item) {
      if (!item.isCheck) {
        this.checked++;
        this.payMoney += item.total_amount * 100;
      } else {
        this.checked--;
        this.payMoney -= item.total_amount * 100;
      }

      if (this.list.length == this.checked) {
        this.isAll = true;
      } else {
        this.isAll = false;
      }
    },
    //修改时间格式
    changeTime(item) {
      let startTime = changeTimeFormat(item.start_time),
        endTime = changeTimeFormat(item.end_time);
      return `${startTime} 至 ${endTime}`;
    },
    //全选
    checkAll() {
      if (this.list.length > 0) {
        this.payMoney = 0;

        if (!this.isAll) {
          for (let i in this.list) {
            this.list[i].isCheck = true;
            this.payMoney += this.list[i].total_amount * 100;
            this.checked = this.list.length;
          }
        } else {
          for (let i in this.list) {
            this.list[i].isCheck = false;
            this.checked = 0;
          }
        }
      }
    },
    onRefresh() {
      this.checked = 0;
      this.list = [];
      this.isAll = false;
      this.payMoney = 0;
      this.isLoading = true;
      this.getListData(true);
    },
    onConfirm(time) {
      this.value = changeTimeFormat(time, 1);
      this.list = [];
      this.params.pay_date = changeTimeFormat(time, 2);
      this.getListData();
      this.showPicker = false;
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    //提交
    onSubmit() {
      this.$router.push({ path: "./success" });
    },
    //获取列表数据
    getListData(...state) {
      this.loading = true;

      getList(this.params)
        .then(res => {
          if (res.data.code == 0) {
            this.finished = true;
            if (!res.data.data) {
              this.isNotData = true;
            } else {
              if (res.data.data.length > 0) {
                this.isNotData = false;

                for (let i in res.data.data) {
                  res.data.data[i].isCheck = false;
                }
              }

              this.list = res.data.data;
            }
            if (state[0]) {
              Toast.success("刷新成功");
              this.isLoading = false;
            }
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.finished = true;
          Toast.fail("网络异常，请稍后重试");
          this.isLoading = false;
          this.isLoad = false;
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/common.scss";

/deep/[class*="van-hairline"]::after {
  border: none;
}

.van-submit-bar {
  border-top: 1px solid #eee;
}

.van-submit-bar__bar {
  padding: 0 0 0 16px;
}
.van-submit-bar__button {
  height: 100%;
}
/deep/.van-button--round {
  border-radius: inherit;
}
.van-submit-bar__button--danger {
  background: #4073f2;
}

.van-button--danger {
  border: none;
}
// .van-submit-bar__text{
//   text-align: center;

//   span{
//     color:#F56C6C
//   }
// }

.center,
.footer {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;

  .van-cell:not(:last-child)::after {
    border: none;
  }
  .van-cell {
    color: #909399;
    padding: 5px 16px;
  }
  .run {
    span {
      color: #4073f2 !important;
    }
    .van-icon-arrow::before {
      color: #4073f2 !important;
    }
  }
}

.beforList {
  margin-bottom: 50px;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 3vw;

  .header {
    width: 97%;
    margin-left: 3%;
    height: 3.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;

    .orderNum {
      font-size: 1.3rem;
      width: 63%;

      /deep/.van-checkbox__label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .money {
      color: #f56c6c;
      font-size: 1.6rem;
      padding-right: 3%;
    }
  }
}
.paid {
  border-top: 1px solid #dcdfe6;

  /deep/.van-field__control {
    color: #909399;
  }

  .paidList {
    margin-bottom: 3vw;

    .cellBox {
      /deep/.van-cell__title {
        flex: inherit;
        width: 30%;
      }
    }

    .moneyInput {
      .van-cell__value {
        color: #f56c6c;
      }
    }

    .payBox {
      font-size: 16px;
      line-height: 35px;
    }
    .run {
      border-top: 1px solid #dcdfe6;
      line-height: 35px;

      .van-cell__title span {
        color: #909399 !important;
      }
      .van-cell__right-icon {
        line-height: 35px;
      }
    }
  }
}

/deep/.van-tabs__content {
  height: calc(100vh - 7.5rem) !important;
  overflow: auto;
}
</style>
