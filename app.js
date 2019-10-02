// https://medium.com/@jamesweee/using-vue-js-single-file-component-without-module-bundlers-aea58d892ad9

let app = new Vue({
  el: '#app',
  components: {
    projectData: window.httpVueLoader('/components/project-data.vue'),
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