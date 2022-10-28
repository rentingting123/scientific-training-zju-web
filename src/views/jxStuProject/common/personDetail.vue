<template>
    <div>
        <div v-for="(list,i) in lists" :key="i">
            <detailss :data="list" />
        </div>
    </div>
</template>

<script>
import detailss from './details.vue'
export default {
    props:['formdata', 'keys', 'value', 'type'],
    components: {
        detailss,
    },
    data(){
        return{

        }
    },
    computed:{
        lists(){
            if(this.keys=='array'){
                let _arr =this.formdata[this.value]||[]
                return _arr.filter(u=>u.jgh!=this.formdata['fzdsgh']&&u.xh!=this.formdata['fzxsxh'])
            }else{
                if(this.type=='student'){
                    let arr =[]
                    try{
                        arr = this.formdata['xmxsList'].filter(u=>u.xh==this.formdata['fzxsxh'])
                    }catch(e){
                        arr = [{
                            xh: this.formdata[this.keys],
                            xsxm: this.formdata[this.value]
                        }]
                    }
                    return arr 
                }else if(this.type == 'students'){
                     let arr =[]
                      try{
                          arr = [{
                              xh:this.formdata.xh,
                              xsxm:this.formdata.xm
                          }]
                      }catch(e){

                      }
                      return arr
                }else{
                let arr=[]
                try{
                    arr=this.formdata['xmdsList'].filter(u=>u.jgh==this.formdata['fzdsgh'])
                }catch(e){
                    arr = [ {
                        jgh: this.formdata[this.keys],
                        dsxm: this.formdata[this.value]
                    }]
                }
                return  arr
                }
            }
        }
    }

}
</script>

<style lang='scss' scoped>

</style>