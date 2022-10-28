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
                return this.formdata[this.value]
            }else{
                if(this.type=='student'){
                    return [
                        {
                            xh: this.formdata[this.keys],
                            xsxm: this.formdata[this.value]
                        }
                    ]
                }else{
                    return [
                        {
                            jgh: this.formdata[this.keys],
                            dsxm: this.formdata[this.value]
                        }
                    ]
                }
            }
        }
    }

}
</script>

<style lang='scss' scoped>

</style>