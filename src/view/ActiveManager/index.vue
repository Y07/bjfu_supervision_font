<template>
  <Card>
    <!--<h>hi{{this.total}}!!!</h>-->
    <h1>活动管理</h1>
    <br>
    <Form :label-width="80" :model="query" inline>
      <FormItem label="活动名称：" prop="name">
        <AutoComplete v-model="query.name_like" :data="activityName"
                      style="width:180px"
                      @on-search="handleSearchActivateName"></AutoComplete>
      </FormItem>
      <FormItem label="学期：" >
        <Select v-model="query.term" style="width:200px">
          <Option v-for="item in terms" :value="item.name" :key="item.name">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="onSearch">查询</Button>
      </FormItem>
    </Form>

    <ActivesAddModal
      :modal="showActiveAddModal"
      @onOK="onAddModalOK"
      @onCancel="onAddModalCancel">
    </ActivesAddModal>

    <Table border stripe :columns="columns" :data="data"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page"
              @on-change="onPageChange"></Page>
      </div>
    </div>

    <float_bar>
      <Button type="primary" @click="showActiveAddModal=true">新增</Button>
    </float_bar>
    <!--{{this.showActiveAddModal}}-->
  </Card>
</template>

<script>
import ActivesAddModal from './components/ActivesAddModal'
import { queryActives, putActive, postActive, deleteActive } from '../../service/api/actives'
import { queryTerms, getCurrentTerms } from '../../service/api/term'
import Float_bar from '_c/float_bar/float_bar'
import { updateWithinField } from 'Libs/tools'

export default {
  components: { Float_bar, ActivesAddModal },
  data: function () {
    return {
      query: {
        name_like: undefined
      }, // 查询用的参数
      activityName: [],
      total: 0, // 总数量
      data: [], // 数据
      terms: [],
      activity: {},
      selected_activity_id: '', // 选中编辑的课程ids
      showActivityProfileModal: false, // 展示编辑弹窗
      showActiveAddModal: false,
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      columns: [
        {
          title: '活动名称',
          render: function (h, params) {
            return h('span', params.row.name)
          }
        },
        {
          title: '活动地点',
          render: function (h, params) {
            return h('span', params.row.place)
          }
        },
        {
          title: '活动状态',
          render: function (h, params) {
            return h('span', params.row.state)
          }
        },
        {
          title: '开始时间',
          render: function (h, params) {
            return h('span', params.row.start_time)
          }
        },
        {
          title: '结束时间',
          render: function (h, params) {
            return h('span', params.row.end_time)
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
                    this.selected_activity_id = params.row.id
                    // this.showActivityProfileModal=true;
                    // const route=this.selected_activity_id;
                    // this.$router.push({path: `:id/${route}`})
                    this.$router.push({ path: `/active/detail/${params.row.id}` })
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.selected_activity_id = params.row.id
                    deleteActive(params.row.id).then(() => {
                      this.$Message.success('删除成功！')
                      this.fetchData()
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    fetchData () {
      // 数据表发生变化请求数据
      return queryActives({ ...this.query, ...this.pages }).then((resp) => {
        this.data = resp.data.activities
        this.total = resp.data.total
        this.activityName = []
        this.data.forEach((activity) => {
          this.activityName.push(activity.name)
        })
      })
    },
    filterMethod (value, option) {
      return option.indexOf(value) !== -1
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
      queryActives({ name_like: value }).then((resp) => {
        this.activityName.splice(0, this.activityName.length)
        resp.data.activities.forEach((activity) => {
          this.activityName.push(activity.name)
        })
      })
    },
    onProfileModalOK (activity) {
      // 更新框确定 关闭
      postActive(activity).then((resp) => {
        this.showActivityProfileModal = false
      })
      this.fetchData()
    },
    onProfileModalCancel () {
      this.showActivityProfileModal = false
    },
    onAddModalOK (activity) {
      postActive(activity).then((resp) => {
        if (resp.data.code === 200) {
          this.$Message.success({ content: '活动添加成功' })
          this.fetchData()
        }
        this.showActiveAddModal = false
      })
    },
    onAddModalCancel () {
      this.showActiveAddModal = false
    }
  },
  mounted: function () {
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
      getCurrentTerms().then((termResp) => {
        this.query.term = termResp.data.term.name
        this.fetchData()
      })
    })
  }
}
</script>

<style scoped>

</style>
