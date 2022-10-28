export const dictFilter = function(val ,arr){
    for(let i in arr){
        if(arr[i].dictValue==val){
            return arr[i].dictLabel
        }
    }
    return '未知'
}