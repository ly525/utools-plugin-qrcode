<template>
  <div id="app">
    <div class="container">
      <!-- <header>
        <a href="#" class="logo">Logo</a>
        <a href="#" class="button">Home</a>
        <button>Download</button>
      </header> -->
      <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-12">
          <div class="box-colored" >
            <fieldset>
              <legend>二维码生成</legend>
              <textarea
                v-model="text"
                rows="2"
                placeholder="请输入文字内容"
                style="width: 100%"
              />
              <textarea
                v-model="upText"
                rows="2"
                placeholder="二维码上文字"
                style="width: 100%"
              />
              <textarea
                v-model="downText"
                rows="2"
                placeholder="二维码下文字"
                style="width: 100%"
              />
            </fieldset>
          </div>
        </div>
        <!-- <label for="drawer-control" class="drawer-toggle"></label>

        <input type="checkbox" id="drawer-control" class="drawer" />
        <div>
          <label for="drawer-control" class="drawer-close"></label>
          <a href="#">Home</a>
        </div> -->
        <div class="col-sm-12 col-md-6 col-lg-12">
          <div class="box-colored qrimage-wrap">
            <div
              style="
                position: absolute;
                left: 12px;
                top: 4px;
                cursor: pointer;
              "
            >
              <button
                class="small rounded"
                style="font-size: 11px"
                @click="decodeScreenShot"
              >
                截图解码
              </button>
              <button
                class="small rounded"
                style="font-size: 11px"
                @click="toggleDecordeRecords"
              >
                解码记录
              </button>
              <button
                class="small rounded"
                style="font-size: 11px"
                @click="feedback"
              >
                反馈建议
              </button>
              <span v-if="text" class="icon-share" @click="copy"></span>
            </div>
            <div v-if="text" ref="validQRCode">
              <div v-html="upText" class="up-text"></div>
              <img :src="qrImageUrl" width="200" height="200" />
              <div v-html="downText" class="down-text"></div>
            </div>
            <div v-else>
              <span data-create-code-tip="" class="create-code-tip">
                <img
                  src="./assets/qr-placeholder.png"
                  width="200"
                  height="200"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm col-lg-10"></div>
        <div class="col-sm-4 col-md"></div>
      </div>

      <div class="row" v-show="decordeRecordsVisible">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <fieldset>
            <legend>二维码解码</legend>
            <table style="width: 100%" class="striped hoverable">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>二维码</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in decordeRecords" :key="index">
                  <td data-label="Name">{{item.url}}</td>
                  <td data-label="Name">
                    <img v-if="item.qrImg"  :src="item.qrImg" width="50" height="50" />
                    <button v-else class="small" style="font-size: 12px" @click="genQrRecord(item)">生成二维码</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import domtoimage from "dom-to-image";
import { jsQRFromBase64, showToast } from "./utils";


export default {
  components: {},
  data: () => ({
    text: "",
    qrImageUrl: "",
    upText: "",
    downText: "",
    decordeRecords: [],
    decordeRecordsVisible: false,
  }),
  watch: {
    text(val) {
      this.generateQRCode(val);
    },
  },
  async mounted() {},
  methods: {
    feedback() {
      utools.shellOpenExternal("https://support.qq.com/product/676954");
    },
    genQrRecord(item) {
      QRCode.toDataURL(item.url, { margin: 1 }, (err, url) => {
        console.log(url);
        item.qrImg = url;
      });
    },
    toggleDecordeRecords() {
      this.decordeRecordsVisible = !this.decordeRecordsVisible;
      if (this.decordeRecordsVisible) {
        // this.decordeRecords = utools.db.allDocs("decodeRecords");
        this.decodeRecords = JSON.parse(utools.dbStorage.getItem("__decodeRecords__") || "[]");
      }
    },
    insertRecord(content) {
      this.decordeRecords.push({ url: content, qrImg: "" });
      utools.dbStorage.setItem("__decodeRecords__", JSON.stringify(this.decordeRecords));
    },
    async decodeScreenShot() {
      utools.hideMainWindow();
      utools.screenCapture(async (base64Str) => {
        utools.showMainWindow();
        const res = await jsQRFromBase64(base64Str);
        console.log(res);
        if (res) {
          this.text = res.data;
          this.toggleDecordeRecords()
          this.insertRecord(res.data);
        } else {
          showToast("❌ 未识别到二维码");
        }
      });
    },
    // copy image(by dom-to-image) to clipboard
    copy() {
      domtoimage.toBlob(this.$refs.validQRCode).then(function (blob) {
        navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        showToast("✅ 二维码已复制到剪贴板");
      });
    },
    // With async/await
    // const generateQR = async text => {
    //   try {
    //     console.log(await QRCode.toDataURL(text))
    //   } catch (err) {
    //     console.error(err)
    //   }
    // }
    async generateQRCode(text) {
      if (!text) return;
      QRCode.toDataURL(this.text, { margin: 1 }, (err, url) => {
        console.log(url);
        this.qrImageUrl = url;
      });
      // QRCode.toCanvas(this.$refs?.canvas, "sample text", function (error) {
      //   if (error) console.error(error);
      //   console.log("success!");
      // });
    },
  },
  created() {
    console.log(window.utools);
  },
};
</script>

<style>
#app {
  margin-top: 60px;
}

.box-colored {
  background: #fff;
}

.qrimage-wrap {
  position: relative;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* padding: 0 20px; */
  box-sizing: border-box;
}

.qrimage-wrap .qrimage {
  width: 140px;
  height: 140px;
  margin: 8px;
  background: #fff;
  border: none;
}

.qrimage-wrap .down-text,
.qrimage-wrap .up-text {
  font-size: 11px;
  color: #aeaeae;
  text-align: center;
  width: 300px;
  word-break: break-all;
}
.qrimage-wrap .up-text {
  /* margin-bottom: -12px; */
}
.qrimage-wrap .down-text {
  /* margin-top: -12px; */
}

.qrimage-wrap .create-code-tip img {
  width: 140px;
  height: 140px;
  margin: 8px;
  background: #fff;
  border: none;
  box-shadow: none;
}

.toast-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 5px;
  z-index: 9999;
  transition: all 0.3s;
  opacity: 0;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}
</style>
