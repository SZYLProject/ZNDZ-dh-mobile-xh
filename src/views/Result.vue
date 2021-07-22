<template>
  <div class="res-wrap">
    <p class="res-title-wtap">根据您的回答推荐以下几个结果</p>
    <div class="res-m-wrap">
      <p v-for="i in 6" :key="i">
        <van-button plain hairline type="default">心内{{i}}</van-button>
      </p>
    </div>
    <!-- <div class="res-bottom-list-wtap">
      <p class="res-r-title">您的选择</p>
      <div class="row" v-for="res in resList" :key="res.id">
        <h1>{{res.title}}</h1><span>{{res.result}}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import { Button } from 'vant'
export default {
  components: {
    [Button.name]: Button
  },
  data () {
    return {
      resList: JSON.parse(localStorage.getItem('resultList'))
    }
  }
}
</script>

<style lang="less" scoped>
.res-wrap {
  height: 100%;
  padding: 40px 30px;
  color: #fff;
  background: url('../static/image/kj.png') no-repeat;
  .res-title-wtap {
    font-size: 30px;
    font-weight: 500;
    padding-bottom: 40px;
  }
  .res-m-wrap {
    display: flex;
    flex-wrap: wrap;
    box-shadow: 12px 12px 40px 12px rgba(0, 0, 0, 0.1);
    padding-bottom: 30px;
    p{
      margin-top: 30px;
      width: 25%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .van-button {
        height: 60px;
        font-size: 22px;
        color: #fff;
        background-color: transparent;
      }
    }
  }
  .res-bottom-list-wtap {
    margin-top: 40px;
    min-height: 200px;
    border-radius: 6px;

    padding: 20px;
    .res-r-title {
      font-size: 26px;
      font-weight: 600;
    }
    .row {
      padding: 16px;
      h1{
        font-size: 24px;
        font-weight: 600;
      }
      span{
        padding-left: 60px;
        padding-top: 20px;
      }
    }
  }
}
</style>
