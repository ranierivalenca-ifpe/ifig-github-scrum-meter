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

      <sprint
        v-if="sprint"
        v-bind:sprint="sprint"
        v-bind:project="project">

      </sprint>
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