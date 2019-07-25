<template>
  <div>
    <Card>
      <Row>
        <Col span="6">
          学期：
          <Select v-model="query.meta.term" style="width:200px" v-role ="['管理员']">
            <Option v-for="item in terms" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <Button type="primary" style="margin-left: 20px;width: 80px" @click="onSearch">查询</Button>
        </Col>
      </Row>
    </Card>
    <div style="padding-top: 30px"></div>
    <Card>
      <Row :gutter="16" class="form_content">
        <Table :columns="columns" :data="data">
          <template slot-scope="{ row }" slot="name">
            <span>{{row.bind_meta_name}} </span>
          </template>
          <template slot-scope="{ row }" slot="lesson_name">
            <span>{{row.meta.lesson.lesson_name}} </span>
          </template>
          <template slot-scope="{ row }" slot="lesson_date">
            <span>{{row.meta.lesson.lesson_date}} </span>
          </template>
          <template slot-scope="{ row }" slot="lesson_attribute">
            <span>{{row.meta.lesson.lesson_attribute}} </span>
          </template>
          <template slot-scope="{ row }" slot="lesson_class">
            <span>{{row.meta.lesson.lesson_class}} </span>
          </template>
          <template slot-scope="{ row }" slot="lesson_level">
            <Tag v-if="row.meta.lesson.lesson_level === '自主听课'" color="blue">
              {{ row.meta.lesson.lesson_level }}
            </Tag>
            <Tag v-else color="red">
              {{ row.meta.lesson.lesson_level }}
            </Tag>
          </template>
          <template slot-scope="{ row }" slot="status">
            <Tag v-if="row.status === '已完成'" color="green">
              {{ row.status }}
            </Tag>
            <Tag v-else color="red">
              {{ row.status }}
            </Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="handleChangeClick(row)">修改</Button>
            <Button type="primary" size="small" @click="handleChangeWatch(row)">查看</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page"
                  @on-change="onPageChange"></Page>
          </div>
        </div>
      </Row>
    </Card>
  </div>
</template>

<script>
import { queryMyForms } from '../../service/api/dqs'
import { getCurrentTerms, queryTerms } from '../../service/api/term'
import font_image from '@/view/components/form_meta_card/font_image.vue'

export default {
  components: { font_image },
  name: 'GuiderMyForm',
  data: function () {
    return {
      columns: [{
        title: '评价体系名称',
        slot: 'name'
      },
      {
        title: '听课课程',
        slot: 'lesson_name'
      },
      {
        title: '听课日期',
        slot: 'lesson_date'
      }, {
        title: '听课属性',
        slot: 'lesson_attribute'
      },
      {
        title: '听课班级',
        slot: 'lesson_class'
      },
      {
        title: '听课等级',
        slot: 'lesson_level'
      },
      {
        title: '完成情况',
        slot: 'status'
      },
      {
        title: '操作',
        slot: 'action',
        align: 'center'
      }],
      data: [],
      total: 0,
      terms: [],
      query: {
        meta: { term: undefined }
      },
      pages: {
        _per_page: 30,
        _page: 1
      }
    }
  },
  methods: {
    fetchForms () {
      return queryMyForms({ ...this.query, ...this.pages }).then((resp) => {
        this.data = resp.data.forms
        this.total = resp.data.total
      })
    },
    onSearch () {
      // 查询变化 当点提交查询条件生效
      this.pages._page = 1
      this.fetchForms()
    },
    onPageChange () {
      this.fetchForms()
    },
    handleChangeClick (form) {
      this.$router.push({ path: `/_guider/judge/form_show/${form._id}` })
    },
    handleChangeWatch (form) {
      this.$router.push({ path: `/_guider/judge/form_show/${form._id}` })
    }
  },
  created: function () {
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
      if (this.terms.length > 0) {
        this.query.meta.term = this.terms[0].name
      }
      this.fetchForms()
    })
  }
}
</script>

<style scoped>

  .form_content {
    padding-top: 30px;
  }
</style>
