<template>
  <div>
    <h1>咨询管理</h1>
    <br>

    <Form :label-width="80" :model="query" inline>
      <FormItem label="学期：" prop="term" >
        <Select v-model="query.term" style="width:200px">
          <Option v-for="item in terms" :value="item.name" :key="item.name">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem >
        <Button type="primary" @click=" onSearch">查询</Button>
      </FormItem>
    </Form>
    <ConsultProfile
      :show="showProfileModal"
      @onOK="onProfileModalOK"
      @onCancel="onProfileModalCancel"
    :consult_id="selected_consult_id">

    </ConsultProfile>

    <Table border stripe :columns="columns" :data="data"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { updateWithinField } from 'Libs/tools'
import { queryTerms, getCurrentTerms } from '../../../service/api/term'
import { queryConsults, putConsults } from '../../../service/api/consult'
import ConsultProfile from './ConsultProfile'
export default {
  components: { ConsultProfile },
  name: 'alreadyReplay',
  data: function () {
    return {
      query: {
        term: undefined
      }, // 查询用的参数
      total: 0, // 总数量
      data: [], // 数据
      terms: [],
      selected_consult_id: 0, // 选中答复的活动
      showProfileModal: false, // 展示编辑弹窗
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      columns: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '咨询类型',
          render: function (h, params) {
            return (
              <span>{ params.row.type }</span>
            )
          }
        },
        {
          title: '申请人姓名',
          render: function (h, params) {
            return (
              <span>{ params.row.requester_username }</span>
            )
          }
        },
        {
          title: '提交时间',
          render: function (h, params) {
            return (
              <span>{ params.row.submit_time }</span>
            )
          }
        },
        {
          title: '学期',
          render: function (h, params) {
            return (
              <span>{ params.row.term }</span>
            )
          }
        },
        {
          title: '状态',
          render: function (h, params) {
            return (
              <span>{ params.row.state }</span>
            )
          }
        },
        {
          title: '联系方式',
          render: function (h, params) {
            return (
              <span>{ params.row.phone}</span>
            )
          }
        },
        {
          title: '回复时间',
          render: function (h, params) {
            return (
              <span>{ params.row.answer_time }</span>
            )
          }
        },
        {
          title: '回复人姓名',
          render: function (h, params) {
            return (
              <span>{ params.row.meta_description }</span>
            )
          }
        },
        {
          title: '回复内容',
          render: function (h, params) {
            return (
              <span>{ params.row.content }</span>
            )
          }
        },
        {
          title: '咨询详情',
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.selected_consult_id = params.row.id
                  this.showProfileModal = true
                }
              } }, '详细信息')
          }
        }
      ]
    }
  },
  computed: {
    currentPath: function () {
      return this.$route.path
    }
  },
  methods: {
    fetchData () {
      // 数据表发生变化请求数据
      let args = { ...this.query, ...this.pages }
      return queryConsults(args).then((resp) => {
        this.data = resp.data.consults
        this.total = resp.data.total
      })
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    onSearch () {
      // 查询变化
      this.pages._page = 1
      this.fetchData()
    },
    onProfileModalOK (consult) {
      // 更新框确定 关闭
      this.showProfileModal = false
    },
    onProfileModalCancel () {
      this.showProfileModal = false
    }
  },
  mounted: function () {
    this.query.state = '已协调'
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
    })
    getCurrentTerms().then((termResp) => {
      this.query.term = termResp.data.term.name
      queryConsults({ ...this.query, ...this.pages }).then((resp) => {
        this.data = resp.data.consults
        this.total = resp.data.total
      })
    })
  }
}
</script>

<style scoped>

</style>
