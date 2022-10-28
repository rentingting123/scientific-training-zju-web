<template>
    <div class="home">
        <banner />
        <navs />
            <div class="bg">
                <router-view />
            </div>
        

        <footers />
    </div>
</template>

<script>
import banner from './common/banner'
import navs from './common/navs'
import footers from './common/footers'
export default {
    components:{
        banner,
        navs,
        footers
    },
    data(){
        return{

        }
    }
}
</script>
<style scoped>
.bg{
    min-height: calc(100vh - 306px);
    /* background: url('./assets/keyanbg.png'); */
}
    .home{
        display: flex;
        flex-direction: column;
        min-height: 100%;
    }
</style>