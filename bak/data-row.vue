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

    <!-- <div class="data em">
      {{ metrics.participation }}
    </div>
    <div class="data em">
      {{ metrics.compromise }}
    </div> -->
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
      // openIssues: function() {
      //   return this.assignments.filter(issue => {
      //     return issue.state == 'open' || getTime(issue.closed_at) > getTime(this.sprint.to);
      //   });
      // },
      // closedIssues: function() {
      //   return this.assignments.filter(issue => {
      //     return issue.state == 'closed' && getTime(issue.closed_at) < getTime(this.sprint.to);
      //   });
      // },

      // unassignedIssues: function() {
      //   return Object.values(this.sprint.issues).filter(issue => {
      //     return !this.assignments.map(i => i.number).includes(issue.number);
      //   });
      // },

      // assignedIssuesWithCommits: function() {
      //   return this.assignments.filter(issue => this.hasCommits(issue));
      // },

      // assignedIssuesWithComments: function() {
      //   return this.assignments.filter(issue => this.hasComments(issue));
      // },

      // unassignedIssuesWithCommits: function() {
      //   return this.unassignedIssues.filter(issue => this.hasCommits(issue));
      // },

      // unassignedIssuesWithComments: function() {
      //   return this.unassignedIssues.filter(issue => this.hasComments(issue));
      // },

      // metrics: function() {
      //   let data = {
      //     aip: 0, // assigned issues participation
      //     naip: 0, // non-assigned issues participation
      //     cai: 0, // closed assigned issues
      //     ncai: 0, // non-closed assigned issues
      //     aif: 0, // assigned issues factor
      //     wd: 0
      //   };

      //   let round = v => Math.round(v * 100) / 100;
      //   let getDay = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

      //   data.aip = this.sprint.getUserAssignedIssues(this.user.login)
      //     .filter(issue => this.hasCommits(issue) || this.hasComments(issue))
      //     .length;
      //   data.naip = this.unassignedIssues
      //     .filter(issue => this.hasCommits(issue) || this.hasComments(issue))
      //     .length;
      //   data.cai = this.closedIssues.length;
      //   data.ncai = this.openIssues.length;

      //   // data.aif = this.assignments.length / (this.countUsers(this.assignments) || 1);

      //   return data;
      // }
    },
    methods: {
      list: function(issues) {
        // console.log(issues.map(i => parseInt(i.number)));
        return issues
          .map(i => parseInt(i.number))
          .sort((a, b) => a - b)
          .join(", ");
      },

      // hasCommits: function(issue) {
      //   return this.commits.filter(commit => {
      //     return commit._issue && commit._issue.number == issue.number;
      //   }).length > 0;
      // },
      // hasComments: function(issue) {
      //   return issue.comments > 0 &&
      //     issue._comments_data.map(c => c.id).filter(c_id => {
      //       return this.comments.map(c => c.id).includes(c_id);
      //     }).length > 0;
      // },
      // countUsers: function(issues) {
      //   let logins = Object.keys(this.sprint.user_assignments);
      //   logins = logins.filter(login => {
      //     return issues.filter(issue => {
      //       return this.sprint.user_assignments[login].map(i => i.number).includes(issue.number);
      //     }).length > 0;
      //   });
      //   return logins.length;
      // },
    }
  }
</script>