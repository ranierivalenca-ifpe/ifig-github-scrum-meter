// https://medium.com/@jamesweee/using-vue-js-single-file-component-without-module-bundlers-aea58d892ad9

let app = new Vue({
  el: '#app',
  components: {
    project: window.httpVueLoader('/components/project.vue'),
  },
  data: {
    projects: projects,
    activeProject: null,
  },
  watch: {
    // watcher:
  },
  methods: {

  },


  mounted: function() {
  }
});