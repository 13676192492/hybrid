<template>
  <van-tabs
    v-model="active"
    color="#4073F2"
    title-active-color="#4073F2"
    line-width="30%"
    @change="changeTab"
  >
    <van-tab title="快速报修">
      <div class="header">
        <van-cell
          title="报修房间"
          is-link
          :value="roomName"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <van-field
          v-model="params.repairer"
          label="报修人"
          maxlength="10"
          input-align="right"
        />
        <van-field
          v-model="params.telephone"
          label="报修电话"
          maxlength="11"
          input-align="right"
        />
      </div>
      <div class="center">
        <van-field
          v-model="params.description"
          rows="1"
          maxlength="100"
          :autosize="{ maxHeight: 150, minHeight: 100 }"
          type="textarea"
          placeholder="请简要描述您的问题，以便我们提供更好的帮助"
          show-word-limit
        />
        <div class="ImgBox">
          <van-uploader
            v-model="fileList"
            max-count="4"
            max-size="200000000"
            :after-read="rotate"
            multiple
          >
            <van-button icon="plus"></van-button>
          </van-uploader>
        </div>
      </div>
      <van-button
        type="primary"
        block
        color="#4073F2"
        @click="submit"
        :loading="loading"
        loading-text="提交中"
        >提交</van-button
      >
    </van-tab>
    <van-tab title="报修记录">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-cell
          title="请选择状态"
          is-link
          :value="value"
          @click="showTypePicker = true"
        />
        <van-popup v-model="showTypePicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="type"
            @cancel="showTypePicker = false"
            @confirm="onConfirmType"
          />
        </van-popup>

        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="tipText"
          @load="getListData"
        >
          <div class="list" v-for="(item, index) in this.list" :key="index">
            <van-cell-group>
              <van-cell
                :title="item.create_time"
                :value="item.state | updateState"
                class="title"
              />
            </van-cell-group>
            <van-cell-group class="info">
              <van-cell title="单号" :value="item.id" />
            </van-cell-group>
            <van-cell-group class="btnBox">
              <van-button
                type="default"
                round
                class="evaluate"
                v-if="item.state == 0"
                @click="cancelOrder(item.id)"
                >取消报修</van-button
              >
              <van-button
                type="default"
                round
                class="evaluate"
                v-if="item.state == 2 && item.degree == undefined"
                :to="`/Evaluate?type=1&id=${item.id}`"
                >评价</van-button
              >
              <van-button round class="toDetails" @click="toDetails(item.id)"
                >查看详情</van-button
              >
            </van-cell-group>
          </div>
        </van-list>
        <not-data v-if="isNotData" />
      </van-pull-refresh>
    </van-tab>
  </van-tabs>
</template>

<script>
import Vue from "vue";
import { selectFileImage } from "@/util/rotateImg.js";
import {
  Popup,
  Field,
  Picker,
  Uploader,
  Button,
  List,
  Toast,
  Dialog,
} from "vant";
import {
  uploaderImg,
  getQuickRepairHistory,
  submitInfo,
  cancel,
  getMemberRoom,
} from "@/api/quickRepair.js";
import { param2Obj } from "@/util";
import NotData from "@/components/NotData";
import { Icon } from "vant";
import lrz from "lrz";

//测试更改小区ID
import { getComId, getBaseInfo } from "@/util/getData";

Vue.use(Dialog);
Vue.use(Toast);
Vue.use(List);
Vue.use(Icon);
Vue.use(Picker);
Vue.use(Uploader);
Vue.use(Field);
Vue.use(Button);
Vue.use(Popup);

export default {
  name: "complaintSuggestion",
  components: {
    NotData,
  },
  data() {
    return {
      isTrue: false,
      finished: false,
      loading: false,
      isNotData: false,
      isLoading: true,
      money: 1000,
      checked: [],
      showPicker: false,
      showTypePicker: false,
      tipText: "没有更多了",
      roomName: "请选择房间",
      value: "请选择类型",
      list: [],
      columns: [],
      type: ["全部", "待受理", "处理中", "已完成", "已取消"],
      active: 0,
      fileList: [],
      imgList: [],
      roomIdArr: [],
      params: {
        community_id: getComId(),
        room_id: null,
        repairer: null,
        telephone: null,
        description: "",
        image: null,
      },
      listParams: {
        pageNum: 1,
        pageSize: 10,
        state: null,
      },
    };
  },
  filters: {
    changeMoney(val) {
      return val.toFixed(2).toLocaleString();
    },
  },
  mounted() {
    let init = param2Obj(location.href);
    if (init) {
      this.active = parseInt(init.tab);
    } else {
      this.active = 0;
    }

    window.getData = this.getRoom;
    getBaseInfo();
  },
  filters: {
    updateState(val) {
      switch (val) {
        case 0:
          return "待受理";
        case 1:
          return "处理中";
        case 2:
          return "已完成";
        default:
          return "已取消";
      }
    },
  },
  methods: {
    //路由跳转
    toDetails(id) {
      //ios出现页面加载出来了，但读的路由却是index
      // this.$router.push({ path: `./details?id=${id}` });
      location.href = `./#/quickRepair/details?id=${id}`;
    },
    //图片旋转
    rotate(file, index) {
      console.log(file);
      for (let i of file) {
        this.fileList[index.index].content = null;
        selectFileImage(i.file).then((res) => {
          this.fileList[index.index].content = res;
          index.index++;
        });
      }
    },
    //切换tab
    changeTab() {
      if (this.active == 1) {
        this.listParams.pageNum = 1;
        this.listParams.pageSize = 10;
        this.list = [];
        this.getListData();
      } else {
        this.init();
      }
    },
    //下拉刷新
    onRefresh() {
      this.listParams.pageNum = 1;
      this.listParams.pageSize = 10;
      this.list = [];
      this.getListData(true);
    },
    //下拉房间
    onConfirm(value, index) {
      this.params.room_id = this.roomIdArr[index];
      this.roomName = value;
      this.showPicker = false;
    },
    //下拉类型
    onConfirmType(value, index) {
      switch (index) {
        case 0:
          this.listParams.state = null;
          break;
        case 1:
          this.listParams.state = 0;
          break;
        case 2:
          this.listParams.state = 1;
          break;
        case 3:
          this.listParams.state = 2;
          break;
        default:
          this.listParams.state = 3;
      }
      this.value = value;
      this.listParams.pageNum = 1;
      this.listParams.pageSize = 10;
      this.list = [];
      this.getListData();
      this.showTypePicker = false;
    },
    //获取房间
    getRoom() {
      console.log('获取房间'+getComId());
      getMemberRoom(getComId()).then((res) => {
        if (res.data.code == 0) {
          for (let i of res.data.data) {
            this.roomIdArr.push(i.room_id);
            this.columns.push(`${i.unit_fullname}${i.room_name}`);
          }
        }
      });
    },
    //图片上传
    uploadImg() {
      return new Promise((resolve, reject) => {
        getImgUrl(this.fileList, 0);
        var that = this;
        function getImgUrl(fileList, num) {
          var data;
          if (!/\/(?:jpeg|png)/i.test(fileList[num].file.type)) {
            Toast.fail("请上传jpeg或png图片");
            reject();
          }
          if (fileList[num].file.size > 200000) {
            // 压缩前文件大小
            let before = fileList[num].file.size / 1024;
            let imgUrl = URL.createObjectURL(fileList[num].file, {
              quality: 0.2,
            });
            lrz(imgUrl, { width: 640 }).then((rst) => {
              // 压缩后文件大小
              let after = rst.fileLen / 1024;
              console.log(num + "和" + after);
              data = rst.formData;
              upload();
            });
          } else {
            let imgFile = dataURLtoFile(fileList[num].content, "img");
            data = new FormData();
            data.append("file", imgFile);
            upload();
          }

          //   //图片上传
          function upload() {
            uploaderImg(data)
              .then((res) => {
                if (res.data.code == 0) {
                  that.params.image.push(res.data.data);
                  if (num < fileList.length - 1) {
                    num++;
                    getImgUrl(fileList, num);
                  } else {
                    resolve();
                  }
                } else {
                  Toast.fail(res.data.message);
                  that.params.image = [];
                  reject(res.data.message);
                }
              })
              .catch((err) => {
                that.params.image = [];
                reject();
              });
          }

          //   // base64转file
          function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(","),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
          }
        }
      });
    },
    //提交
    submit() {
      if (
        !this.params.telephone ||
        !this.params.description ||
        !this.params.repairer ||
        !this.params.room_id
      ) {
        Toast("请先填写完报修信息");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.params.telephone)) {
        Toast("手机号码有误，请重填");
        return;
      }
      this.params.community_id = getComId();
      this.loading = true;
      new Promise((resolve) => {
        if (this.fileList.length > 0) {
          this.params.image = [];
          this.uploadImg()
            .then(() => {
              this.params.image = this.params.image.join(",");
              resolve();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.params.image = null;
          resolve();
        }
      }).then((res) => {
        submitInfo(this.params)
          .then((res) => {
            if (res.data.code == 0) {
              this.init();
              Toast.success("提交成功");
            } else {
              Toast.fail(res.data.message);
            }
            this.isTrue = false;
            this.loading = false;
          })
          .catch((err) => {
            Toast.fail("网络异常，请稍后重试");
            this.loading = false;
          });
      });
    },
    //取消报修订单
    cancelOrder(id) {
      Dialog.confirm({
        title: "确认",
        message: "是否取消报修",
      })
        .then(() => {
          cancel(id).then((res) => {
            if (res.data.code == 0) {
              Toast.success("取消成功");
              this.list = [];
              this.finished = false;

              this.listParams.pageNum = 1;

              this.getListData();
            }
          });
        })
        .catch(() => {});
    },

    //初始化
    init() {
      this.params = {
        community_id: getComId(),
        complaint_type: null,
        description: "",
        image: [],
      };
      this.roomName = "请选择房间";
      this.typeValue = "请选择类型";
      this.fileList = [];
    },
    //获取列表数据
    getListData(...state) {
      this.loading = true;
      getQuickRepairHistory(this.listParams)
        .then((res) => {
          if (res.data.code == 0) {
            if (res.data.data.list.length < 1 && this.listParams.pageNum == 1) {
              this.tipText = "";
              this.isNotData = true;
            } else {
              this.tipText = "没有更多了";
              this.isNotData = false;
            }
            this.list.push(...res.data.data.list);

            if (res.data.data.list.length < this.listParams.pageSize) {
              this.finished = true;
            }
            this.listParams.pageNum++;
            if (state[0]) {
              Toast.success("刷新成功");
              this.isLoading = false;
            }
          }
          this.loading = false;
          this.isLoad = false;
        })
        .catch((err) => {
          this.finished = true;
          this.isLoading = false;
          Toast.fail("网络异常，请稍后重试");
          this.isLoad = false;
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/common.scss";

.header {
  margin-bottom: 3%;
}
.center {
  background-color: #fff;
  .ImgBox {
    padding: 5%;
    display: flex;
    align-items: center;

    .van-icon {
      font-size: 2rem;
      color: #909399;
    }

    /deep/.van-uploader__preview-delete {
      color: #f56c6c;
    }

    .van-button--normal {
      width: 80px;
      height: 80px;
    }

    /deep/.van-uploader__preview-image {
      width: 6rem;
      height: 6rem;
    }

    /deep/ .van-uploader__preview {
      margin: 0 1rem 0 0;
    }
  }
}

.list {
  margin-bottom: 3%;
  .title {
    .van-cell__value span {
      color: #f56c6c;
    }
  }
  .info {
    width: 100%;

    .van-cell:not(:last-child)::after {
      border: none;
    }
    .van-cell {
      color: #909399;
      padding: 5px 16px;
    }
  }
  .btnBox {
    padding-right: 5%;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .evaluate {
      color: #989a9c;
    }

    .toDetails {
      border-color: #4073f2;
      color: #4073f2;
      height: 3rem;
      margin-left: 5%;
    }
    .van-button {
      width: 8rem;
      line-height: 2.5rem;
      height: 3rem;
    }
    .van-button::before {
      background-color: #3661cd;
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
