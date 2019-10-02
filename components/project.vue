<template>
  <div id="project">
    <div id="loader" v-if="project && project.is_loading">
      Total Requests: <span>{{completedRequests.length}} / {{requests.length}}</span>
      <div class="progress">
        <div class="bar"
          :style="`width:${100 * completedRequests.length / Math.max(requests.length, 1)}%`"></div>
      </div>
    </div>

    <div class="project-summary">

    </div>

    <div v-if="project && project.has_loaded">
      <span class="renew" v-on:click.prevent="project.loadData(true)">
        R
      </span>
      <h1>{{ project.name }}</h1>
      <div id="sprints">
        <sprint v-for="spr in project.sprints"
          v-bind:sprint="spr"
          v-bind:active="spr == sprint"
          v-on:select="setSprint">
        </sprint>
      </div>

      <div v-if="sprint">
        <div class="sprint-data">
          <div class="data">
            Interval:
            <span>
            {{ formatDate(sprint.from) }} ~ {{ formatDate(sprint.to) }}
            </span>
          </div>
          <div class="data">
            Total Issues:
            <span :_title="sprint.getIssuesNumbers()">
              {{ sprint.getIssues().length }}
              <div class="details">
                <span class="open">{{ sprint.getOpenIssues().length }} open</span> /
                <span class="closed">{{ sprint.getClosedIssues().length }} closed</span>
                ({{Math.round(100 * sprint.getClosedIssues().length / sprint.getIssues().length)}}%)
              </div>
            </span>
          </div>
          <div class="data">
            Total Commits:
            <span class="commits">
              {{ sprint.getAllCommits().length }}
            </span>
          </div>
          <div class="data">
            Total Comments:
            <span class="comments">
              {{ sprint.getAllComments().length }}
            </span>
          </div>
        </div>

        <fieldset>
          <legend>Coefficients</legend>
          aip: <input type="number" step="0.1" v-model="coefs.aip">
          naip: <input type="number" step="0.1" v-model="coefs.naip">
          cai: <input type="number" step="0.1" v-model="coefs.cai">
          ncai: <input type="number" step="0.1" v-model="coefs.ncai">
        </fieldset>

        <div id="data-table">
          <div class="head">
            <div class="row1">
              <span class="data"></span>

              <span class="data">Data</span>

              <span class="data">Assigned Issues</span>

              <span class="data">Unassigned Issues</span>

              <span class="data">Metrics</span>
            </div>
            <div class="row2">
              <span class="data">Committer</span>

              <span class="data bl commits">C'mits</span>
              <span class="data comments">C'ments</span>

              <span class="data bl open">Open</span>
              <span class="data closed">Closed</span>

              <span class="data commits">w/ C'mits</span>
              <span class="data comments">w/ C'ments</span>

              <span class="data bl commits">w/ C'mits</span>
              <span class="data comments">w/ C'ments</span>

              <span class="data bl">AIP</span>
              <span class="data">NAIP</span>

              <span class="data">CAI</span>
              <span class="data">NCAI</span>

              <span class="data">AIF</span>

              <span class="data">WD</span>

              <span class="data em">Part</span>
              <span class="data em">Compr</span>
            </div>
          </div>

          <div class="body" :key="sprint.title">
            <data-row v-for="user in project.getUsers()"
              v-if="!['ranierivalenca', 'lilialnas'].includes(user.login)"
              v-bind:user="user"
              v-bind:sprint="sprint">
            </data-row>
            <data-row v-for="user in project.getUsers()"
              v-if="['ranierivalenca', 'lilialnas'].includes(user.login)"
              v-bind:user="user"
              v-bind:sprint="sprint"
              v-bind:extra-class="'teacher'">
            </data-row>
        </div>
      </div>
    </div>
  </div>
</template>






<script>
  module.exports = {
    data() {
      return {
        sprint: null,

        coefs: {
          aip: 0.5,
          naip: 0.2,
          cai: 0.5,
          ncai: -0.2
        },

        loaded: false,
        loading: false,
      }
    },
    components: {
      sprint: window.httpVueLoader('/components/sprint.vue'),
      dataRow: window.httpVueLoader('/components/data-row.vue'),
    },
    props: [
      'project'
    ],
    mounted() {
      // console.log('montado');
    },
    watch: {
      project: function(newVal, oldVal) {
        this.sprint = null;
        this.project.loadData().then(() => {
          this.setSprint(this.project.lastSprint());
        });
      }
    },
    computed: {
      requests: function() {
        return this.project.watcher.requests;
      },
      completedRequests: function() {
        return this.project.watcher.completed;
      },

    },
    methods: {
      setSprint: function(sprint) {
        this.sprint = sprint
      },
      formatDate: function(date) {
        return new Date(date).toLocaleString();
      }
    }
  }
</script>