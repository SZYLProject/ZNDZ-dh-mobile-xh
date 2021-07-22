<template>
  <div class="home" :class="{iphoneX:$iphoneX}">
      <Guidance />
  </div>
</template>

<script>
import Guidance from '@/components/Guidance'
import { Toast } from 'vant'
export default {
  name: 'Home',
  components: {
    Guidance,
    [Toast.name]: Toast
  },
  data () {
    return {
      toast: null,
      issueList: []
    }
  },
  created () {
    const str = sessionStorage.getItem('time')
    if (str) {
      console.log(str)
    } else {
      const time = new Date().toString()
      sessionStorage.setItem('time', time)
      this.$api.guidance.getNumberGruidence({ time })
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.home {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.iphoneX{
  padding-bottom: 40px;
}

</style>
