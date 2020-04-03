<template>
  <div class="body">
    <van-field
      v-model="params.evaluation"
      rows="1"
      maxlength="200"
      :autosize="{ maxHeight: 250, minHeight: 180 }"
      type="textarea"
      placeholder="说点什么吧..."
      show-word-limit
    />
    <van-tabbar v-model="active" :fixed="false">
      <van-tabbar-item>
        <span>满意</span>
        <template #icon="props">
          <img :src="props.active ? icon[0].active : icon[0].inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item>
        <span>一般</span>
        <template #icon="props">
          <img :src="props.active ? icon[1].active : icon[1].inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item>
        <span>不满意</span>
        <template #icon="props">
          <img :src="props.active ? icon[2].active : icon[2].inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <van-button
      type="primary"
      block
      color="#4073F2"
      :disabled="isDisabled"
      @click="submit"
      >立即提交</van-button
    >
  </div>
</template>

<script>
import Vue from "vue";
import { Field, Tabbar, TabbarItem, Button, Toast } from "vant";
import { complaintEvaluate, repairEvaluate } from "@/api/evaluate.js";
import { param2Obj } from "@/util";

Vue.use(Field);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Button);
Vue.use(Toast);

export default {
  data() {
    return {
      active: 0,
      isDisabled: false,
      params: {
        degree: 0,
        evaluation: "",
        id: null
      },
      icon: [
        {
          active: require("@/assets/images/evaluate/active_satisfity_pre.png"),
          inactive: require("@/assets/images/evaluate/satisfity_nor.png")
        },
        {
          active: require("@/assets/images/evaluate/active_general_pre.png"),
          inactive: require("@/assets/images/evaluate/general_nor.png")
        },
        {
          active: require("@/assets/images/evaluate/active_no_satisfity_pre.png"),
          inactive: require("@/assets/images/evaluate/not_satisfity_nor.png")
        }
      ]
    };
  },
  mounted() {
    let id = param2Obj(location.href).id;
    if (!!param2Obj(location.href).type) {
      this.params.id = id;
    }

    let img = new Image();
    let imgArr = [
      require("@/assets/images/evaluate/active_satisfity_pre.png"),
      require("@/assets/images/evaluate/satisfity_nor.png"),
      require("@/assets/images/evaluate/active_general_pre.png"),
      require("@/assets/images/evaluate/general_nor.png"),
      require("@/assets/images/evaluate/active_no_satisfity_pre.png"),
      require("@/assets/images/evaluate/not_satisfity_nor.png")
    ];
    for (let i of imgArr) {
      this.preloading(img, i);
    }
  },
  methods: {
    //预加载图片
    preloading(img, src) {
      new Promise((resolve, reject) => {
        img.src = src;
        img.onload = () => {
          resolve();
        };
      });
    },
    //提交
    submit() {
      this.isDisabled = true;
      this.params.degree = this.active;
      if (!this.params.evaluation) {
        Toast.fail("请输入评价");
        this.isDisabled = false;
        return;
      }
      //投诉建议
      if (param2Obj(location.href).type==0) {
        complaintEvaluate(this.params).then(res => {
          if (res.data.code == 0) {
            Toast.success("提交成功");
            setTimeout(() => {
              this.$router.push({
                path: `/complaintSuggestion/details?id=${this.params.id}`
              });
            }, 2000);
          } else {
            this.isDisabled = false;
          }
        });
      } else {
        repairEvaluate(this.params).then(res => {
          if (res.data.code == 0) {
            Toast.success("提交成功");
            setTimeout(() => {
              this.$router.push({
                path: `/quickRepair/details?id=${this.params.id}`
              });
            }, 2000);
          } else {
            this.isDisabled = false;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.van-tabbar {
  height: 9rem;

  /deep/.van-tabbar-item__icon {
    margin-bottom: 8%;

    img {
      height: 4rem;
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

/deep/.van-tabbar-item:not(:last-child)::after {
  height: 50%;
  position: absolute;
  width: 1px;
  right: 0;
  border: 1px solid #eee;
}
</style>
