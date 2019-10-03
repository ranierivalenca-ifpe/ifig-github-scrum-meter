// https://medium.com/@jamesweee/using-vue-js-single-file-component-without-module-bundlers-aea58d892ad9

let app = new Vue({
  el: '#app',
  components: {
    project: window.httpVueLoader('/components/project.vue'),
    metrics: window.httpVueLoader('/components/metrics.vue'),
  },
  data: {
    projects: projects,
    activeProject: null,
  },
  watch: {
    // watcher:
  },
  methods: {
    toggleActiveProject: function(project) {
      if (this.activeProject == project) {
        this.activeProject = null;
        return;
      }
      this.activeProject = project;
    }
  },


  mounted: function() {
  }
});