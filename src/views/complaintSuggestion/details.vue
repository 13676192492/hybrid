<template>
  <div class="body">
    <van-cell-group>
      <van-cell title="状态" :value="info.state | state" class="red" />
      <p class="footerText" v-if="info.reply">客服回复：{{ info.reply }}</p>
      <div class="evaluateInfo" v-if="info.degree != undefined">
        <div>评价信息</div>
        <div class="evaluateType">
          <img :src="info.degree | showFace" alt="" />
          <span>{{ info.degree | showEvaluateType }}</span>
        </div>
      </div>
      <p class="footerText" v-if="info.evaluation != undefined">
        我的评价：{{ info.evaluation }}
      </p>

      <div class="center">
        <van-cell title="单号" :value="info.id" />
        <van-cell title="类型" :value="info.complaint_type" />
        <van-cell title="提交时间" :value="info.create_time" />
        <van-cell title="提交人" :value="info.name" />
        <van-cell title="联系电话" :value="info.telephone" />
      </div>
      <p class="footerText">我的描述：{{ info.description }}</p>
      <ul class="footerImg" v-if="info.image">
        <li v-for="(item, index) in info.image" :key="index">
          <van-image :src="item" fit="cover" use-error-slot>
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </li>
      </ul>
    </van-cell-group>
    <van-button
      type="primary"
      block
      color="#4073F2"
      v-if="info.state == 1 && info.degree == undefined"
      :to="`/Evaluate?type=0&id=${info.id}`"
      >评价</van-button
    >
  </div>
</template>

<script>
import Vue from "vue";
import { Image, Button } from "vant";
import { getdetails } from "@/api/complaintSuggestion.js";
import { param2Obj } from "@/util";
Vue.use(Button);
Vue.use(Image);
export default {
  data() {
    return {
      info: {}
    };
  },
  mounted() {
    let id = param2Obj(location.href).id;
    this.getData(id);
  },
  filters: {
    showFace(val) {
      let icon = [
        require("@/assets/images/evaluate/active_satisfity_pre.png"),
        require("@/assets/images/evaluate/active_general_pre.png"),
        require("@/assets/images/evaluate/active_no_satisfity_pre.png")
      ];
      return icon[+val];
    },
    showEvaluateType(val) {
      switch (+val) {
        case 0:
          return "满意";
        case 1:
          return "一般";
        default:
          return "不满意";
      }
    },
    state(val) {
      switch (+val) {
        case 0:
          return "待受理";
        case 1:
          return "已回复";
        default:
          return "已取消";
      }
    }
  },
  methods: {
    getData(id) {
      getdetails(id).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.image)
            res.data.data.image = res.data.data.image.split(",");
          this.info = res.data.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.red {
  .van-cell__value {
    color: #f56c6c;
  }
}
.center {
  width: 100%;
  border-bottom: 1px solid #eee;

  .van-cell:not(:last-child)::after {
    border: none;
  }
  .van-cell {
    color: #909399;
    padding: 5px 16px;
  }
}

.footerText {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 2% 4%;
  color: #909399;
  line-height: 1.7rem;
  font-size: 1rem;
  border-bottom: 1px solid #eee;
}

.footerImg {
  background-color: #fff;
  height: 25vw;
  padding: 0 4%;

  li {
    float: left;
    width: 20vw;
    height: 20vw;
    margin: 2% 2% 2% 0;
    border: 1px solid #eee;
    overflow: hidden;

    .van-image {
      height: 100%;
      width: 100%;
    }
  }
}

.evaluateInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.4rem;
  padding: 0 4% 0 0;
  width: 92%;
  margin-left: 4%;
  border-bottom: 1px solid #eee;
  font-size: 1.2rem;
  color: #606266;

  .evaluateType {
    width: 50%;
    font-size: 1.25rem;
    text-align: right;
    line-height: 2.5rem;
    color: #909399;

    img {
      margin-right: 5%;
      width: 2.5rem;
    }
  }
}

.van-button--block {
  margin: 8% 5%;
  width: 90%;
  border-radius: 5px;
}

.van-button::before {
  background-color: #3661cd;
}
</style>
