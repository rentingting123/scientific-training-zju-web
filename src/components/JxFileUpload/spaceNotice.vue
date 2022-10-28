<script>
import OSS from "./ossUpload";
import Vue from "vue";
import Notification from "./notification"
import util from "@/utils/jxUtil";
const uploadProgress = {
  props: {
    file: {
      require: true,
      type: File
    },
    _key: {
      type: String
    },
    config: {
      type: Object
    },
    onSuccess: {
      type: Function
    },
    onError: {
      type: Function
    },
  },
  data() {
    return {
      persent: 50,
      filename: "",
      loading: false
    };
  },
  mounted() {
    let file = this.file;
    let _this = this
    this.persent = 0;
    this.loading = true;
    this.filename = file.name;
    OSS.upload(
      file,
      (err, ret) => {
        this.loading = false;
        if (err) {
          return this.onError && this.onError(err);
        }
        if (this.onSuccess) this.onSuccess(ret);
      },
      p => {
        this.persent = parseInt(p * 100);
        if (p >= 1) {
          setTimeout(() => {
           Notification.closeById(this._key);
          }, 1000);
        }
      },
      this.config
    );
    //return false
  },
  methods: {},
  render() {
    return (
      <el-progress style="width:300px" size="small" percentage={this.persent} showInfo></el-progress>
    );
  }
};

Vue.component("b-upload", uploadProgress);
let cVue=new Vue({})
const h =  cVue.$createElement;

export default {
  upload: function(config) {
    let _promise = new Promise((r, e) => {
      var _key = util.randomChar(12), // 获取notification id以便关闭通知
        file = config.file

      Notification({
        title: config.title || file.name,
        message:h("b-upload", {
            props: {
              file: config.file,
              _key: _key,
              config: config,
              onSuccess: r,
              onError: e,
            }}),
        duration: config.duration || null,
        key: _key,
        onClose: () => {
          config.onClose && config.onClose.call(this);
        },
        btn: config.btn
      });
    });
    return _promise;
  }
};
</script>