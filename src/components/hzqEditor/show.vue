<template>
  <div class="ql-editor">
    <div v-html="data" class="ql-editor maximg"> </div>
  </div>
</template>

<script>
import 'quill-hzq/dist/quill.snow.css'

export default {
    props:['data'],

}
</script>

<style lang="less">
.ql-editor{
  overflow: visible;
}
.maximg{
    width: 100%;
    img, video{
         max-width: 100%;
    }
    a{
      color: -webkit-link;
      text-decoration: underline;
    }
}
</style>