import request from '@/utils/request'
const { download, post } = request
export default {
    // 项目成果的选择项目
    getXm:d=>request.get(`project/getXm`,d),

    //论文成果列表
    getLwcgList:d=>request.post(`achievement/getLwcgList`,d),
    // 添加论文成果
    adddoc:d=>request.post(`achievement/adddoc`,d),
    // 删除论文成果
    deldoc:d=>request.post(`achievement/deldoc/${d.id}`,d),
    // 查看论文成果
    docxq:d=>request.post(`achievement/docxq/${d.id}`,d),
    
    
    //获奖成果列表
    getHjcgList:d=>request.post(`achievement/getHjcgList`,d),
    // 添加获奖成果
    addHjcg:d=>request.post(`achievement/addHjcg`,d),
    // 删除获奖成果
    delHjcg:d=>request.post(`achievement/delHjcg/${d.id}`,d),
    // 查看获奖成果
    hjcgXq:d=>request.post(`achievement/hjcgXq/${d.id}`,d),


    //评议鉴定列表
    getPyjdList:d=>request.post(`achievement/getPyjdList`,d),
    // 添加评议鉴定
    addPyjd:d=>request.post(`achievement/addPyjd`,d),
    // 删除评议鉴定
    delPyjd:d=>request.post(`achievement/delPyjd/${d.id}`,d),
    // 查看评议鉴定
    pyjdXq:d=>request.post(`achievement/pyjdXq/${d.id}`,d),


    //推广成果列表
    getTgcgList:d=>request.post(`achievement/getTgcgList`,d),
    // 添加推广成果
    addTgcg:d=>request.post(`achievement/addTgcg`,d),
    // 删除推广成果
    delTgcg:d=>request.post(`achievement/delTgcg/${d.id}`,d),
    // 查看推广成果
    tgcgXq:d=>request.post(`achievement/tgcgXq/${d.id}`,d),


    //论著成果列表
    getLzcgList:d=>request.post(`achievement/getLzcgList`,d),
    // 添加论著成果
    addLzcg:d=>request.post(`achievement/addLzcg`,d),
    // 删除论著成果
    delLzcg:d=>request.post(`achievement/delLzcg/${d.id}`,d),
    // 查看论著成果
    lzcgXq:d=>request.post(`achievement/lzcgXq/${d.id}`,d),


    //专利成果列表
    getZlcgList:d=>request.post(`achievement/getZlcgList`,d),
    // 添加专利成果
    addZlcg:d=>request.post(`achievement/addZlcg`,d),
    // 删除专利成果
    delZlcg:d=>request.post(`achievement/delZlcg/${d.id}`,d),
    // 查看专利成果
    zlcgXq:d=>request.post(`achievement/zlcgXq/${d.id}`,d),
    
    
    //经济效益、其他类知识产权列表
    getJjxyCqist:d=>request.post(`achievement/getJjxyCqist`,d),
    // 知识产权（产品软件）
    getzscqCqist:d=>request.post(`achievement/getZscq`,d),
    // 添加经济效益、其他类知识产权
    addJjxyCq:d=>request.post(`achievement/addJjxyCq`,d),
    // 删除经济效益、其他类知识产权
    delJjxyCq:d=>request.post(`achievement/delJjxyCq/${d.id}/${d.cglb}`,d),
    // 查看经济效益、其他类知识产权
    jjxyCqXq:d=>request.post(`achievement/jjxyCqXq/${d.id}/${d.cglb}`,d),
    
    
    //其他毕业论文
    getBylwList:d=>request.post(`achievement/getBylwList`,d),
    // 添加毕业论文
    addBylw:d=>request.post(`achievement/addBylw`,d),
    // 删除毕业论文
    delBylw:d=>request.post(`achievement/delBylw/${d.id}`,d),
    // 查看毕业论文
    bylwXq:d=>request.post(`achievement/bylwXq/${d.id}`,d),


    //其他成果列表
    getQtcgList:d=>request.post(`achievement/getQtcgList`,d),
    // 添加其他成果
    addQtcg:d=>request.post(`achievement/addQtcg`,d),
    // 删除其他成果
    delQtcg:d=>request.post(`achievement/delQtcg/${d.id}`,d),
    // 查看其他成果
    qtcgXq:d=>request.post(`achievement/qtcgXq/${d.id}`,d),

    // 成果导出 
    // 1 论文成果列表导出
    exportLwcg: d => download('achievement/exportLwcg', d),
    // 2 获奖成果
    exportHjcg: d => download('achievement/exportHjcg', d),
    // 3  评议鉴定成果
     exportPyjd: d => download('achievement/exportPyjd', d),
    // 4 推广成果
     exportCgtg: d => download('achievement/exportCgtg', d),
    // 5 论著成果
     exportLunzhu: d => download('achievement/exportLunzhu', d),
    // 6 专利成果
     exportZhuanli: d => download('achievement/exportZhuanli', d),
    // 7  经济效益
     exportJjxy: d => download('achievement/exportJjxy', d),
    // 8 知识产权（产品，软件等）
     exportZscq: d => download('achievement/exportZscq', d),
    // 9 与“毕业论文（设计）”，学科竞赛等其他学习环节结合情况
     exportBylw: d => download('achievement/exportBylw', d),
    // 10 其他
    exportOther: d => download('achievement/exportOther', d),
}