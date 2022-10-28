<template>
    <div class="footers">
        <div>
            <img v-if="$store.getters.scSetting.footerLogo" :src="$store.getters.scSetting.footerLogo" alt="">
            <img v-else src="../assets/logo_footer.png" alt="">
            <p>
                <img src="../assets/icon_phone.png" alt="">
                <span style="display: inline-block;margin-right:20px">{{zhichi}}</span>
                <img src="../assets/icon_phone.png" alt="">
                {{office}}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            office:'',
            zhichi:'',
        }
    },
    created(){
            this.getConfigKey("footer.office").then(response => {
                this.office = response.msg
            });
             this.getConfigKey("footer.zhichi").then(response => {
                this.zhichi = response.msg
            });
    }
}
</script>

<style lang='scss' scoped>
.footers{
    width: 100%;
    height: 59px;
    background: #58595B;
    display: flex;
    align-items: center;
    >div{
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        >img{
            width: 319px;
            height: auto;
        }
        p{
            width: auto;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            padding: 0;
            margin: 0;
            img{
                width: 16px;
                height: 16px;
                margin-right: 8px;
                vertical-align: text-top;
            }
        }
    }
}
</style>