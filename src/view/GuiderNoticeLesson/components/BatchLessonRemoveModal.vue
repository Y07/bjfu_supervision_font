<template>
  <Modal
    :value="show"
    title="Title"
    @on-ok="handleOK"
    @on-cancel="handleCancel">
    <div>
      是否移除？
    </div>
  </Modal>
</template>

<script>
import { queryGroups } from '../../../service/api/user'
import { lessonLevel, lessonWatchReason } from '../marcos'
export default {
  name: 'BatchLessonWatchModal',
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function
  },
  data: function () {
    return {
      lesson: {},
      lessonLevel: lessonLevel,
      lessonWatchReason: lessonWatchReason, // 课程关注原因,
      groups: [] // 所有的小组
    }
  },
  methods: {
    handleOK: function () {
      this.$emit('onOK', this.lesson)
    },
    handleCancel: function () {
      this.$emit('onCancel')
    }
  },
  mounted: function () {
    queryGroups().then((resp) => {
      this.groups = resp.data.groups
    })
  }
}
</script>

<style scoped>

</style>
