// 动态问卷相关的路由配置
import Main from '_c/main'
import parentView from '@/components/parent-view'

export default{
  name: '课程',
  path: '/lesson',
  component: Main,
  meta: {
    icon: 'md-chatbubbles',
    title: '课程中心'
  },
  children: [
    {
      name: '课程管理',
      path: 'manager', // xzl
      meta: {
        icon: 'arrow-graph-up-right',
        title: '课程管理'
      },
      component: resolve => require(['Views/LessonManager/index'], resolve)
    },
    {
      name: '好评课堂',
      path: 'good_lesson', // xzl
      meta: {
        icon: 'arrow-graph-up-right',
        title: '好评课堂',
        access: ['管理员']
      },
      component: resolve => require(['Views/LessonModelManager/index'], resolve)
    },
    {
      name: '关注课程',
      path: 'notice_lesson', // xzl
      meta: {
        icon: 'arrow-graph-up-right',
        title: '关注课程',
        access: ['管理员']
      },
      component: resolve => require(['Views/LessonNoticeManager/index'], resolve)
    },
    {
      name: 'lesson_form',
      path: 'lesson_form', // xzl
      meta: {
        icon: 'arrow-graph-up-right',
        title: '课程表'
      },
      component: resolve => require(['Views/LessonForm/index'], resolve)
    }

  ]
}
