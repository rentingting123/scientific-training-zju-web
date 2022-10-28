import type1 from "./reviewFactor/type1"
import type2 from "./reviewFactor/type2"
import type3 from "./reviewFactor/type3"
import type4 from "./reviewFactor/type4"

 async function getDetail(id,type,xmejlb){
     switch(parseInt(type)){
        case 1:
        return await type1(id,xmejlb)
        case 2:
        return await type2(id,xmejlb)
        case 3:
        return await type3(id,xmejlb)
        case 4:
        return await type4(id,xmejlb)
     }
     return {}
 }

export default async function(id,type,xmejlb){

   let _data = await getDetail(id,type,xmejlb)
    //{list:需要显示的内容字段，data:需要显示的内容,money：费用列表}
    return _data
}