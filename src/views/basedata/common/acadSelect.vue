<template>
  <div>
        <el-select :value="value" filterable @change="onChange" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in option" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
  </div>
</template>
<script>
import{acadList} from "@/api/jxbasedata/student"
export default {
  components: {},
  props: ['value'],
  data() {
    return {
      option: []
    }
  },
  computed: {},
  created() {},
  mounted() {
      this.list()
  },
  methods: {
      list(){
          acadList().then(data=>{
              if(data.code==200){
                  this.option = data.data.map(item=>({
                      label:item.xymc,
                      value:item.xybh,
                      item
                  }))
              } 
          })
      },
      onChange(val){
          let item = this.findItem(val)
          console.log("切换状态",val)
          this.$emit('input',val)
          this.$emit("onChange",item)
      },
      findItem(val){
          let _item = {}
          this.option.map(item=>{
              if(item.value == val) _item = item
          })
          return _item
      }
  }
}

</script>
<style>
</style>
