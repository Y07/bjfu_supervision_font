<template>
  <div>
    <Modal
      :value="modal"
      title="增加一项活动"
      @on-ok="handleOK"
      @on-cancel="handleCancel"

      style="width: 600px;"><!--:load="loading"-->
      <Form :label-width="100" style="width: 400px" ref="activity_form" :model="activity" :rules="ruleValidate">
        <form-item label="活动名称:" prop="name">
          <Row>
            <Col>
              <Input v-model="activity.name" placeholder="活动名称"></Input>
            </Col>
          </Row>
        </form-item>
        <form-item label="责任老师:" prop="teacher">
          <Row>
            <Col>
              <Select v-model="activity.teacher" style="width:200px" filterable>
                <Option v-for="(item,index) in users" :value="item.username" :key="item.username + index" @on-query-change="onSelectTeacherChange">
                  {{item.name}}
                </Option>
              </Select>
            </Col>
          </Row>
        </form-item>
        <form-item label="活动时间:" prop="inputtime">
          <Row>
            <Col span="11">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="开始日期" v-model="activity.inputtime.start_time"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="结束日期" v-model="activity.inputtime.end_time"></DatePicker>
            </Col>
          </Row>
        </form-item>
        <form-item label="参与人数:" prop="all_num">
          <Row>
            <Col>
              <InputNumber v-model="activity.all_num"></InputNumber>
            </Col>
          </Row>
        </form-item>
        <form-item label="活动地点:" prop="place">
          <Row>
            <Col>
              <Input v-model="activity.place" placeholder="填写活动地点" />
            </Col>
          </Row>
        </form-item>
        <form-item label="活动信息:" prop="information">
          <Row>
            <Col>
              <Input v-model="activity.information" type="textarea" placeholder="填写活动信息" />
            </Col>
          </Row>
        </form-item>
        <FormItem label="学期：" prop="term" v-role ="['管理员']">
          <Select v-model="activity.term" style="width:200px">
            <Option v-for="item in terms" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <form-item label="报名时间:" prop="inputapplytime">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="起始日期" v-model="activity.inputapplytime.apply_start_time"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <DatePicker type="date" placeholder="截止日期" v-model="activity.inputapplytime.apply_end_time"></DatePicker>
            </Col>
          </Row>
        </form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { queryUsers } from '../../../service/api/user'
import { queryTerms, getCurrentTerms } from '../../../service/api/term'
import { queryActives } from '../../../service/api/actives'
import { dateToString } from '@/libs/tools'
export default {
  name: 'ActiveAddModal',
  props: {
    modal: Boolean,
    onCancel: Function,
    onOK: Function
  },
  data () {
    return {
      modal: false,
      // loading: true,
      date: new Date(),
      query: {}, // 查询用的参数
      terms: [],
      users: [],
      data: [],
      total: 0,
      activity: {
        name: '',
        teacher: '',
        all_num: 1,
        place: '',
        information: '',
        term: '',
        created_at: '',
        updated_at: '',
        inputtime: {
          start_time: '',
          end_time: ''
        },
        inputapplytime: {
          apply_start_time: '',
          apply_end_time: ''
        }
      },
      addActivity: {},
      ruleValidate: {
        name: [{ required: true, trigger: 'blur', message: '请填写活动名称' }],
        teacher: [{ required: true, trigger: 'change', message: '请选择责任教师' }],
        inputtime: [{
          required: true,
          type: 'object',
          trigger: 'change',
          message: '请选择日期',
          fields: {
            start_time: { type: 'date', required: true, message: '请选择开始日期' },
            end_time: { type: 'date', required: true, message: '请选择结束日期' }
          }
        }],
        all_num: [{ required: true, type: 'number', min: 1, trigger: 'change', message: '参与人数必须大于等于1' }],
        place: [{ required: true, trigger: 'blur', message: '请填写活动地点' }],
        information: [{ required: true, trigger: 'blur', message: '请填写活动信息' }],
        term: [{ required: true, trigger: 'change', message: '请选择学期' }],
        inputapplytime: [{
          required: true,
          type: 'object',
          trigger: 'change',
          message: '请选择日期',
          fields: {
            apply_start_time: { type: 'date', required: true, message: '请选择起始日期' },
            apply_end_time: { type: 'date', required: true, message: '请选择截止日期' }
          }
        }]
      }
    }
  },
  methods: {
    handleOK: function () {
      this.$refs.activity_form.validate((valid) => {
        if (valid) {
          this.activity.inputtime.start_time = dateToString(this.activity.inputtime.start_time, 'yyyy-MM-dd hh:mm:ss')
          this.activity.inputtime.end_time = dateToString(this.activity.inputtime.end_time, 'yyyy-MM-dd hh:mm:ss')
          this.activity.inputapplytime.apply_start_time = dateToString(this.activity.inputapplytime.apply_start_time, 'yyyy-MM-dd hh:mm:ss')
          this.activity.inputapplytime.apply_end_time = dateToString(this.activity.inputapplytime.apply_end_time, 'yyyy-MM-dd hh:mm:ss')
          this.activity.created_at = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          this.activity.updated_at = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          console.log(this.activity.inputtime)
          console.log(this.activity.inputapplytime)
          if (this.activity.inputtime.start_time > this.activity.inputtime.end_time) {
            this.$Message.error('活动开始日期应该在结束日期之前！')
            return
          }
          if (this.activity.inputapplytime.apply_start_time > this.activity.inputapplytime.apply_end_time) {
            this.$Message.error('活动报名起始日期应该在截止日期之前！')
            return
          }
          if (this.activity.inputapplytime.apply_end_time > this.activity.inputtime.start_time) {
            this.$Message.error('活动报名截止日期应该在活动开始日期之前！')
            return
          }
          // this.loading= true;
          this.$Message.success('添加成功！')
          this.addActivity = {
            name: this.activity.name,
            teacher: this.activity.teacher,
            all_num: this.activity.all_num,
            place: this.activity.place,
            information: this.activity.information,
            term: this.activity.term,
            created_at: this.activity.created_at,
            updated_at: this.activity.updated_at,
            start_time: this.activity.inputtime.start_time,
            end_time: this.activity.inputtime.end_time,
            apply_start_time: this.activity.inputapplytime.apply_start_time,
            apply_end_time: this.activity.inputapplytime.apply_end_time
          }
          this.$emit('onOK', this.addActivity)
          this.activity = {}
          // this.inputtime = '';
          // this.activity.inputapplytime = '';
          // this.loading = false;
          this.modal = false
        } else {
          this.$Message.error('请填写完整信息!')
          /* setTimeout(() => {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          }, 2000); */
        }
      })
    },
    handleCancel: function () {
      this.$emit('onCancel')
    },
    onSelectTeacherChange: function (query) {
      this.queryUsers({ name_like: query }).then((resp) => {
        this.users = resp.data.users // 关键词编号重新加载 xxx_like 对 XXX模糊查
      })
    }
  },
  mounted: function () {
    let args = this.$route.query
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
    })
    getCurrentTerms().then((termResp) => {
      this.query.term = termResp.data.term.name
    })
    queryUsers().then((resp) => {
      this.users = resp.data.users
    })
    queryActives(args).then((resp) => {
      this.data = resp.data.activities
      this.total = resp.data.activities.length
    })
  }
}
</script>
