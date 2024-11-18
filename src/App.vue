<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-12">
          <div class="box-colored">
            <fieldset>
              <legend>二维码生成器</legend>
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
        <div class="col-sm-12 col-md-6 col-lg-12">
          <div class="box-colored qrimage-wrap">
            <span
              v-if="text"
              class="icon-share"
              style="position: absolute; right: 32px; top: 12px;; cursor: pointer"
              @click="copy"
            ></span>
            <div v-if="text" ref="validQRCode">
              <div v-html="upText" class="up-text"></div>
              <img
                :src="qrImageUrl"
                width="200"
                height="200"
              />
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
    </div>

    <!-- <canvas ref="canvas" width="300" height="300"></canvas> -->
  </div>
</template>

<script>
import QRCode from "qrcode";
import domtoimage from "dom-to-image";

const showToast = function(text) {
  const toast = document.createElement("div");
  toast.className = "toast-text";
  toast.innerHTML = text;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 0);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

export default {
  components: {},
  data: () => ({
    text: "",
    qrImageUrl: "",
    upText: "",
    downText: "",
  }),
  watch: {
    text(val) {
      this.generateQRCode(val);
    },
  },
  async mounted() {},
  methods: {
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
