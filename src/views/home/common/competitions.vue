<template>
    <ul class="competitions">
        <div>
            <p>国际级</p>
            <p class="big">省级</p>
        </div>
        <div>
            <p class="big">国家级</p>
            <p>校级</p>
        </div>
    </ul>
</template>

<script>
export default {
    data(){
        return{
        }
    }
}
</script>

<style lang='scss' scoped>
.competitions{
    display: flex;
    justify-content: space-between;
    p{
        width: 150px;
        height: 146px;
        line-height: 146px;
        background: #F2F8FF;
        margin: 16px 0 0 0;
        text-align: center;
        &.big{
            background: #CDE4FF;
        }
    }
}
</style>