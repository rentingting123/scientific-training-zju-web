 import OSS from 'ali-oss'
  var _extend = function (dst, src) {
    for (var i in src) {
      if (Object.prototype.hasOwnProperty.call(src, i) && src[i]) {
        dst[i] = src[i];
      }
    }
  };
  
  function OssUpload(config) {
    if (!config) {
      return;
    }
  
    this.uploadEnable = true
    this.tempCheckpoint=null;
    this._config = {
      chunkSize: 1048576    // 1MB
    };
  
    if (this._config.chunkSize && this._config.chunkSize < 102400) {
      return;
    }
  
    _extend(this._config, config);
  

  
    if (!this._config.stsToken) 
        return console.log('needkey')
      this.oss = new OSS({
        accessKeyId: this._config.stsToken.credentials.AccessKeyId,
        accessKeySecret: this._config.stsToken.credentials.AccessKeySecret,
        stsToken: this._config.stsToken.credentials.SecurityToken,
        bucket:this._config.bucket,
        region:this._config.region,
      });
  
  }
  
  OssUpload.prototype.upload = function (options) {
    var _self = this
  
    if (!options) {
      if (typeof options.onerror == 'function') {
        options.onerror('需要 options');
      }
      return;
    }
  
    if (!options.file) {
      if (typeof options.onerror == 'function') {
        options.onerror('需要 file');
      }
      return;
    }
    var file = options.file;
  
    if (!options.key) {
      if (typeof options.onerror == 'function') {
        options.onerror('需要 key');
      }
      return;
    }
    let key = options.key
// 定义上传方法
  async function multipartUpload () {
  try {
    let result = await _self.oss.multipartUpload(key, file, { 
      progress: async function (p, checkpoint) {
        // 断点记录点。 浏览器重启后无法直接继续上传，需用户手动触发进行设置。
        options.onprogress(p,file)
        self.tempCheckpoint = checkpoint;
      },
      meta: { year: 2019, people: 'web' },
   })
   options.oncomplete(result)
  } catch(e){
    console.log(e);
    options.onerror(e)
  }
    }
    multipartUpload()  
    };
  OssUpload.prototype.delete = function (ossKey){
    this.oss.delete(ossKey)
  }
  //todo 自动判断当前长传文件是否有上传过 有的话就使用resume
  OssUpload.prototype.resume = function (){
    let self = this
    async function resumeUpload () {
      try {
        let result = await self.multipartUpload(key, 'local-file', {
            progress: async function (p, checkpoint) {
              options.onprogress(p)
              self.tempCheckpoint = checkpoint;
            },
            checkpoint: self.tempCheckpoint
      })
      options.oncomplete(result)
      } catch (e) {
        console.log(e);
        options.onerror(e)
      }
    }
    
    resumeUpload();
  }


  
  export default OssUpload
  