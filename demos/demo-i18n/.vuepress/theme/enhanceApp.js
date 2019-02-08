export default ({ Vue, options, router  }) => {
  if (!IS_SERVER) {
    const VueTouchfeedback = require('vue-touchfeedback')
    Vue.use(VueTouchfeedback)

    router.beforeEach((to, from, next) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      next()
    })
  }
}
