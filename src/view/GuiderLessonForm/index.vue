<template>
  <div>
    <Card>
      <Row>
        <Form :label-width="80" :model="query" inline>
        <FormItem label="学期：" prop="term" v-role ="['管理员']">
          <Select v-model="query.term" style="width:200px">
            <Option v-for="item in terms" :value="item.name" :key="item.name" @on-change="onTermChange">{{ item.name }}</Option>
          </Select>
        </FormItem>
          <FormItem label="教师名字：" prop="lesson_teacher_name">
              <TeacherSelector :term="query.term"  v-model="query.lesson_teacher_name"></TeacherSelector>
          </FormItem>
          <FormItem >
            <Button type="primary" @click="onSearch">查看</Button>
          </FormItem>
        </Form>
      </Row>
    </Card>

    <div style="padding-top: 15px"></div>
  <card>
    <h1>课程表</h1>
     <Table stripe border :columns="columns" :data="data"></Table>
  </card>
  </div>
</template>

<script>
import { getLessons } from '../../service/api/dqs'
import lesson_grid from './components/lesson_grid'
import { queryTerms, getCurrentTerms } from '../../service/api/term'
import TeacherSelector from '@/view/components/teacher_selector'

export default {
  components: { lesson_grid, TeacherSelector },
  data () {
    return {
      query: {},
      terms: [],
      term: '',
      columns: [
        {
          title: '#',
          key: 'period',
          align: 'center'
        },
        {
          title: '星期一',
          key: 1,
          align: 'center',
          render: function (h, params) {
            return h(lesson_grid, {
              props: { someLesson: params.row[1] }
            })
          }
        },
        {
          title: '星期二',
          key: 2,
          align: 'center',
          render: (h, params) => {
            return h(lesson_grid, {
              props: { someLesson: params.row[2] }
            })
          }
        },
        {
          title: '星期三',
          key: 3,
          align: 'center',
          render: (h, params) => {
            return h(lesson_grid, {
              props: { someLesson: params.row[3] }
            })
          }
        },
        {
          title: '星期四',
          key: 4,
          align: 'center',
          render: (h, params) => {
            return h(lesson_grid, {
              props: { someLesson: params.row[4] }
            })
          }
        },
        {
          title: '星期五',
          key: 5,
          align: 'center',
          render: (h, params) => {
            return h(lesson_grid, {
              props: { someLesson: params.row[5] }
            })
          }
        },
        {
          title: '星期六',
          key: 6,
          align: 'center',
          render: (h, params) => {
            return h(lesson_grid, {
              props: { someLesson: params.row[6] }
            })
          }
        },
        {
          title: '星期日',
          key: 7,
          align: 'center',
          render: (h, params) => {
            return h(lesson_grid, {
              props: { someLesson: params.row[7] }
            })
          }
        }
      ],
      data: [
        {
          period: '1-2',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '3-4',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '5',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '6-7',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '8-9',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '10-11',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '12',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        }
      ],
      lessons: []
    }
  },
  computed: {},
  methods: {
    preProcess: function (lessons) {
      let res = []
      lessons.forEach((lesson) => {
        lesson.lesson_cases.forEach((lesson_case) => {
          let same_case = res.findIndex((ele) => {
            return ele.id === lesson.id &&
                  ele.lesson_weekday === lesson_case.lesson_weekday &&
                  ele.lesson_time === lesson_case.lesson_time
          })
          if (same_case > -1) {
            res[same_case].lesson_week.push(lesson_case.lesson_week)
          } else {
            res.push({
              'id': lesson.id,
              'lesson_attribute': lesson.lesson_attribute,
              'lesson_class': lesson.lesson_class,
              'lesson_grade': lesson.lesson_grade,
              'lesson_id': lesson.lesson_id,
              'lesson_level': lesson.lesson_level,
              'lesson_name': lesson.lesson_name,
              'lesson_semester': lesson.lesson_semester,
              'lesson_state': lesson.lesson_state,
              'lesson_teacher_id': lesson.lesson_teacher_id,
              'lesson_teacher_name': lesson.lesson_teacher_name,
              'lesson_teacher_unit': lesson.lesson_teacher_unit,
              'lesson_type': lesson.lesson_type,
              'lesson_unit': lesson.lesson_unit,
              'lesson_year': lesson.lesson_year,
              'lesson_weekday': lesson_case.lesson_weekday,
              'lesson_time': lesson_case.lesson_time,
              'lesson_week': [lesson_case.lesson_week],
              'week': []
            })
          }
        })
      })
      return res
    },
    pullLessons: function () {
      this.lessons.length = 0
      this.data = [
        {
          period: '1-2',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '3-4',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '5',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '6-7',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '8-9',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '10-11',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        {
          period: '12',
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        }
      ]
      getLessons(this.query).then((resp) => {
        this.lessons = resp.data.lessons
        let allLessons = this.preProcess(this.lessons)
        allLessons.forEach((lesson) => {
          if (lesson.lesson_time.indexOf('0102') > -1) {
            this.data[0][lesson.lesson_weekday].push(lesson)
          }
          if (lesson.lesson_time.indexOf('0304') > -1) {
            this.data[1][lesson.lesson_weekday].push(lesson)
          }
          if (lesson.lesson_time.indexOf('05') > -1) {
            this.data[2][lesson.lesson_weekday].push(lesson)
          }
          if (lesson.lesson_time.indexOf('0607') > -1) {
            this.data[3][lesson.lesson_weekday].push(lesson)
          }
          if (lesson.lesson_time.indexOf('0809') > -1) {
            this.data[4][lesson.lesson_weekday].push(lesson)
          }
          if (lesson.lesson_time.indexOf('1011') > -1) {
            this.data[5][lesson.lesson_weekday].push(lesson)
          }
          if (lesson.lesson_time.indexOf('12') > -1) {
            this.data[6][lesson.lesson_weekday].push(lesson)
          }
        })
      })
    },
    onSearch: function () {
      this.pullLessons()
    },
    onTermChange: function (value) {
      this.term = value
      this.$router.push({ name: this.$route.name, query: { term: this.term } })
    }

  },
  mounted: function () {
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
    })
    getCurrentTerms().then((termResp) => {
      this.query.term = termResp.data.term.name
    })
  }
}
</script>

<style scoped>

</style>
