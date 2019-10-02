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
      <div id="sprints-list">
        <div class="sprint"
          v-for="spr in project.sprints"
          :class="spr == sprint ? 'active' : false">
          <span v-on:click="sprint = spr">
            {{ spr.title }}
          </span>
        </div>
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
            </div>
          </div>

          <div class="body" :key="sprint.title">
            <data-row v-for="user in project.getUsers()"
              v-if="!['ranierivalenca', 'lilialnas'].includes(user.login)"
              v-bind:user="user"
              v-bind:sprint="sprint"
              :key="user.login">
            </data-row>
            <data-row v-for="user in project.getUsers()"
              v-if="['ranierivalenca', 'lilialnas'].includes(user.login)"
              v-bind:user="user"
              v-bind:sprint="sprint"
              v-bind:extra-class="'teacher'"
              :key="user.login">
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
          this.sprint = this.project.lastSprint();
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
      formatDate: function(date) {
        return new Date(date).toLocaleString();
      }
    }
  }
</script>