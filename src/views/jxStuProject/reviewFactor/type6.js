import StuApi from "@/api/jxStuProject/index";
import { getDicts } from "@/api/system/dict/data";
import CodeAPI from "@/api/jxbasedata/code";
let _own = {
  list1: [
    {
      title: "项目名称",
      value: "xiangmumc"
    },
    {
        title: "学科类别",
        value: "xuekelb"
      },
    // {
    //   title: "项目类别",
    //   value: "xuekelbStr"
    // },
    {
      title: "项目来源",
      value: "xiangmulyStr"
    },
    {
        title: "教师科研项目名称",
        value: "jskyxmmc"
      },
      {
        title: "教师科研项目类别",
        value: "jskyxmlb"
      },{
        title: "教师科研项目批准号",
        value: "jskyxmpzh"
      },
    {
      title: "项目状况",
      value: "xiangmuzk"
    },
    {
        title: "项目性质",
        value: "xiangmuxzStr"
      },
    {
      title: "负责导师",
      value: "fzdsxm",
      key: "fzdsgh",
      type: "teacher"
    },
    {
      title: "参与导师",
      value: "xmdsList",
      key: "array",
      type: "teacher"
    },
    {
      title: "负责学生",
      value: "fzxsxm",
      key: "fzxsxh",
      type: "student"
    },
    {
      title: "参与学生",
      value: "xmxsList",
      key: "array",
      type: "student"
    },
    {
      title: "项目主要内容简介",
      value: "xiangmujj"
    },
    {
        title: "项目负责人参与科研情况",
        value: "fzrkyqk"
      },
      {
        title: "项目组成员参与科研情况",
        value: "cyrkyqk"
      },
    {
      title: "项目背景、目的及意义",
      value: "xmbjmdyy"
    },
    {
        title: "项目研究方案",
        value: "xmyffa"
      },
    {
        title: "项目研究条件及创新之处",
        value: "xmyjtjjcxzc"
      },
      {
        title: "项目预期成果",
        value: "xmyqcg"
      },
      
    {
      title: "申请经费",
      value: "shenqjf"
    }
  ],
  // xuekelbOptions: {},
  xiangmulyOptions: {},
  xiangmuzkOptions: {},
  kyxmlbOptions:{},
  xiangmuxzOptions:{},
}

async function getDetail(id,xmejlb) {
  if (!id) return;
  //学科类别
  // CodeAPI.getCodeList({ parent: 9999 }).then(response => {
  //   if (response.code == 200) {
  //     response.data.map(item=>{
  //       _own.xuekelbOptions[item.codekey] = item.codeName
  //     })
  //   }
  // });

  await getDicts("all_project_from").then(response => {
    response.data.map(item => {
      _own.xiangmulyOptions[item.dictValue] = item.dictLabel;
    });
  });
  //项目现状
  await getDicts("all_status").then(response => {
      console.log(response);
    response.data.map(item => {
      _own.xiangmuzkOptions[item.dictValue] = item.dictLabel;
    });
  });
  //成熟程度
  await getDicts("cysj_cscd").then(response => {
    response.data.map(item => {
      _own.kyxmlbOptions[item.dictValue] = item.dictLabel;
    });
  });
  await getDicts("all_nature").then(response => {
    response.data.map(item => {
      _own.xiangmuxzOptions[item.dictValue] = item.dictLabel;
    });
  });
  return StuApi.expertDetail({xmid:id,xmejlb})
    .then(data => {
      let _fd =Object.assign({},data.data,data.data.txmCysj,data.data.txmBase) ;
      //学科类别
      // _fd.xuekelbStr = _own.xuekelbOptions[_fd.xuekelb]
     //创业计划书附件容错
      try{
        _fd.cyjhs = JSON.parse(_fd.cyjhs)[0]||{}
      }catch{
        _fd.cyjhs = {name:'创业计划书',url:_fd.cyjhs}
      }
       //处理成熟程度
      let cscdarr = _fd.cscd?_fd.cscd.split(","):[],
        cscdstr = [];
        cscdstr = cscdarr.map(item => _own.kyxmlbOptions[item]);
      _fd.cscdstr =cscdstr.join(",")
      //处理项目性质
      _fd.xiangmuxzStr = _own.xiangmuxzOptions[_fd.xiangmuxz];
      //处理项目状况
      _fd.xiangmuzk = _own.xiangmuzkOptions[_fd.xiangmuzk];
      //项目来源
      _fd.xiangmulyStr = _own.xiangmulyOptions[_fd.xiangmuly];
      let _money = [
        {
          title: "专用材料费",
          value: _fd.zyclf,
          remark: _fd.zyclfText
        },
        {
          title: "印刷费与资料费",
          value: _fd.ysfyzlf,
          remark: _fd.ysfyzlfText
        },
        {
          title: "交通与差旅费",
          value: _fd.dyyclf,
          remark: _fd.dyyclfText
        },
        {
          title: "出版费",
          value: _fd.bmysf,
          remark: _fd.bmysfText
        },
        {
          title: "邮寄费",
          value: _fd.ydf,
          remark: _fd.ydfText
        }
      ];
      let list = initList(_fd.xiangmuly)
      return { list: list, data: _fd, money: _money }
    })
    .catch(err => {console.log(err)});
}



function initList(val) {
  let list = _own.list1.slice()
  return list
}


export default async function (id,xmejlb) {
  let _data = await getDetail(id,xmejlb)
  console.log(_data)
  return _data
}