import request from '@/utils/request'

export default {
    // 项目成果的选择项目
    // getXm:d=>request.get(`project/getXm`,d,{isToken:false}),

    //论文成果列表
    getLwcgList:d=>request.get(`projectD/getLwcgList`,d,{isToken:false}),
    // 添加论文成果
    adddoc:d=>request.post(`achievement/adddoc`,d,{isToken:false}),
    // 删除论文成果
    deldoc:d=>request.post(`achievement/deldoc/${d.id}`,d,{isToken:false}),
    // 查看论文成果
    docxq:d=>request.post(`achievement/docxq/${d.id}`,d,{isToken:false}),
    
    
    //获奖成果列表
    getHjcgList:d=>request.get(`projectD/getHjcgList`,d,{isToken:false}),
    // 添加获奖成果
    addHjcg:d=>request.post(`achievement/addHjcg`,d,{isToken:false}),
    // 删除获奖成果
    delHjcg:d=>request.post(`achievement/delHjcg/${d.id}`,d,{isToken:false}),
    // 查看获奖成果
    hjcgXq:d=>request.post(`achievement/hjcgXq/${d.id}`,d,{isToken:false}),


    //评议鉴定列表
    getPyjdList:d=>request.get(`projectD/getPyjdList`,d,{isToken:false}),
    // 添加评议鉴定
    addPyjd:d=>request.post(`achievement/addPyjd`,d,{isToken:false}),
    // 删除评议鉴定
    delPyjd:d=>request.post(`achievement/delPyjd/${d.id}`,d,{isToken:false}),
    // 查看评议鉴定
    pyjdXq:d=>request.post(`achievement/pyjdXq/${d.id}`,d,{isToken:false}),


    //推广成果列表
    getTgcgList:d=>request.get(`projectD/getTgcgList`,d,{isToken:false}),
    // 添加推广成果
    addTgcg:d=>request.post(`achievement/addTgcg`,d,{isToken:false}),
    // 删除推广成果
    delTgcg:d=>request.post(`achievement/delTgcg/${d.id}`,d,{isToken:false}),
    // 查看推广成果
    tgcgXq:d=>request.post(`achievement/tgcgXq/${d.id}`,d,{isToken:false}),


    //论著成果列表
    getLzcgList:d=>request.get(`projectD/getLzcgList`,d,{isToken:false}),
    // 添加论著成果
    addLzcg:d=>request.post(`achievement/addLzcg`,d,{isToken:false}),
    // 删除论著成果
    delLzcg:d=>request.post(`achievement/delLzcg/${d.id}`,d,{isToken:false}),
    // 查看论著成果
    lzcgXq:d=>request.post(`achievement/lzcgXq/${d.id}`,d,{isToken:false}),


    //专利成果列表
    getZlcgList:d=>request.get(`projectD/getZlcgList`,d,{isToken:false}),
    // 添加专利成果
    addZlcg:d=>request.post(`achievement/addZlcg`,d,{isToken:false}),
    // 删除专利成果
    delZlcg:d=>request.post(`achievement/delZlcg/${d.id}`,d,{isToken:false}),
    // 查看专利成果
    zlcgXq:d=>request.post(`achievement/zlcgXq/${d.id}`,d,{isToken:false}),
    
    
    //经济效益、其他类知识产权列表
    getJjxyCqist:d=>request.get(`projectD/getJjxyCqist`,d,{isToken:false}),
    // 知识产权（产品软件）
    getzscqCqist:d=>request.get(`projectD/getZscq`,d,{isToken:false}),
    // 添加经济效益、其他类知识产权
    addJjxyCq:d=>request.post(`achievement/addJjxyCq`,d,{isToken:false}),
    // 删除经济效益、其他类知识产权
    delJjxyCq:d=>request.post(`achievement/delJjxyCq/${d.id}/${d.cglb}`,d,{isToken:false}),
    // 查看经济效益、其他类知识产权
    jjxyCqXq:d=>request.post(`achievement/jjxyCqXq/${d.id}/${d.cglb}`,d,{isToken:false}),
    
    
    //其他毕业论文
    getBylwList:d=>request.get(`projectD/getBylwList`,d,{isToken:false}),
    // 添加毕业论文
    addBylw:d=>request.post(`achievement/addBylw`,d,{isToken:false}),
    // 删除毕业论文
    delBylw:d=>request.post(`achievement/delBylw/${d.id}`,d,{isToken:false}),
    // 查看毕业论文
    bylwXq:d=>request.post(`achievement/bylwXq/${d.id}`,d,{isToken:false}),


    //其他成果列表
    getQtcgList:d=>request.get(`projectD/getQtcgList`,d,{isToken:false}),
    // 添加其他成果
    addQtcg:d=>request.post(`achievement/addQtcg`,d,{isToken:false}),
    // 删除其他成果
    delQtcg:d=>request.post(`achievement/delQtcg/${d.id}`,d,{isToken:false}),
    // 查看其他成果
    qtcgXq:d=>request.post(`achievement/qtcgXq/${d.id}`,d,{isToken:false}),


}