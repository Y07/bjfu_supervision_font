<template>
  <Card shadow>
    <h1 style="text-align: center">工作计划管理</h1>
    <Row >
        <Carousel v-model="term_index" style="height: 400px;">
          <CarouselItem v-for="term in terms" :key="term.name"  style="text-align: center">
                <Card style="height: 400px;">
                  <div slot="title" style="text-align: center">学期: {{term.name}}</div>
                  <plan :term="term.name"></plan>
                </Card>
          </CarouselItem>
        </Carousel>
    </Row>

  </Card>
</template>

<script>
import Plan from './components/plan'
import { queryTerms, getCurrentTerms } from '@/service/api/term'
import { postWorkPlan, queryWorkPlan } from '@/service/api/work_plan'
import CollapsedMenu from '../../components/main/components/side-menu/collapsed-menu'
export default {
  name: 'WorkPlan',
  components: { CollapsedMenu, Plan },
  data: function () {
    return {
      term_index: 0,
      show_plan_add_modal: false,
      terms: []
    }
  },
  computed: {
    current_term: function () {
      return this.terms[this.term_index]
    }
  },
  methods: {

  },
  mounted: function () {
    queryTerms().then((resp) => {
      this.terms = resp.data.terms
    })
  }
}
</script>

<style scoped>

</style>
