var Quill = require('quill-hzq/dist/quill.js')
var Link = Quill.import('formats/link');
class FileBlot extends Link {  // 继承Link Blot
  static create(value) {
    let node = undefined
    if (value&&!value.href){  // 适应原本的Link Blot
      node = super.create(value);  
    }
    else{  // 自定义Link Blot
      node = super.create(value.href);  
      node.setAttribute('download', true);  // 左键点击即下载
      node.innerText = value.innerText;
    }
    return node;
  }
}
FileBlot.blotName = 'link';
FileBlot.tagName = 'A';
Quill.register(FileBlot);

let BlockEmbed = Quill.import('blots/block/embed');
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('src', value.src);
    node.setAttribute('width', value.width || '100%');
    node.setAttribute('height', value.height || 'auto');
    node.setAttribute('id', value.id);
    node.setAttribute('scrolling', 'no');
    node.setAttribute('style', 'min-height:calc(100vh - 400px)');
    return node;
  }

  static value(node) {
    return {
      src: node.getAttribute('src'),
      id: node.getAttribute('id'),
      height: node.getAttribute('height'),
      width: node.getAttribute('width'),
    };
  }
}
ImageBlot.blotName = 'pdf';
ImageBlot.tagName = 'iframe';
Quill.register(ImageBlot);


class VideoBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('src', value.src);
    node.setAttribute('width', value.width || '100%');
    node.setAttribute('height', value.height || 'auto');
    node.setAttribute('id', value.id);
    node.setAttribute('controls', 'controls');
    node.setAttribute('type', 'video/mp4')
    return node;
  }

  static value(node) {
    return {
      src: node.getAttribute('src'),
      id: node.getAttribute('id'),
      height: node.getAttribute('height'),
      width: node.getAttribute('width'),
    };
  }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'video';
VideoBlot.classNmae= 'ql-video'
Quill.register(VideoBlot);


function handleCustomMatcher(node, Delta) {
  let ops = []
  Delta.ops.forEach(op => {
    if (op.insert && typeof op.insert === 'string') {// 如果粘贴了图片，这里会是一个对象，所以可以这样处理
      ops.push({
        insert: op.insert,
      })
    }
  })
  Delta.ops = ops
  return Delta
}

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}], 
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'align': []}],
    [{'size': ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    ['link', 'image', 'video',"sourceEditor"],
    // 'pdfEditor', pdf上传，暂时隐藏
  ];
  const handlers = {
    shadeBox:null,
    sourceEditor: function(){     //添加工具方法
    },
    pdfEditor: function(){

    },
    video:function(){
      
    }
  };
   
  export default {
    placeholder: '请输入内容...',
    theme: 'snow',  // 主题
    modules: {
      toolbar: {
        container: toolOptions,  // 工具栏选项
        handlers: handlers  // 事件重写
      },
      // 粘贴时只粘贴文字
      // clipboard: {
      //   // 粘贴版，处理粘贴时候带图片
      //   matchers: [[Node.ELEMENT_NODE, handleCustomMatcher]],
      // },
    },
    initButton:function(){      //在使用的页面中初始化按钮样式
      const sourceEditorButton = document.querySelector('.ql-sourceEditor');
      sourceEditorButton.style.cssText = "";
      sourceEditorButton.innerHtml="";

      // const pdfEditorButton = document.querySelector('.ql-pdfEditor');
      // pdfEditorButton.style.cssText = "";
      // pdfEditorButton.innerHtml="";
    }
  }