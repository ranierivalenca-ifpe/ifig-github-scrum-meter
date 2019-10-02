<template>
  <div class="row" :class="extraClass ? extraClass : false">
    <div class="data">{{ user.login }}</div>

    <div class="data commits">{{commits.length}}</div>
    <div class="data comments">{{comments.length}}</div>

    <div class="data open" :_title="list(openIssues)">{{openIssues.length}}</div>
    <div class="data closed" :_title="list(closedIssues)">{{closedIssues.length}}</div>

    <div class="data commits" :_title="list(assignedIssuesWithCommits)">{{assignedIssuesWithCommits.length}}</div>
    <div class="data comments" :_title="list(assignedIssuesWithComments)">{{assignedIssuesWithComments.length}}</div>

    <div class="data commits" :_title="list(unassignedIssuesWithCommits)">{{unassignedIssuesWithCommits.length}}</div>
    <div class="data comments" :_title="list(unassignedIssuesWithComments)">{{unassignedIssuesWithComments.length}}</div>

    <div class="data">{{ metrics.aip }}</div>
    <div class="data">{{ metrics.naip }}</div>

    <div class="data">{{ metrics.cai }}</div>
    <div class="data">{{ metrics.ncai }}</div>

    <div class="data">{{ metrics.aif }}</div>

    <div class="data">{{ metrics.wd }}</div>
  </div>
</template>

<script>
  module.exports = {
    data() {
      return {
      }
    },
    props: [
      'user',
      'sprint',

      'extraClass',
    ],
    mounted() {
       // console.log(this.user);
       // console.log(this.closedIssues.map(i => parseInt(i.number)));
    },
    computed: {
      commits: function() {
        return this.sprint.getUserCommits(this.user.login);
      },
      comments: function() {
        return this.sprint.getUserComments(this.user.login);
      },
      openIssues: function() {
        return this.sprint.getUserOpenIssues(this.user.login);
      },
      closedIssues: function() {
        return this.sprint.getUserClosedIssues(this.user.login);
      },
      assignedIssuesWithCommits: function() {
        return this.sprint.getUserAssignedIssuesWithCommits(this.user.login);
      },
      assignedIssuesWithComments: function() {
        return this.sprint.getUserAssignedIssuesWithComments(this.user.login);
      },
      unassignedIssuesWithCommits: function() {
        return this.sprint.getUserUnassignedIssuesWithCommits(this.user.login);
      },
      unassignedIssuesWithComments: function() {
        return this.sprint.getUserUnassignedIssuesWithComments(this.user.login);
      },
      metrics: function() {
        return this.sprint.getUserMetrics(this.user.login);
      },
    },
    methods: {
      list: function(issues) {
        // console.log(issues.map(i => parseInt(i.number)));
        return issues
          .map(i => parseInt(i.number))
          .sort((a, b) => a - b)
          .join(" ");
      },
    }
  }
</script>