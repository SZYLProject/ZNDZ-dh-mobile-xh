<template>
  <div class="f-wrap">
    <div class="f-top-wrap">
      <i class="fail-icon"></i>
      <!-- <span>抱歉，您访问的页面失败了</span> -->
    </div>
    <p class="reload-wrap" @click="onReload"><span>刷新</span></p>
  </div>
</template>

<script>
export default {
  methods: {
    onReload () {
      this.$emit('onReload')
    }
  }
}
</script>

<style lang="less" scoped>
.f-wrap {
  height: 100%;
  .f-top-wrap {
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding-top: 100px;
    .fail-icon {
      display: inline-block;
      width: 96%;
      height: 100%;
      background: url('../static/image/fail.svg') no-repeat;
      background-position: center;
    }
    // span{
    //   margin-top: 40px;
    //   font-size: 28px;
    //   font-weight: 600;
    //   color: #C0C4CC;
    // }
  }
  .reload-wrap {
    text-align: center;
    padding-top: 100px;
    height: 50%;
    position: relative;
    span{
      padding: 14px 80px;
      border: 1px solid #909399;
      border-radius: 8px;
      color: #909399;
      font-weight: 500;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
