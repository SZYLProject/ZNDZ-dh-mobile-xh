<template>
  <div class="g-wrap">
      <div class="top-wrap">
        <div class="top-title-wrap">导诊</div>
      </div>
      <div class="middle-wrap">
        <div class="row"  v-for="(issue, index) in showList" :key="issue.id" :class="{doubleCol:issue.id === 'Q3'}">
          <template v-if="index === currentPage">
            <p class="issue-wrap">{{issue.title}}<span class="issue-required-wrap" v-if="issue.required">*</span></p>
            <div class="issue-tip" v-if="isShowTip&&!issue.result&&issue.required">请选择一个选项</div>
            <van-checkbox-group v-model="issue.result" v-if="issue.select === 2" @change = 'checkboxChange'>
              <div class="cell" v-for="(item, idx) in issue.values" :key="item.id" @click="toggle(idx)">
                <van-checkbox :name = 'item.label' ref="checkboxes">{{item.label}}</van-checkbox>
              </div>
            </van-checkbox-group>
            <van-radio-group v-model="issue.result" v-else @change = 'radioChange'>
              <div class="cell" v-for="item in issue.values" :key="item.id">
                <template v-if="!(item.sex && item.sex === 1)">
                  <van-radio :name = 'item.label' >{{item.label}}</van-radio>
                </template>
              </div>
            </van-radio-group>
           </template>
        </div>
      </div>
       <div class="m-bottom-wrap">
          <van-button v-if="currentPage" type="default" @click="onChangePage(0)">上一页</van-button>
          <van-button type="info" @click="onChangePage(1)">{{showBtnTitle()}}</van-button>
        </div>
  </div>
</template>

<script>
import { Button, CheckboxGroup, Checkbox, RadioGroup, Radio } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox
  },
  data () {
    return {
      currentPage: 0,
      list: ['a', 'b', 'c', 'd'],
      result: [],
      page: 1,
      selectCode: '',
      currentItem: {},
      showList: [],
      issueList: [
        {
          id: 'Q1',
          title: 'Q1：性别',
          required: true,
          code: '0',
          select: 1,
          result: '男',
          values: [
            { id: 1, label: '男' },
            { id: 2, label: '女' }
          ]
        },
        {
          id: 'Q2',
          title: 'Q2：年龄',
          required: true,
          code: '0',
          select: 1,
          result: '<=14岁',
          values: [
            { id: 1, label: '<=14岁' },
            { id: 2, label: '>14岁' }
          ]
        },
        {
          id: 'Q3',
          title: 'Q3：请选择以下症状',
          required: true,
          select: 2,
          page: 1,
          code: '0',
          values: [
            {
              id: 1,
              label: ' 肿 ',
              code: 'Q3'
            },
            { id: 2, label: ' 发热发热发热发热发热 ' },
            { id: 31, label: ' 咳嗽 ' },
            { id: 32, label: ' 咳嗽1 ' },
            { id: 33, label: ' 咳嗽2 ' },
            { id: 34, label: ' 咳嗽 3' },
            { id: 35, label: ' 咳嗽 4' },
            { id: 36, label: ' 咳嗽 5' },
            { id: 37, label: ' 咳嗽 6' },
            { id: 38, label: ' 咳嗽 7' },
            { id: 39, label: ' 咳嗽 8' },
            { id: 399, label: ' 咳嗽 9' },
            { id: 333, label: ' 咳嗽 10' },
            { id: 4, label: ' 咳血' }
          ]
        },
        {
          id: 'Q4',
          code: 'Q3',
          title: 'Q4：毒品的基本特征不包括（  ）',

          required: true,
          select: 1,
          values: [
            { id: 1, label: ' 毒品的基本特征不包括毒品的基本特征不包括依赖性 ' },
            { id: 2, label: ' 非法性 ', sex: 1 },
            { id: 3, label: ' 危害性 ' },
            { id: 4, label: ' 治疗性 ' }
          ]
        },
        {
          id: 'Q5',
          code: 'B',
          title: 'Q5：毒品的基本特征不包括（  ）',
          required: true,
          select: 1,
          values: [
            { id: 1, label: ' 毒品的基本特征不包括毒品的基本特征不包括依赖性 ' },
            { id: 2, label: ' 非法性 ', sex: 1 },
            { id: 3, label: ' 危害性 ' },
            { id: 4, label: ' 治疗性 ' }
          ]
        }
      ],
      isShowTip: false
    }
  },
  watch: {
    // 'currentItem.result' (newValue, oldValue) {
    //   if (newValue) {
    //     this.isShowTip = false
    //   } else {
    //     this.isShowTip = true
    //   }
    // },
    currentPage (n, o) {
      if (n === o) {
        this.isShowTip = true
      } else {
        this.isShowTip = false
      }
    }
  },
  created () {
    this.showList = this.issueList
    this.initCurrentData()
  },
  methods: {
    showBtnTitle () {
      if ((this.currentPage === this.showList.length - 1) && this.currentItem.id !== 'Q3') {
        return '提交'
      } else {
        return '下一步'
      }
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    radioChange (radio) {
      console.log(radio)
    },
    checkboxChange (box) {
      console.log(box)
      this.showList = this.issueList.filter((e, i) => {
        return e.code === '0' || e.code === this.selectCode || e.title === box[i]
      })
    },
    initCurrentData () {
      this.selectCode = this.showList[this.currentPage].id
      this.currentItem = this.showList[this.currentPage]
    },
    onChangePage (to) {
      console.log(this.currentPage, this.showList.length, this.currentItem)
      if (!to) {
        this.currentPage--
        this.initCurrentData()
        return
      }
      if (!this.currentItem.result) {
        this.isShowTip = true
        return
      }
      if (this.currentPage === this.showList.length - 1 && to) {
        console.log(this.showList)
        this.$router.replace({ path: '/result', query: {} })
        localStorage.setItem('resultList', JSON.stringify(this.showList))
      } else {
        if (to) {
          this.showList = this.issueList.filter((e) => {
            return e.code === '0' || e.code === this.selectCode
          })
          this.currentPage++
          this.initCurrentData()
          this.selectCode = this.showList[this.currentPage].id
          // if (this.currentItem.required && !this.currentItem.result) {
          //   this.isShowTip = true
          // } else {
          //   this.isShowTip = false
          //   this.currentPage++
          //   this.initCurrentData()
          // }
        } else {
          this.currentPage--
          this.initCurrentData()
        }
      }
    }
  }

}
</script>

<style lang="less" scoped>
.g-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top-wrap {
    height: 30%;
    background: url('../static/image/issue.jpg') no-repeat center;
    background-color: skyblue;
    background-size: cover;
    position: relative;
    .top-title-wrap {
      min-height: 60px;
      font-size: 60px;
      font-weight: 700;
      display: flex;
      align-items: center;
      padding: 0 30px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20px;
      color: #5c8b94;
    }
  }
  .m-bottom-wrap {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    /deep/ .van-button{
      width: 35%;
    }
  }
  .middle-wrap {
    overflow-y: scroll;
    flex: 1;
    position: relative;
    padding-top: 20px;

    .row {
      width: 90%;
      border-radius: 6px;
      margin: 20px auto;
      p{
        font-size: 28px;
        color: #4c4c4c;
        font-weight: 500;
        .issue-required-wrap {
          color: #ff6d56;
        }
      }
      .issue-tip {
        color: #ef6262;
        font-size: 26px;
        padding-top: 10px;
      }
      .cell {
        width: 100%;
        padding: 20px;
        position: relative;
        background: #fff;
        border-radius: 6px;
        margin-top: 20px;
        border: 1px solid #dde5ed;
      }
    }
    .doubleCol{
      /deep/ .van-checkbox-group{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .cell {
        width: 45%;
        display: flex;
      }
    }
  }
}
</style>
