<template>
  <div>
    <h1>活动查看</h1>
    <br>
    <Form :label-width="80" :model="query" inline>
      <FormItem label="活动名称：" prop="activity">
        <AutoComplete v-model="query.name_like" :data="activityName"
                      style="width:180px"
                      @on-search="handleSearchActivateName"></AutoComplete>
      </FormItem>
      <FormItem label="学期：" :prop="'activity.term'" >
        <Select v-model="query.term" style="width:200px">
          <Option v-for="item in terms" :value="item.name" :key="item.name">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem >
        <Button type="primary" @click=" onSearch">查询</Button>
      </FormItem>
    </Form>

    <Table border stripe :columns="columns" :data="data"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
      </div>
    </div>
  </div>

</template>

<script>
import { queryCurrentuserActives } from '../../../service/api/actives'
import { queryTerms, getCurrentTerms } from '../../../service/api/term'
import { updateWithinField } from 'Libs/tools'

export default {
  name: 'alreadyRegistered',
  data: function () {
    return {
      query: {
        state: 'hasAttended',
        term: undefined
      }, // 查询用的参数
      total: 0, // 总数量
      data: [{
        activity: {},
        activity_user: {}
      }], // 数据
      terms: [],
      activityName: [],
      selected_activity_id: '', // 选中编辑的课程ids
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      columns: [
        {
          title: '活动名称',
          render: function (h, params) {
            return (
              <span>{ params.row.activity.name }</span>
            )
          }
        },
        {
          title: '活动地点',
          render: function (h, params) {
            return (
              <span>{ params.row.activity.place }</span>
            )
          }
        },
        {
          title: '活动状态',
          render: function (h, params) {
            return (
              <span>{ params.row.activity.state }</span>
            )
          }
        },
        {
          title: '参加状态',
          render: function (h, params) {
            return (
              <span>{ params.row.activity_user.fin_state }</span>
            )
          }
        },
        {
          title: '开始时间',
          render: function (h, params) {
            return (
              <span>{ params.row.activity.start_time }</span>
            )
          }
        },
        {
          title: '结束时间',
          render: function (h, params) {
            return (
              <span>{ params.row.activity.end_time }</span>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.selected_activity_id = params.row.activity.id
                  }
                }
              }, '详情')
            ])
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
      return queryCurrentuserActives({ ...this.query, ...this.pages }).then((resp) => {
        this.data = resp.data.activities
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
    handleSearchActivateName (value) {
      queryCurrentuserActives({ name_like: value }).then((resp) => {
        this.activityName.splice(0, this.activityName.length)
        resp.data.activities.forEach((activity) => {
          this.activityName.push(activity.name)
        })
      })
    }
  },
  mounted: function () {
    this.query.state = 'hasAttended'
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
      getCurrentTerms().then((termResp) => {
        this.query.term = termResp.data.term.name
        queryCurrentuserActives({ ...this.query, ...this.pages }).then((resp) => {
          this.data = resp.data.activities
          this.total = resp.data.total
        })
      })
    })
  }
}
</script>

<style scoped>

</style>
