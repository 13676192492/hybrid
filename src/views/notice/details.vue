<template>
  <div class="body">
    <div class="header">
      <p class="title">{{ data.title }}</p>
      <p class="info">{{ data.create_time }}</p>
    </div>
    <div class="center" v-html="data.content"></div>
    <div class="footer">
      <p class="num">
        阅读
        <span> {{ data.views }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { getNoticeDetails } from "@/api/notice.js";
import { param2Obj } from "@/util";
export default {
  data() {
    return {
      data: {}
    };
  },
  mounted() {
    let id = param2Obj(location.href).id;

    getNoticeDetails(id).then(res => {
      if (res.data.code == 0) {
        this.data = res.data.data;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
body {
  background-color: #fff;
}
.header {
  height: 30vw;
  padding: 0 4%;
  display: flex;
  // align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    font-size: 2rem;
    margin-bottom: 5%;
  }
  .info {
    color: #909399;
    font-size: 1.25rem;
  }
}

.footer {
  padding: 5%;
  .num {
    font-size: 1.17rem;
    color: #909399;
    float: right;

    span {
      color: #4073f2;
    }
  }
}
</style>
