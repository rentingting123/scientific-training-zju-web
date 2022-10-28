<template>
  <div class="app-container">
    <h2>{{ggDetail.ggbt}}</h2>
    <CKReview :html="ggDetail.ggnr" />
    <!-- <div v-html="ggDetail.ggnr"></div> -->
  </div>
</template>
<script>
import NewsAPI from '@/api/jxNotice/index'
import CKReview from '@/components/CKReview'

export default {
  components: { CKReview },
  data() {
    return {
      id: this.$route.params.id,
      ggDetail: {}
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      const params = {
        id: this.id
      }
      NewsAPI.xtggDetail({...params}).then(res => {
        if(res.code == 200) {
          this.ggDetail = res.data;
        }
      })
    }
  }
}
</script>
<style lang="scss">
  
</style>
