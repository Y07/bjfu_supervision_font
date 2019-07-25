import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      userInfo: state => state.user,
      roles: state => state.user.access
    })
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  }
}
