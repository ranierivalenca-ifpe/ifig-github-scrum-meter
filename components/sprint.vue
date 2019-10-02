<template>
  <div id="sprint">
    <div class="sprint-data">
      <div class="data">
        Interval:
        <span>
        {{ formatDate(sprint.from) }} ~ {{ formatDate(sprint.to) }}
        </span>
      </div>
      <div class="data">
        Total Issues:
        <span>
          {{ sprint.getIssues().length }}
          <div class="details">
            <span
              class="open"
              :_title="sprint.getOpenIssuesNumbers().join(' ')"
            >
              {{ sprint.getOpenIssues().length }} open
            </span>
            and
            <span
              class="closed"
              :_title="sprint.getClosedIssuesNumbers().join(' ')"
            >
              {{ sprint.getClosedIssues().length }} closed
            </span>
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
</template>

<script>
  module.exports = {
    data() {
      return {

      }
    },
    components: {
      dataRow: window.httpVueLoader('/components/data-row.vue'),
    },
    props: [
      'project',
      'sprint'
    ],
    methods: {
      formatDate: function(date) {
        return new Date(date).toLocaleString();
      }
    }
  }
</script>