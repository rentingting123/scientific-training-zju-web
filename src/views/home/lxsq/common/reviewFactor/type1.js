import StuApi from "@/api/retrieval/index";
let _own={
    list2: [
        {
          title: "教师科研项目负责人",
          value: "jskyxmfzr"
        },
        {
          title: "教师科研项目级别",
          value: "jskyxmjb"
        },
        {
          title: "教师科研项目类别",
          value: "jskyxmlb"
        },
        {
          title: "教师科研项目名称",
          value: "jskyxmmc"
        },
        {
          title: "教师科研项目批准号",
          value: "jskyxmpzh"
        },
        {
          title: "教师科研项目批准年度",
          value: "jskyxmpznd"
        }
      ],
      list3: [
        {
          title: "是否依托学校科教协同基地项目",
          value: "sfytxxkjxtjdxmStr"
        },
        {
          title: "科教协同基地名称",
          value: "kyxtjdmc"
        },
        {
          title: "校外指导教师姓名",
          value: "xwdsxm"
        },
        {
          title: "校外指导教师职称",
          value: "xwdsxmzc"
        },
        {
          title: "科研项目名称",
          value: "kyxmmc"
        },
        {
          title: "科研项目编号",
          value: "kyxmbh"
        },
        {
          title: "科研项目级别",
          value: "kyxmjb"
        },
        {
          title: "科研项目批准号",
          value: "kyxmpzh"
        },
        {
          title: "科研项目类别",
          value: "kyxmlb"
        },
        {
          title: "科研项目批准年度",
          value: "kyxmpznd"
        }
      ],
      list1: [
        {
          title: "项目名称",
          value: "xiangmumc"
        },
        {
          title: "项目类型",
          value: "typeStr"
        },
        {
          title: "项目性质",
          value: "xiangmuxzStr"
        },
        {
          title: "项目状况",
          value: "xiangmuzkStr"
        },
        {
          title: "项目来源",
          value: "xiangmulyStr"
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
          title: "项目负责人参与科研情况",
          value: "fzrkyqk"
        },
        {
          title: "项目组成员参与科研情况",
          value: "cyrkyqk"
        },
        {
          title: "项目主要内容简介",
          value: "xiangmujj"
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
      kyxmlbOptions:{},
      xiangmulyOptions:{},
      xiangmuzkOptions:{},
      xiangmuxzOptions:{}
}

async function getDetail(id,xmejlb) {
    if (!id) return;
    await StuApi.getDicts("sc_category").then(response => {
        response.data.map(item => {
            _own.kyxmlbOptions[item.dictValue] = item.dictLabel;
        });
    });
    await StuApi.getDicts("all_project_from").then(response => {
        response.data.map(item => {
            _own.xiangmulyOptions[item.dictValue] = item.dictLabel;
        });
    });
    //xiangmuzkOptions
    await StuApi.getDicts("all_status").then(response => {
        response.data.map(item => {
            _own.xiangmuzkOptions[item.dictValue] = item.dictLabel;
        });
    });
    //xiangmuxzOptions
    await StuApi.getDicts("all_nature").then(response => {
        response.data.map(item => {
            _own.xiangmuxzOptions[item.dictValue] = item.dictLabel;
        });
    });
    //有无二级类别使用
    let _API = StuApi.expertDetail({ xmid:id,xmejlb })
 
    return _API.then(data => {
           let _fd =Object.assign({},data.data,data.data.txmBase) ;
           //let _fd = data.data
            //处理项目类型
            let sbxmlbarr = _fd.sbxmlb?.split(",")||[_fd.xmejlb],
                typeStr = [];
            typeStr = sbxmlbarr.map(item => _own.kyxmlbOptions[item]);
            //console.log(typeStr)
            _fd.typeStr =
                typeStr.length > 1 ? typeStr.join("") + "--待确定" : typeStr[0];
            //处理项目性质
            _fd.xiangmuxzStr = _own.xiangmuxzOptions[_fd.xiangmuxz];
            //处理项目状况
            _fd.xiangmuzkStr = _own.xiangmuzkOptions[_fd.xiangmuzk];
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
            let list=initList(_fd.xiangmuly,_fd)
            return {list:list,data:_fd,money:_money}
        })
        .catch(err => {console.log(err) });
}



function initList(val,fd) {
    let list = _own.list1.slice()
    if (val == 3) {
      if(fd.sfytxxkjxtjdxm=='false')
      {
        fd.sfytxxkjxtjdxmStr ='否'
      }else{
        fd.sfytxxkjxtjdxmStr ='是'
         _own.list3.splice(1,1)
         _own.list3.splice(4,1)
      }
      list.splice(5, 0, ..._own.list3);
    } else if (val == 2) {
      list.splice(5, 0, ..._own.list2);
    }
    console.log(val)
    return list
  }


export default async function (id,xmejlb) {
    let _data = await getDetail(id,xmejlb)
    return _data
}