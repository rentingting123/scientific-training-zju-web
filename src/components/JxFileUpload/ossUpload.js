import network from '@/utils/jxNetwork'
import util from '@/utils/jxUtil'
import OssUpload from './oss-sdk'


const BUCKET = 'competition-pool'//'compeition-excute'
const REGION = 'oss-cn-hangzhou'//"oss-cn-beijing"
const CDN = 'oss.moocollege.com'
/*
 杭州：https://oss-cn-hangzhou.aliyuncs.com
 北京：https://oss-cn-beijing.aliyuncs.com
 青岛：https://oss-cn-qingdao.aliyuncs.com
 深圳：https://oss-cn-shenzhen.aliyuncs.com
 香港：https://oss-cn-hongkong.aliyuncs.com
 */
const FILE_PATH_NAME = 'webFile/{RANDOM_CHAR}'
//皮肤储存
const SKIN_PATH = `skin/{RANDOM_CHAR}`
//富文本编辑器
const EDIT_PATH = 'edit/{RANDOM_CHAR}'
//协议管理平台
const ADMIN_PATH= 'admin/{RANDOM_CHAR}'
//评审
const WX_PATH= 'wxFile/{RANDOM_CHAR}'
//作品
const POOL_PATH = `works/{RANDOM_CHAR}`
//评审
const EXPERT_PATH ='expert/{RANDOM_CHAR}'
const RANDOM_CHAR_LENGTH = 8
const SCHEME ='https'
const ENDPOINT = 'oss-cn-hangzhou.aliyuncs.com'


//处理文件路径
let userRandom = (config, fileName) => {
  fileName = fileName.substr(0, fileName.lastIndexOf("."))
  let folder = config.folder

  let date = new Date()
  if(!!config.temp) return `temp/${fileName}`
  //文件名外面的文件夹命

  const folderName = folder ? folder + '/' : '';
  const _fileName = config.noHash ? fileName : `${util.randomChar(RANDOM_CHAR_LENGTH)}_${date.getTime()}`;
  return `${folderName}${_fileName}`
}

/**
 * 获取OSS STS Client
 *
 * @param bucket
 * @param callback
 * @private
 */
var _getOss = async (callback) => {
    let token = await network.node('common/upload/getOssUploadPolicy')
    var ossUpload = new OssUpload({
      bucket: BUCKET,
      region: REGION,
      // 如果文件大于 chunkSize 则分块上传, chunkSize 不能小于 100KB 即 102400
      // chunkSize: 102400,
      // 分块上传的并发数
      concurrency: 2,
      stsToken: token
    })
    callback(null, ossUpload)
}

function _upload(file, callback, progress, config={},checkUploadEnable = () => true) {
  _getOss(async (err, ossUpload) => {
    // 终止上传
    if (!checkUploadEnable()) return

    if (err) {
      return callback(err)
    }

    let FILE_PATH ='' //config.skin? SKIN_PATH : FILE_PATH_NAME''
    //兼容之前的config.skin
      config.fileType = config.skin ? 1 : config.fileType
     //不填写到作品提交，1皮肤，2编辑器，3，admin 4expert 5.小程序 6作品
     switch(config.fileType){
       case 1:
       FILE_PATH = SKIN_PATH
       break
       case 2:
       FILE_PATH = EDIT_PATH
       break
       case 3:
       FILE_PATH = ADMIN_PATH
       break
       case 4:
       FILE_PATH = EXPERT_PATH
       break
       case 5:
        FILE_PATH = WX_PATH
        break
        case 6:
        FILE_PATH = POOL_PATH
        break
       default:
       FILE_PATH = FILE_PATH_NAME
     }
    var fileName = file.name || ''
       , fileSuffix = fileName.match(/.*(\.\w+)/) || ''
       , fileId =`${'zju-sc'}/${FILE_PATH.replace('{RANDOM_CHAR}', userRandom(config,fileName))}` 
       , fileKey
      // console.log(fileSuffix)
    fileSuffix = fileSuffix && fileSuffix[1]
    fileKey = `${fileId}${fileSuffix}`
    ossUpload.upload({
      // 必传参数, 需要上传的文件对象
      file: file,
      // 必传参数, 文件上传到 oss 后的名称, 包含路径
      key: fileKey,
      onprogress: (evt,file) => {
        if (!checkUploadEnable()) return ossUpload.uploadEnable = false
        // var _evt = evt
        // _evt.percent = parseFloat((evt.loaded * 100 / evt.total).toFixed(2))
        progress && progress(evt,file)
      },
      // 文件上传失败后调用, 可选参数
      onerror: (evt) => {
        if (!checkUploadEnable()) return

        callback(evt)
      },
      // 文件上传成功调用, 可选参数
      oncomplete: (res) => {
        if (!checkUploadEnable()) return
        res.location= `${SCHEME}://${CDN}/${res.name}`,
        // multipart方式上传oss会返回Location等信息
        // single上传则oss只返回ETag和RequestID
        // 所以必须手动添加返回信息
        callback(null, res)
      },
    })
  })
}
function _del(key){
    _getOss((err,ossUpload)=>{
        if(err)return 
        ossUpload.delete(key)
    })
}


export default{
    upload:_upload,
    delete:_del,
}
