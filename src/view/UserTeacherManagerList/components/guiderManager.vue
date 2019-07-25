<template>
  <div>

    <br>
    <Form :label-width="80" :model="query" inline>
      <Form :label-width="80" :model="query" inline>
        <FormItem label="用户名字：" prop="name">
          <Input style="width: 180px" v-model="query.name_like" placeholder="请输入用户名字">
        </Input>
        </FormItem>

        <FormItem label="学期：" prop="term" v-role ="['管理员']">
          <Select v-model="query.term" style="width:200px">
            <Option v-for="item in terms" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem >
          <Button type="primary" @click=" onSearch">查询</Button>
        </FormItem>
      </Form>
    </Form>

    <UserProfileModal
      :show="showUserProfileModal"
      @onOK="onProfileModalOK"
      @onCancel="onProfileModalCancel"
      :id="selected_id"
    ></UserProfileModal>

    <UserAddModal
      :show="showUserAddModal"
      @onOK="onAddModalOK"
      @onCancel="onAddModalCancel"
    ></UserAddModal>
  <Table border stripe :columns="columns" :data="data"></Table>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: right;">
      <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
    </div>
  </div>

    <Button type="primary" @click="()=>{this.showUserAddModal=true}" v-role ="['管理员']">
      新增
    </Button>
  </div>

</template>

<script>
import UserProfileModal from './UserProfileModal'
import { updateWithinField } from 'Libs/tools'
import UserAddModal from './UserAddModal'
import { queryTerms, getCurrentTerms } from '../../../service/api/term'
import { querySupervisors, putUser, postUser, postSupervisors, putSupervisor } from '../../../service/api/user'
export default {
  components: { UserProfileModal, UserAddModal },
  data: function () {
    return {
      query: {
        term: '',
        name_like: undefined
      }, // 查询用的参数
      total: 0, // 总数量
      data: [], // 数据
      terms: [],
      selected_id: 0, // 选中编辑的用户的name
      showUserProfileModal: false, // 展示编辑弹窗
      showUserAddModal: false,
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      columns: [
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '名字',
          key: 'user.name',
          render: function (h, params) {
            return h('span', params.row.user.name)
          }
        },
        {
          title: '学院',
          key: 'user.unit',
          render: function (h, params) {
            return h('span', params.row.user.unit)
          }
        },
        {
          title: '专业',
          key: 'user.skill',
          render: function (h, params) {
            return h('span', params.row.user.skill)
          }
        },
        {
          title: '职称',
          key: 'user.prorank',
          render: function (h, params) {
            return h('span', params.row.user.prorank)
          }
        },
        {
          title: '工作状态',
          render: function (h, params) {
            return h('span', params.row.work_state)
          }
        },
        {
          title: '小组',
          render: function (h, params) {
            return h('span', params.row.group)
          }
        },
        {
          title: '小组长',
          width: 75,
          render: function (h, params) {
            if (params.row.is_grouper) {
              return h('Icon', { props: {
                type: 'md-checkmark-circle'
              },
              style: {
                color: '#19be6b',
                fontSize: '30px',
                textAlign: 'center'
              }
              })
            } else {
              return h('span')
            }
          }
        },
        {
          title: '大组长',
          width: 75,
          render: function (h, params) {
            if (params.row.is_main_grouper) {
              return h('Icon', { props: {
                type: 'md-checkmark-circle'
              },
              style: {
                color: '#19be6b',
                fontSize: '30px',
                textAlign: 'center'
              }
              })
            } else {
              return h('span')
            }
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
                directives: [{
                  name: 'role',
                  value: ['管理员']
                }],
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.selected_id = params.row.id

                    this.showUserProfileModal = true
                  }
                }
              }, '查看')
            ])
          }
        }
      ]
    }
  },
  methods: {
    fetchData () {
      // 数据表发生变化请求数据
      let args = { ...this.query, ...this.pages }
      return querySupervisors(args).then((resp) => {
        this.data = resp.data.supervisors
        this.total = resp.data.total
      })
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    onSearch (query) {
      // 查询变化 当点提交查询条件生效
      this.pages._page = 1
      this.fetchData()
    },
    onProfileModalOK (user) {
      // 更新框确定 关闭
      putSupervisor(user).then((resp) => {
        if (resp.data.code === 200) {
          this.$Message.success({ content: '更新成功' })
          this.fetchData()
        }
        this.pages._page = 1
        this.showUserProfileModal = false
      })
    },
    onProfileModalCancel () {
      this.showUserProfileModal = false
    },
    onAddModalOK (user) {
      // 更新框确定 关闭
      user.term = this.query.term
      postSupervisors(user).then((resp) => {
        if (resp.data.code === 200) {
          this.$Message.success({ content: '新建成功' })
          this.fetchData()
        }
        this.pages._page = 1
        this.showUserAddModal = false
      })
    },
    onAddModalCancel () {
      this.showUserAddModal = false
    }
  },
  mounted: function () {
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
    })
    getCurrentTerms().then((termResp) => {
      this.query.term = termResp.data.term.name
      this.fetchData()
    })
  }
}
</script>

<style scoped>

</style>
