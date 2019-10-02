// https://medium.com/@jamesweee/using-vue-js-single-file-component-without-module-bundlers-aea58d892ad9

let app = new Vue({
  el: '#app',
  components: {
    project: window.httpVueLoader('/components/project.vue'),
    projectData: window.httpVueLoader('/components/project-data.vue'),
  },
  data: {

    projects: [
      {
        name: 'ReqOn',
        repo: 'gmatheus66/reqon',
        sprints: [
          {
            title: 'Sprint 1',
            milestones: ['Sprint 1'],
            from: '2019-09-10T00:00:00',
            to: '2019-09-17T09:00:00'
          },
          {
            title: 'Sprint 2',
            milestones: ['Sprint 2'],
            from: '2019-09-17T09:00:00',
            to: '2019-09-25T11:40:00'
          },
          {
            title: 'Sprint 3',
            milestones: ['Sprint 3'],
            from: '2019-09-25T12:00:00',
            to: '2019-10-01T11:40:00'
          },
        ]
      },
      {
        name: 'Eis a Questão',
        repo: 'Alessandro018/Eis-aQuestao',
        sprints: [
          {
            title: 'Sprint 1',
            milestones: ['Sprint 1'],
            from: '2019-09-10T00:00:00',
            to: '2019-09-17T08:00:00'
          },
          {
            title: 'Sprint 2',
            milestones: ['Sprint 2'],
            from: '2019-09-17T09:15:00',
            to: '2019-09-25T12:00:00'
          },
          {
            title: 'Sprint 3',
            milestones: ['Sprint 3'],
            from: '2019-09-25T12:00:00',
            to: '2019-10-01T12:00:00'
          }
        ]
      },
      {
        name: 'ComuniQ',
        repo: 'lipeh777/comuniq',
        sprints: [
          {
            title: 'Sprint 1',
            milestones: ['Sprint 1'],
            from: '2019-09-10T00:00:00',
            to: '2019-09-18T12:50:00'
          },
          {
            title: 'Sprint 2',
            milestones: ['Sprint 2'],
            from: '2019-09-18T14:20:00',
            to: '2019-09-25T16:00:00'
          },
          {
            title: 'Sprint 3',
            milestones: ['Sprint 3'],
            from: '2019-09-25T16:00:00',
            to: '2019-10-01T16:00:00'
          }
        ]
      }
    ],

    project: null,
  },
  watch: {
    // watcher:
  },
  methods: {
    setProject: function(project, reload) {
      reload = reload || false;
      this.project = project;
      console.log('setting project...');
    },

  },


  mounted: function() {
    this.projects.map(project => {
      project.sprints.map(sprint => {
        sprint.snapshot = {};
      });
    });
  }
});