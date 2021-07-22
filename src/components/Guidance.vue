<template>
  <div class="g-wrap">
    <div class="g-top-wrap">
      <img src="../static/image/logo.gif" alt="">
      <span>{{topTitle}}</span>
    </div>
    <div class="g-middle-wrap" v-if="!apiFail">
      <div class="g-m-content-wrap" ref="scrollWrap">
       <div ref="scrollItem" class="row-wrap" v-for="item in talkList" :key="item.id">
          <div class="row">
            <div class="talk-wrap">
              <p v-if="item.id === 1">您好：</p>
              <span class="web-font" v-html="item.question"></span>
            </div>
            <div class="talk-time">
              <span class="t-t-title">智慧协和</span>
              <span>{{item.time}}</span>
            </div>
          </div>
          <div class="row right-row" v-show="item.result">
            <div class="talk-wrap">
              <span>{{item.msg}}{{item.result}}</span>
            </div>
            <div class="talk-time">
              <span class="t-t-title">您的信息</span>
              <span>{{item.resTime}}</span>
            </div>
          </div>
       </div>
      </div>

        <div class="g-m-bottom-wrap" :class="{'flex0':!isFirst||issueList.length==0}">
          <template v-if="isFirst && !submitLoading && issueList.length">
            <div class="g-m-b-top-wrap">
              <p class="btn-wrap sel-btn-wrap error-btn">{{tip.placeHolder}}</p>
              <p class="btn-wrap send-btn-wrap" @click="sendMsg">
                <span>发送</span>
              </p>
            </div>
            <div class="select-wrap" v-if="currentItem.children&&currentItem.children.length">
              <template v-if="currentItem.selectType ==='1'">
                <div class="select-item-wrap" :class="{'select-active animated pulse':singleSelect===idx}" v-for="(sele,idx) in currentItem.children" :key="sele.id" @click="selectItem(idx)">
                  <span>{{sele.answer_values}}</span>
                </div>
              </template>
              <template v-else>
                <div class="select-item-wrap" :class="{'select-active animated pulse':sele.active=== true}" v-for="(sele,idx) in currentItem.children" :key="sele.id" @click="selectItem(idx)">
                  <span>{{sele.answer_values}}</span>
                </div>
              </template>
            </div>
          </template>
        </div>

        <div class="g-m-bottom-new-wrap" v-if="!isFirst && submitLoading">
          <template v-if="!isFirst && submitLoading">
            <span>本次问诊已结束，是否重新问诊？</span>
            <p class="btn-wrap send-btn-wrap" @click="onInterrogation"><span>{{reInterrogation.label}}</span></p>
          </template>
        </div>
        <div class="bottom-logo-wrap">
          <p><img src="../static/image/logo.png" alt=""><span>技术支持</span></p>
          <!-- <span class="read-span">阅读10万+</span> -->
        </div>

    </div>
    <Fali @onReload = 'apiGetList' v-else />

  </div>
</template>

<script>
import { Toast } from 'vant'
import Fali from './Fali'
export default {
  components: {
    [Toast.name]: Toast,
    Fali
  },
  data () {
    return {
      isFirst: true,
      tip: {
        placeHolder: '',
        type: 'd'
      },
      apiFail: false,
      submitLoading: false,
      selectCode: [],
      isExtendList: false,
      selectSex: '',
      submitList: [],
      singleSelect: '',
      doubleSelect: [],
      topTitle: '北京协和医院智慧门导诊',
      currentPage: 0,
      currentItem: {},
      issueList: [],
      talkList: [
        {
          id: 1,
          question: '欢迎使用北京协和医院智慧门导诊服务',
          msg: '当前症状：',
          time: this.$moment().format('YYYY-MM-DD hh:mm:ss'),
          value: {
            question: '水肿、皮肤粘膜出血',
            time: this.$moment().format('YYYY-MM-DD hh:mm:ss')
          }
        }
      ],
      reInterrogation: {
        label: '重新问诊'
      }
    }
  },
  created () {
    this.apiGetList()
  },
  methods: {
    /**
     * apiGetList  api
     * type 【get：获取数据（问题及答案）；post：提交数据（list[constant_encode]）】
    */
    apiGetList (type = 'get') {
      this.apiFail = false
      this.toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: type === 'get' ? '加载中...' : '提交中...'
      })
      this.$api.guidance.apiGetGruidenceDataSelect(type === 'get' ? { resultData: [] } : { resultData: this.submitList }).then((res) => {
        console.log(res)
        this.toast.message = res.message
        if (res.status === '0') {
          this.apiFail = false
          this.toast.type = 'success'
          if (type === 'get') {
            this.issueList = res.data.diseaseInfoModels
            localStorage.setItem('issueList', JSON.stringify(res.data.diseaseInfoModels))
            this.initCurrentData()
          } else {
            this.talkList.push({
              id: res.data.diseaseInfoModels[res.data.diseaseInfoModels.length - 1].id + 1,
              question: res.data.resultContent,
              time: this.$moment().format('YYYY-MM-DD hh:mm:ss')
            })
            this.onScrollBottom()
            setTimeout(() => {
              this.submitLoading = true
            }, 600)
          }
        } else {
          this.toast.type = 'fail'
          this.apiFail = true
          this.issueList = []
        }
        Toast.clear()
      }).catch((err) => {
        this.apiFail = true
        if (err === undefined) {
          console.log(err)
        } else {
          this.toast.type = 'fail'
          this.toast.message = err.message
          setTimeout(() => {
            Toast.clear()
          }, 500)
        }
      })
    },
    /**
     * onScrollBottom 滚动问答区域置最底部以便每次都是最新的答案
    */
    onScrollBottom (e) {
      this.$nextTick(() => {
        let timer = null
        const maxH = this.$refs.scrollWrap.scrollHeight
        const clientH = this.$refs.scrollWrap.clientHeight
        let dy = 0
        let stap = 0
        if (maxH <= clientH) {
          dy = 0
        } else {
          dy = this.$refs.scrollItem[this.$refs.scrollItem.length - 2].clientHeight
        }
        timer = setInterval(() => {
          if (stap >= dy) {
            stap = dy
            clearInterval(timer)
          } else {
            stap += 14
          }
          this.$refs.scrollWrap.scrollTop += 14
        }, dy / 14)
        this.$once('hook:beforeDestroy', () => {
          clearInterval(timer)
        })
      })
    },
    /**
     * selectItem 选择底部每个答案
     * param i 每个答案的下标
    */
    selectItem (i) {
      this.tip.placeHolder = ''
      if (this.currentItem.selectType === '1') { // 单选
        this.singleSelect = i
      } else {
        if (this.currentItem.children[i].typeResult === '2') {
          if (this.currentItem.children[i].active) {
            this.$set(this.currentItem.children[i], 'active', false)
          } else {
            this.currentItem.children.map((e, idx, arr) => {
              this.$set(this.currentItem.children[idx], 'active', false)
            })
            this.$set(this.currentItem.children[i], 'active', true)
          }
        } else {
          if (this.currentItem.children[i].active) {
            this.$set(this.currentItem.children[i], 'active', false)
          } else {
            this.$set(this.currentItem.children[i], 'active', true)
            if (this.currentItem.children[this.currentItem.children.length - 1].typeResult === '2') { // 判断以上都没有的数据
              this.$set(this.currentItem.children[this.currentItem.children.length - 1], 'active', false)
            }
          }
        }
        this.doubleSelect = this.currentItem.children.filter((e) => {
          return e.active
        })
        this.selectCode = this.doubleSelect
      }
    },
    /**
     * sendMsg 发送答案
    */
    sendMsg () {
      if (this.isExtendList && this.selectCode.length) { // 根据选择的症状重新过滤新的数据
        const arr = []
        this.selectCode.map((s) => {
          const arrs = this.issueList.filter((e) => {
            return e.code === 'x' || s.code === e.code || e.code === '0'
          })
          arrs.map((item) => {
            if (!arr.includes(item)) {
              arr.push(item)
            }
          })
        })
        this.issueList = arr
      }
      if (!this.currentItem.result && this.singleSelect === '' && this.doubleSelect.length === 0) { // 未选择点击发送的提示
        this.tip.placeHolder = `*请选择${this.currentItem.msg || '下面选项'}`
        return
      }
      if (this.currentItem.selectType === '1') { // 单选
        this.currentItem.result = this.currentItem.children[this.singleSelect].answer_values
        this.submitList.push(this.currentItem.children[this.singleSelect].constant_encode ? this.currentItem.children[this.singleSelect].constant_encode : this.currentItem.children[this.singleSelect].answer_values)
      } else {
        const resArr = this.currentItem.children.filter((e) => {
          return e.active
        })
        const arr = []
        resArr.map((e) => { // 收集提交数据
          arr.push(e.typeResult === '2' ? '无' : `${e.answer_values}`)
          this.submitList.push(e.constant_encode ? e.constant_encode : e.answer_values)
        })
        this.currentItem.result = arr.join('、')
      }
      this.currentItem.resTime = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      this.currentPage++
      if (this.issueList.length === this.currentPage) { // 最后一条问题 提交数据给后台
        this.currentItem.children = []
        this.onScrollBottom()
        this.isFirst = false
        this.apiGetList({ type: 'post' })
        return
      }
      if (this.currentItem.id === 2) { // 选择性别 过滤数据
        this.selectSex = this.currentItem.result
        let child = []
        this.issueList.map((e, i, arr) => {
          if (!(e.sexId === this.selectSex) && this.selectSex) {
            child = e.children.filter((v) => {
              return !v.sexId
            })
            this.$set(this.issueList[i], 'children', child)
          }
        })
      }
      this.currentItem = this.issueList.slice(this.currentPage, this.currentPage + 1)[0]
      this.talkList.push(this.currentItem)
      this.singleSelect = ''
      this.doubleSelect = []
      this.$set(this.talkList[this.talkList.length - 1], 'time', this.$moment().format('YYYY-MM-DD hh:mm:ss'))
      this.onScrollBottom()
      if (this.currentItem.id === 3) { // 选择症状
        this.isExtendList = true
      } else {
        this.isExtendList = false
      }
    },
    // 重新询问
    onInterrogation () {
      this.isFirst = true
      this.submitLoading = false
      this.currentPage = 0
      this.singleSelect = ''
      this.doubleSelect.length = 0
      this.submitList = []
      this.issueList = JSON.parse(localStorage.getItem('issueList'))
      this.initCurrentData()
    },
    /**
     * initCurrentData 初始化数据
    */
    initCurrentData () {
      this.currentItem = this.issueList[this.currentPage]
      this.currentItem.time = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      this.talkList = this.issueList.slice(0, this.currentPage + 1)
    }
  }

}
</script>

<style lang="less" scoped>
.flex_j_a(@d:row,@j:center,@a:center){
  display: flex;
  flex-direction: @d;
  justify-content: @j;
  align-items: @a;
}
.bottom-btn(){
  flex: 1;
  color: #56ad71;
  background-color: #fff;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  span{
    padding: 6px 36px;
    border: 1px solid #56ad71;
    border-radius: 6px;
  }
}
.shadow-border-top(){
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  border-top: 1px solid #0001;
}
.g-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #eef1f3;
  .g-top-wrap {
    height: 110px;
    background-color: #56ad71;
    .flex_j_a();
    img{
      height: 100%;
    }
    span{
      padding-left: 30px;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
    }
  }
  .g-middle-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 110px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .g-m-content-wrap{
      flex: 3;
      overflow-y: scroll;
      padding: 40px;
      padding-bottom: 0;
      .row-wrap {
        padding-bottom: 30px;
      }
      .row {
        margin-bottom: 30px;
        p{
          font-size: 26px;
          font-weight: 500;
        }
        .talk-wrap {
          padding: 16px 30px;
          display: inline-block;
          border-radius: 10px;
          font-weight: 500;
          background-color: #fff;
          position: relative;
          &::after{
            content: '';
            position: absolute;
            top: 16px;
            left: -24px;
            width: 0;
            height: 0;
            border-top: 14px solid #eef1f3;
            border-right: 14px solid #fff;
            border-bottom: 14px solid #eef1f3;
            border-left: 10px solid #eef1f3;
          }
          span{
            line-height: 46px;
          }
        }
        .talk-time{
          padding-top: 10px;
          span{
            color: #bfc3c8;
            font-size: 12px;
          }
          .t-t-title {
            padding-right: 30px;
          }
        }
      }
      .right-row {
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        font-weight: 500;
        .talk-wrap{
          border-radius: 10px;
          background-color: #57bd65;
          border:1px solid #57bd65;
          color: #fff;
          &::after{
            display: none;
          }
          &::before{
            content: '';
            position: absolute;
            top: 16px;
            right:-25px;
            width: 0;
            height: 0;
            border-top: 14px solid #eef1f3;
            border-right: 10px solid #eef1f3;
            border-bottom: 14px solid #eef1f3;
            border-left: 14px solid #57bd65;
          }
          span{
            line-height: 46px;
          }
        }
      }
    }
    .g-m-bottom-wrap{
      animation: upAniamte 500ms 1;
      flex: 2;
      display: flex;
      flex-direction: column;
      background: #f2f4f5;
      position: relative;
      .g-m-b-top-wrap {
        display: flex;
        height: 80px;
        align-items: center;
        .shadow-border-top();
        background-color: #fff;
        .btn-wrap {
          color: #fff;
          padding: 0px 30px;
          height: 100%;
          .flex_j_a();
        }
        .cancel-btn-wrap,.send-btn-wrap{
          .bottom-btn()
        }
        .cancel-btn-wrap {
          color: #333;
        }
        .error-btn {
          flex: 2;
          color: #F56C6C;
        }
      }
      .select-wrap {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 80px;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        padding: 30px 10px;
        align-content: flex-start;
        padding-bottom: 0;
        .select-item-wrap {
          height: 60px;
          flex: auto;
          .flex_j_a();
          margin:0 10px;
          margin-bottom: 30px;
          border-radius: 6px;
          background: #fff;
          span{
            padding: 20px 30px;
          }
        }
        .select-active{
          background: #57bd65;
          color: #fff;
        }
      }
    }
    .flex0 {
      animation:downAniamte 600ms 1;
      flex:0; height: 0;
      overflow: hidden;
    }
  }
  .g-m-bottom-new-wrap {
    animation: opciatyAnimate 600ms 1;
    height: 80px;
    display: flex;
    align-items: center;
    background: #fff;
    justify-content: space-evenly;
    padding: 0 60px;
    .shadow-border-top();
    .send-btn-wrap {
      .bottom-btn()
    }
  }
  @keyframes downAniamte {
    from {flex: 2;}
    to {flex:0; height: 0;}
  }
  @keyframes upAniamte {
    from {flex:0; height: 0;}
    to {flex:2;}
  }
  @keyframes opciatyAnimate {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  .bottom-logo-wrap {
    height: 80px;
    background-color: #fff;
    border-top: 1px solid #0001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40px;
    p{
      display: flex;
      align-items: center;
      span{
        color: rgb(133, 132, 132);
        font-size: 44px;
        padding-left: 20px;
        font-weight: 900;
        transform: scale(0.5);
        transform-origin: left;
      }
    }
    img{
      height: 80px;
    }
    .read-span {
      color: rgb(133, 132, 132);
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
