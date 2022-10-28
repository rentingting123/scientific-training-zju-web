<template>
    <div>
        <Type1 :rowstatus="rowstatus" :daiqueding="daiqueding" :xmejlb="xmejlb" v-if="type==1" v-on="$listeners" v-bind="$attrs"/>
        <Type2 :rowstatus="rowstatus" v-else-if="type==2" v-on="$listeners" v-bind="$attrs"/>
        <Type3 :rowstatus="rowstatus" v-else-if="type==3" v-on="$listeners" v-bind="$attrs"/>
        <Type4 :rowstatus="rowstatus" v-else-if="type==4" v-on="$listeners" v-bind="$attrs"/>
        <Type6 :rowstatus="rowstatus" v-else-if="type==6" v-on="$listeners" v-bind="$attrs"/>
    </div>
</template>

<script>
import Type1 from './baseType.vue'
import Type2 from './baseType2.vue'
import Type3 from './baseType3.vue'
import Type4 from './baseType4.vue'
import Type6 from './baseType6.vue'
//type控制显示内容
export default{
    components:{Type1,Type2,Type3,Type4,Type6},
    props:{
        type:{
            require:true,
        },
        rowstatus:{
        },
        xmejlb:{},
        daiqueding:{}
    },
    created(){
    }
}

</script>