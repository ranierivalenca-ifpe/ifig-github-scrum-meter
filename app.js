// https://medium.com/@jamesweee/using-vue-js-single-file-component-without-module-bundlers-aea58d892ad9

let projects = [
  new Project(
    'ReqOn',
    'gmatheus66/reqon'
  ).addSprint(
    'Sprint 1',
    ['Sprint 1'],
    '2019-09-10T00:00:00',
    '2019-09-17T09:00:00'
  ).addSprint(
    'Sprint 2',
    ['Sprint 2'],
    '2019-09-17T09:00:00',
    '2019-09-25T11:40:00'
  ).addSprint(
    'Sprint 3',
    ['Sprint 3'],
    '2019-09-25T12:00:00',
    '2019-10-01T09:40:00'
  ).addSprint(
    'Sprint 4',
    ['Sprint 4'],
    '2019-10-01T09:40:00',
    '2019-10-08T12:00:00'
  ),

  new Project(
    'Eis a Questão',
    'Alessandro018/Eis-aQuestao'
  ).addSprint(
    'Sprint 1',
    ['Sprint 1'],
    '2019-09-10T00:00:00',
    '2019-09-17T08:00:00'
  ).addSprint(
    'Sprint 2',
    ['Sprint 2'],
    '2019-09-17T09:15:00',
    '2019-09-25T12:00:00'
  ).addSprint(
    'Sprint 3',
    ['Sprint 3'],
    '2019-09-25T12:00:00',
    '2019-10-01T09:00:00'
  ).addSprint(
    'Sprint 4',
    ['Sprint 4'],
    '2019-10-01T09:40:00',
    '2019-10-08T12:00:00'
  ),

  new Project(
    'ComuniQ',
    'lipeh777/comuniq'
  ).addSprint(
    'Sprint 1',
    ['Sprint 1'],
    '2019-09-10T00:00:00',
    '2019-09-18T12:50:00'
  ).addSprint(
    'Sprint 2',
    ['Sprint 2'],
    '2019-09-18T14:20:00',
    '2019-09-25T16:00:00'
  ).addSprint(
    'Sprint 3',
    ['Sprint 3'],
    '2019-09-25T16:00:00',
    '2019-10-01T16:00:00'
  ).addSprint(
    'Sprint 4',
    ['Sprint 4'],
    '2019-10-01T16:00:00',
    '2019-10-09T16:00:00'
  )

];


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