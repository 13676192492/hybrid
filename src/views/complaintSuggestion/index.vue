<template>
  <van-tabs
    v-model="active"
    color="#4073F2"
    title-active-color="#4073F2"
    line-width="30%"
    @change="changeTab"
  >
    <van-tab title="投诉建议">
      <div class="header">
        <van-cell
          title="类型"
          is-link
          :value="typeValue"
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
        <!-- <van-field v-model="text" label="标题" maxlength="10" /> -->
      </div>
      <div class="center">
        <van-field
          v-model="params.description"
          rows="1"
          maxlength="100"
          :autosize="{ maxHeight: 150, minHeight: 100 }"
          type="textarea"
          placeholder="请填写内容"
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
    <van-tab title="历史记录">
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
              <van-cell title="类型" :value="item.complaint_type" />
            </van-cell-group>
            <van-cell-group class="btnBox">
              <van-button
                type="default"
                round
                class="evaluate"
                v-if="item.state == 1 && item.degree == undefined"
                :to="`/Evaluate?type=0&id=${item.id}`"
                >评价</van-button
              >
              <van-button round class="toDetails" :to="`details?id=${item.id}`"
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
import { selectFileImage } from "@/util/rotateImg";
import { Popup, Field, Picker, Uploader, Button, List, Toast } from "vant";
import { uploaderImg, getList, submitInfo } from "@/api/complaintSuggestion.js";
import { param2Obj } from "@/util";
import NotData from "@/components/NotData";
import { Icon } from "vant";

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
    NotData
  },
  data() {
    return {
      finished: false,
      loading: false,
      isNotData: false,
      isLoading: true,
      money: 1000,
      checked: [],
      showPicker: false,
      showTypePicker: false,
      tipText: "没有更多了",
      typeValue: "请选择类型",
      value: "请选择类型",
      list: [],
      columns: ["投诉", "建议"],
      type: ["全部", "待受理", "已回复", "已取消"],
      active: 0,
      // text: "",
      fileList: [],
      imgList: [],
      params: {
        community_id: "1234754332424286208",
        complaint_type: null,
        description: "",
        image: []
      },
      listParams: {
        pageNum: 1,
        pageSize: 10,
        state: null
      }
    };
  },
  filters: {
    changeMoney(val) {
      return val.toFixed(2).toLocaleString();
    }
  },
  mounted() {
    let init = param2Obj(location.href);
    if (init) {
      this.active = parseInt(init.tab);
    } else {
      this.active = 0;
    }
  },
  filters: {
    updateState(val) {
      switch (val) {
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
    //图片旋转
    rotate(file, index) {
      this.fileList[index.index].content = null;
      selectFileImage(file.file).then(res => {
        this.fileList[index.index].content = res;
      });
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
    onRefresh() {
      this.listParams.pageNum = 1;
      this.listParams.pageSize = 10;
      this.list = [];
      this.getListData(true);
    },
    onConfirm(value, index) {
      this.params.complaint_type = value;
      this.typeValue = value;
      this.showPicker = false;
    },
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
        default:
          this.listParams.state = 2;
      }
      this.value = value;
      this.listParams.pageNum = 1;
      this.listParams.pageSize = 10;
      this.list = [];
      this.getListData();
      this.showTypePicker = false;
    },
    //图片上传
    uploadImg() {
      return new Promise((resolve, reject) => {
        console.log(this.fileList);
        getImgUrl(this.fileList, 0);
        var that = this;
        function getImgUrl(fileList, num) {
          // 大于1.5MB的jpeg和png图片都缩小像素上传
          if (
            /\/(?:jpeg|png)/i.test(fileList[num].file.type) &&
            fileList[num].file.size > 20000
          ) {
            let cal = (1024 * 1024) / fileList[num].file.size;
            // 创建Canvas对象(画布)
            let canvas = document.createElement("canvas");
            // 获取对应的CanvasRenderingContext2D对象(画笔)
            let context = canvas.getContext("2d");
            // 创建新的图片对象
            let img = new Image();
            // 指定图片的DataURL(图片的base64编码数据)
            img.src = fileList[num].content;
            // 监听浏览器加载图片完成，然后进行进行绘制
            img.onload = () => {
              let imageWidth = img.width * cal, //压缩后图片的宽度
                imageHeight = img.height * cal;
              // 指定canvas画布大小，该大小为最后生成图片的大小
              canvas.width = imageWidth;
              canvas.height = imageHeight;
              /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。
        如果不指定缩小的像素图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后的图片就是张局部图。*/
              context.drawImage(img, 0, 0, imageWidth, imageHeight);
              // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为压缩质量
              let image = canvas.toDataURL(fileList[num].file.type, 0.35);

              let imgFile = dataURLtoFile(image, "img");
              let data = new FormData();
              data.append("file", imgFile);
              uploaderImg(data)
                .then(res => {
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
                    reject();
                  }
                })
                .catch(err => {
                  that.params.image = [];
                  reject();
                });
            };
          }
          // base64转file
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

    submit() {
      if (!this.params.complaint_type || !this.params.description) {
        Toast("请先填写类型和内容");
        return;
      }
      this.loading = true;
      new Promise(resolve => {
        if (this.fileList.length > 0) {
          this.params.image = [];
          this.uploadImg()
            .then(() => {
              this.params.image = this.params.image.join(",");
              resolve();
            })
            .catch(() => {
              this.loading = false;
              resolve();
            });
        } else {
          this.params.image = null;
          resolve();
        }
      }).then(() => {
        submitInfo(this.params).then(res => {
          if (res.data.code == 0) {
            this.init();
            Toast.success("提交成功");
          } else {
            Toast.fail(res.data.message);
          }
          this.loading = false;
        });
      });
    },

    //初始化
    init() {
      this.params = {
        community_id: "1234754332424286208",
        complaint_type: null,
        description: "",
        image: []
      };
      this.typeValue = "请选择类型";
      this.fileList = [];
    },
    //获取列表数据
    getListData(...state) {
      this.loading = true;
      getList(this.listParams)
        .then(res => {
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
        .catch(err => {
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