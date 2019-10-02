// https://medium.com/@jamesweee/using-vue-js-single-file-component-without-module-bundlers-aea58d892ad9

let app = new Vue({
  el: '#app',
  components: {
    project: window.httpVueLoader('/components/project.vue'),
    projectData: window.httpVueLoader('/components/project-data.vue'),
  },
  data: {
    projects: projects,
    project: null,
  },
  watch: {
    // watcher:
  },
  methods: {
    setProject: function(project, reload) {
      reload = reload || false;
      this.project = project;
      // console.log('setting project...');
    },

  },


  mounted: function() {
  }
});