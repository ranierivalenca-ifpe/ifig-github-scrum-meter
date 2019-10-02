<template>
  <div class="row" :class="extraClass ? extraClass : false">
    <div class="data">{{ user.login }}</div>

    <div class="data commits">{{commits.length}}</div>
    <div class="data comments">{{comments.length}}</div>

    <div class="data open" :_title="list(openIssues)">{{openIssues.length}}</div>
    <div class="data closed" :_title="list(closedIssues)">{{closedIssues.length}}</div>

    <div class="data commits" :_title="list(assignedCommits)">{{assignedCommits.length}}</div>
    <div class="data comments" :_title="list(assignedComments)">{{assignedComments.length}}</div>

    <div class="data commits" :_title="list(unassignedCommits)">{{unassignedCommits.length}}</div>
    <div class="data comments">{{unassignedComments.length}}</div>

    <div class="data">{{ parameters.aip }}</div>
    <div class="data">{{ parameters.naip }}</div>

    <div class="data">{{ parameters.cai }}</div>
    <div class="data">{{ parameters.ncai }}</div>

    <div class="data">{{ parameters.aif }}</div>

    <div class="data">{{ parameters.wd }}</div>

    <div class="data em">
      {{ parameters.participation }}
    </div>
    <div class="data em">
      {{ parameters.compromise }}
    </div>
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
      'user',
      'commits',
      'comments',
      'openIssues',
      'closedIssues',
      'assignedCommits',
      'assignedComments',
      'unassignedCommits',
      'unassignedComments',
      'parameters',
      'extraClass',
    ],
    mounted() {
       // console.log(this.user);
       // console.log(this.closedIssues.map(i => parseInt(i.number)));
    },
    methods: {
      list: function(issues) {
        // console.log(issues.map(i => parseInt(i.number)));
        return issues
          .map(i => parseInt(i.number))
          .sort((a, b) => a - b)
          .join(", ");
      }
    }
  }
</script>