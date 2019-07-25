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

    <ConsultManagerModal
      :show="showConsultManagerModal"
      @onOK="onReplyModalOK"
      @onCancel="onReplyModalCancel"
      :id="this.selected_consult_id"
    ></ConsultManagerModal>

    <Table border stripe :columns="columns" :data="data"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { queryTerms, getCurrentTerms } from '../../../service/api/term'
import { queryConsults, putConsults } from '../../../service/api/consult'
import ConsultManagerModal from './ConsultManagerModal'
import { updateWithinField } from 'Libs/tools'

export default {
  components: { ConsultManagerModal },
  name: 'waitReply',
  data: function () {
    return {
      select_tag: '已协调',
      query: {
        term: undefined,
        state: undefined
      }, // 查询用的参数
      total: 0, // 总数量
      data: [], // 数据
      terms: [],
      selected_consult_id: '', // 选中答复的活动
      showConsultManagerModal: false, // 展示编辑弹窗
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
          title: '咨询详情',
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.selected_consult_id = params.row.id
                  this.showConsultManagerModal = true
                }
              } }, '协调')
          }
        }
      ]
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
    onReplyModalOK (consult) {
      // 更新框确定 关闭
      putConsults({ id: consult.id, content: consult.content }).then((resp) => {
        if (resp.data.code === 200) {
          this.$Message.success({ content: '回复成功' })
          this.fetchData()
        }
        this.showConsultManagerModal = false
      })
    },
    onReplyModalCancel () {
      this.showConsultManagerModal = false
    }
  },
  mounted: function () {
    this.query.state = '待协调'
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
