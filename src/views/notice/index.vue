<template>
  <div class="body">
    <div class="center">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="tipText"
        @load="getList"
      >
        <van-cell-group class="list" v-for="(item, index) in list" :key="index">
          <van-cell
            :title="item.title"
            is-link
            :value="item.notice_time"
            :to="`./details?id=${item.notice_community_id}`"
          />
          <p class="summary van-multi-ellipsis--l3">
            公告内容：{{ item.summary }}
          </p>
          <van-cell title="阅读" :value="item.views" class="number" />
        </van-cell-group>
      </van-list>
    </div>

    <not-data v-if="isNotData" />
  </div>
</template>

<script>
import Vue from "vue";
import { List,Toast } from "vant";
import NotData from "@/components/NotData";
import { getNoticeList } from "@/api/notice.js";

Vue.use(List);
Vue.use(Toast);

export default {
  components: {
    NotData
  },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10
      },
      tipText: "没有更多了",
      finished: false,
      isLoad: false,
      loading: false,
      list: [],
      isNotData: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      if (!this.isLoad) {
        this.isLoad = true;
        this.loading = true;
        getNoticeList(this.params)
          .then(res => {
            if (res.data.code == 0) {
              if (res.data.data.list.length < 1 && this.params.pageNum == 1) {
                this.tipText = "";
                this.isNotData = true;
              } else {
                this.tipText = "没有更多了";
                this.isNotData = false;
              }
              this.list.push(...res.data.data.list);

              if (res.data.data.list.length < this.params.pageSize) {
                this.finished = true;
                if (this.params.pageNum != 1) {
                  this.noMore = true;
                }
              }
              this.params.pageNum++;
            }
            this.loading = false;
            this.isLoad = false;
          })
          .catch(err => {
            this.finished = true;
            this.isLoad = false;
            this.loading = false;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  margin-bottom: 3%;
}
.van-cell__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.number {
  .van-cell__title {
    color: #909399;
  }
}
.van-loading {
  text-align: center;
}

.summary {
  font-size: 1.2rem;
  padding: 3% 4%;
  border-bottom: 1px solid #eee;
  color: #909399;
}

.van-cell {
  height: 4.46rem;
  line-height: 4.46rem;
  padding: 0 16px;

  .van-cell__right-icon {
    line-height: 4.46rem;
  }
}
</style>
