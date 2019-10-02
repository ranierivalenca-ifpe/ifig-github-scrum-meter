<template>
  <div id="project-data">
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
            <!-- <data-row v-for="user in users"
              v-if="['ranierivalenca', 'lilialnas'].includes(user.login)"
              v-bind:extra-class="'teacher'"
              v-bind:user="user"
              v-bind:commits="sprint.user_commits[user.login]"
              v-bind:comments="sprint.user_comments[user.login]"
              v-bind:assignments="sprint.user_assignments[user.login]"
              v-bind:sprint="sprint">
            </data-row> -->

            <!--<data-row v-for="user in project.users"
              v-if="['ranierivalenca', 'lilialnas'].indexOf(user.login) != -1"
              v-bind:extra-class="'teacher'"
              v-bind:user="user"
              v-bind:commits="getCommits(user.id)"
              v-bind:comments="getComments(user.id)"
              v-bind:open-issues="getOpenIssues(user.id)"
              v-bind:closed-issues="getClosedIssues(user.id)"
              v-bind:assigned-commits="getAssignedWithCommits(user.id)"
              v-bind:assigned-comments="getAssignedWithComments(user.id)"
              v-bind:unassigned-commits="getUnassignedWithCommits(user.id)"
              v-bind:unassigned-comments="getUnassignedWithCommits(user.id)"
              v-bind:parameters="parameters(user.id)">
            </data-row>
          </div>
          <div class="total">
            <div class="row">
              <div class="data"></div>
              <div class="data commits">{{sprintCommits.length}}</div>
              <div class="data comments">{{sprintComments.length}}</div>

              <div class="data open">{{sprintOpenIssues.length}}</div>
              <div class="data closed">{{sprintClosedIssues.length}}</div>

              <div class="data commits"></div>
              <div class="data comments"></div>

              <div class="data commits"></div>
              <div class="data comments"></div>
            </div>
          </div>-->
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

        watcher: {
          requests: [],
          completed: []
        },

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

      // projectComments: function() {
      //   return this.project.issues.map(issue => issue._comments_data).flat();
      // },


      // sprintCommits: function() {
      //   return Object.values(this.sprint.user_commits).flat();
      // },
      // sprintComments: function() {
      //   return Object.values(this.sprint.user_comments).flat();
      // },

      // users: function() {
      //   return Object.values(this.project.users).sort(
      //     (u1, u2) => u1.login.localeCompare(u2.login)
      //   );
      // },


      // sprintOpenIssues: function() {
      //   return issues = this.users
      //     .map( u => this.getOpenIssues(u.id) )
      //     .flat()
      //     .filter( (val, index, self) => self.indexOf(val) === index );
      // },
      // sprintClosedIssues: function() {
      //   return issues = this.users
      //     .map( u => this.getClosedIssues(u.id) )
      //     .flat()
      //     .filter( (val, index, self) => self.indexOf(val) === index );
      // }
    },
    methods: {
      setSprint: function(sprint) {
        this.sprint = sprint
      },
      formatDate: function(date) {
        return new Date(date).toLocaleString();
      }
      // loadProjectData: function(reload) {
      //   if (!this.project) return;
      //   if (this.project.has_loaded && !reload) {
      //     this.sprint = this.project.sprints[this.project.sprints.length - 1];
      //     return;
      //   }
      //   this.resetProjectData();

      //   this.loaded = false;
      //   this.loading = true;

      //   let repo = this.project.repo;

      //   let issues_url = `https://api.github.com/repos/${repo}/issues?state=all`;
      //   let commits_url = `https://api.github.com/repos/${repo}/commits`;
      //   // let comments_url = `https://api.github.com/repos/${repo}/comments`;

      //   let data_status = {
      //     issues: false,
      //     commits: false,
      //     comments: true,
      //   };

      //   getGithubData(issues_url, this.watcher, reload).then((data) => {
      //     for (issue of data) {
      //       ((issue) => {
      //         issue._events        = [];
      //         issue._comments_data = [];
      //         issue._commits_sha   = [];

      //         var eventsCompleted = false;
      //         var commentsCompleted = (issue.comments == 0);

      //         getGithubData(issue.events_url, this.watcher, reload).then(data => {
      //           issue._events = data;
      //           issue._events
      //             .filter(e => e.event == 'referenced')
      //             .map(event => {
      //               issue._commits_sha.push(event.commit_id);
      //             })
      //           eventsCompleted = true;
      //         });
      //         if (!commentsCompleted) {
      //           getGithubData(issue.comments_url, this.watcher, reload).then((data) => {
      //             issue._comments_data = data;
      //             commentsCompleted = true;
      //           });
      //         }

      //         wait(
      //           () => (eventsCompleted && commentsCompleted)
      //         ).then(
      //           () => {
      //             issue._comments_data.map(comment => {
      //               this.addUser(comment.user);
      //             });
      //             this.project.issues[issue.number] = issue;
      //           }
      //         );
      //       })(issue);
      //     }
      //     wait( () => Object.values(this.project.issues).length == data.length ).then(() => {
      //       data_status.issues = true;
      //     });
      //   });

      //   getGithubData(commits_url, this.watcher, reload).then((data) => {
      //     data.map(commit => {
      //       if (!commit.commit || !commit.author) return;
      //       this.project.commits[commit.sha] = commit;
      //       this.addUser(commit.author);
      //     });

      //     data_status.commits = true;
      //   });

      //   // getGithubData(comments_url, this.watcher, reload).then((data) => {
      //   //   this.comments = data;
      //   //   data_status.comments = true;
      //   // });

      //   wait( () => data_status.issues && data_status.commits && data_status.comments ).then(() => {

      //     Object.values(this.project.issues).map(issue => {
      //       issue._commits_sha.map(sha => {
      //         if (!this.project.commits[sha]) return;
      //         this.project.commits[sha]._issue = issue;
      //       });
      //     });

      //     this.loadSprintsData();

      //     this.sprint = this.project.sprints[this.project.sprints.length - 1];

      //     this.project.has_loaded = true;
      //     this.loaded = true;
      //     this.loading = false;
      //   });
      // },

      // resetProjectData: function() {
      //   this.project.commits = {};
      //   this.project.issues  = {};
      //   this.project.users   = {};

      //   this.watcher = {
      //     requests: [],
      //     completed: []
      //   };
      // },

      // loadSprintsData: function() {
      //   this.project.sprints.map(sprint => {
      //     Object.values(this.project.users).map(user => {
      //       sprint.user_commits[user.login]     = [];
      //       sprint.user_comments[user.login]    = [];
      //       sprint.user_assignments[user.login] = {}; // temp object for improve pushing time
      //     });
      //     Object.values(this.project.issues).map(issue => {
      //       issue._events
      //         .filter(e => getTime(e.created_at) <= getTime(sprint.to))
      //         .map(e => {
      //           switch (e.event) {
      //             case 'milestoned':
      //               if (isIn(e.milestone.title, sprint.milestones)) {
      //                 sprint.issues[issue.number] = issue;
      //               }
      //               break;
      //             case 'demilestoned':
      //               if (isIn(e.milestone.title, sprint.milestones)) {
      //                 delete sprint.issues[issue.number];
      //               }
      //               break;
      //             case 'assigned':
      //               sprint.user_assignments[e.assignee.login][issue.number] = issue;
      //               break;
      //             case 'unassigned':
      //               delete sprint.user_assignments[e.assignee.login][issue.number];
      //               break;
      //           }
      //         });
      //       issue._commits_sha
      //         .map(c_sha => this.project.commits[c_sha])
      //         .filter(c => c && this.inSprintRange(c.commit.author.date, sprint))
      //         .map(c => {
      //           sprint.user_commits[c.author.login].push(c);
      //         });
      //       issue._comments_data
      //         .filter(c => this.inSprintRange(c.created_at, sprint))
      //         .map(c => {
      //           sprint.user_comments[c.user.login].push(c);
      //         });
      //     });

      //     Object.values(this.project.users).map(user => {
      //       sprint.user_assignments[user.login] = Object.values(sprint.user_assignments[user.login])
      //         .filter(i => sprint.issues[i.number]);
      //     });
      //   });
      // },










      // setSprint: function(sprint) {
      //   this.sprint = sprint;
      // },
      // createSnapshots: function() {
      //   this.project.issues

      //   for (sprint of this.project.sprints) {
      //     sprint.snapshot.issues = this.getSprintIssues(sprint);

      //     sprint.snapshot.user_commits = this.getSprintCommits(sprint);
      //     sprint.snapshot.user_comments = this.getSprintComments(sprint);
      //     sprint.snapshot.user_issues = this.getSprintAssignes(sprint);
      //   }

      //   this.sprint = this.project.sprints[this.project.sprints.length - 1];

      //   this.loaded = true;
      //   this.loading = false;
      // },



      // inSprintRange: function(dateString, sprint) {
      //   return getTime(dateString) > getTime(sprint.from) && getTime(dateString) <= getTime(sprint.to);
      // },







      // getSprintCommits: function(sprint) {
      //   var data = {};
      //   this.users.map(u => {
      //     data[u.id] = [];
      //     if (!this.user_commits[u.id]) return;
      //     data[u.id] = this.user_commits[u.id]
      //       .filter(commit => this.inSprintRange(commit.commit.author.date, sprint));
      //   });
      //   return data;
      // },
      // getSprintComments: function(sprint) {
      //   var data = {};
      //   this.users.map(u => {
      //     data[u.id] = [];
      //     if (!this.user_comments[u.id]) return;
      //     data[u.id] = this.user_comments[u.id]
      //       .filter(comment => this.inSprintRange(comment.created_at, sprint));
      //   });
      //   return data;
      // },
      // getSprintAssignes: function(sprint) {
      //   var data = {};
      //   this.users.map(u => {
      //     data[u.id] = [];
      //   });
      //   Object.values(sprint.snapshot.issues).map(issue => {
      //     issue.events
      //       .filter(e =>
      //         (e.event == 'assigned' || e.event == 'unassigned') &&
      //         getTime(e.created_at) <= getTime(sprint.to)
      //       )
      //       .map(event => {
      //         var u_id = event.assignee.id;
      //         switch(event.event) {
      //           case 'assigned':
      //             if (!data[u_id]) {
      //               this.addUser(event.assignee);
      //               data[u_id] = [];
      //             }
      //             if (data[u_id].filter(i => i.number == issue.number).length == 0) {
      //               data[u_id].push(issue);
      //             }
      //             break;
      //           case 'unassigned':
      //             // data[u_id].splice(data[u_id].indexOf(issue.number), 1);
      //             data[u_id] = data[u_id].filter(i => i.number != issue.number);
      //             break;
      //         }
      //       });
      //   });
      //   return data;
      // },
      // getSprintIssues: function(sprint) {
      //   var data = {};
      //   this.issues.map(issue => {
      //     issue.events
      //       .filter(e =>
      //         e.event == 'milestoned' && getTime(e.created_at) <= getTime(sprint.to)
      //       )
      //       .map(e => {
      //         // console.log(e.milestone.title, e.event, e);
      //         // console.log(e.milestone.title, sprint.milestones, e.milestone.title in sprint.milestones);
      //         if (sprint.milestones.indexOf(e.milestone.title) != -1) {
      //           // console.log(`adding issue ${issue.number} to sprint ${sprint.title}`);
      //           data[issue.number] = issue;
      //           return;
      //         }
      //         // console.log(`deleting issue ${issue.number} from sprint ${sprint.title}`);
      //         delete data[issue.number];
      //       });
      //   });
      //   // console.log(data);
      //   // console.log(data);
      //   return data;
      // },




      // parameters: function(user_id) {
      //   data = {
      //     aip: 0, // assigned issues participation
      //     naip: 0, // non-assigned issues participation
      //     cai: 0, // closed assigned issues
      //     ncai: 0, // non-closed assigned issues
      //     aif: 0, // assigned issues factor
      //     wd: 0
      //   };

      //   var user_issues = this.sprint.snapshot.user_issues[user_id] || [];
      //   var user_commits = this.sprint.snapshot.user_commits[user_id] || [];
      //   var user_comments = this.sprint.snapshot.user_comments[user_id] || [];

      //   let round = v => Math.round(v * 100) / 100;
      //   let formatDate = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

      //   data.aip = user_issues.filter(issue => {
      //     return (
      //       user_commits.filter(commit => {
      //         return issue.commits.indexOf(commit.sha) != -1;
      //       }).length > 0 ||
      //       (
      //         issue.comments > 0 &&
      //         user_comments.filter(comment => {
      //           return issue.comments_data.map(c => c.id).indexOf(comment.id) != -1;
      //         }).length > 0
      //       )
      //     );
      //   }).length;

      //   data.naip = this.issues.filter(issue => {
      //     return user_issues.map(i => i.number).indexOf(issue.number) == -1 &&
      //       (
      //         user_commits.filter(commit => {
      //           return issue.commits.indexOf(commit.sha) != -1;
      //         }).length > 0 ||
      //         (
      //           issue.comments > 0 &&
      //           user_comments.filter(comment => {
      //             return issue.comments_data.map(c => c.id).indexOf(comment.id) != -1;
      //           }).length > 0
      //         )
      //       );
      //   }).length;

      //   data.cai = this.getClosedIssues(user_id).length;
      //   data.ncai = this.getOpenIssues(user_id).length;

      //   data.aif = user_issues.length / (
      //     this.users.filter(user => {
      //       return this.sprint.snapshot.user_issues[user.id]
      //         .map(issue => issue.number)
      //         .filter(issueNumber => {
      //           return user_issues.map(i => i.number).indexOf(issueNumber) != -1;
      //         }).length > 0;
      //     }).length || 1
      //   );
      //   data.aif = round(data.aif);

      //   data.wd = [
      //     user_commits.map( commit => formatDate(new Date(commit.commit.author.date)) ),
      //     user_comments.map( comment => formatDate(new Date(comment.created_at)) )
      //   ].flat().filter((val, index, self) => self.indexOf(val) === index).length;

      //   data.participation = Math.max(
      //     // 0,
      //     this.coefs.aip * data.aip +
      //     this.coefs.naip * data.naip +
      //     this.coefs.cai * data.cai +
      //     this.coefs.ncai * data.ncai
      //   ) * data.aif;
      //   data.compromise = data.wd / 5;

      //   data.participation = round(data.participation);
      //   data.compromise = round(data.compromise);
      //   return data;
      // },







      // getSprint: function() {
      //   return this.sprint;
      // },
      // getCommits: function(user_id) {
      //   return this.sprint.snapshot.user_commits[user_id] || [];
      // },
      // getComments: function(user_id) {
      //   return this.sprint.snapshot.user_comments[user_id] || [];
      // },
      // getOpenIssues: function(user_id) {
      //   var issues = this.sprint.snapshot.user_issues[user_id] || [];
      //   return issues.filter(issue => {
      //     return issue.state == 'open' ||
      //       getTime(issue.closed_at) > getTime(this.sprint.to);
      //   });
      // },
      // getClosedIssues: function(user_id) {
      //   var issues = this.sprint.snapshot.user_issues[user_id] || [];
      //   return issues.filter(issue => {
      //     return issue.state == 'closed' &&
      //       getTime(issue.closed_at) < getTime(this.sprint.to);
      //   });
      // },
      // getAssignedWithCommits: function(user_id) {
      //   var issues = this.sprint.snapshot.user_issues[user_id] || [];
      //   return issues.filter(issue => {
      //     return (this.sprint.snapshot.user_commits[user_id] || []).filter(commit => {
      //       return issue.commits.indexOf(commit.sha) != -1;
      //     }).length > 0;
      //   });
      // },
      // getAssignedWithComments: function(user_id) {
      //   var issues = this.sprint.snapshot.user_issues[user_id] || [];
      //   return issues.filter(issue => {
      //     return issue.comments > 0 &&
      //       (this.sprint.snapshot.user_comments[user_id] || []).filter(comment => {
      //         return issue.comments_data.map(c => c.id).indexOf(comment.id) != -1;
      //       }).length > 0;
      //   });
      // },
      // getUnassignedWithCommits: function(user_id) {
      //   var issues = this.issues.filter(issue => {
      //     return (this.sprint.snapshot.user_issues[user_id] || [])
      //       .map(i => i.number)
      //       .indexOf(issue.number) == -1;
      //   });
      //   return issues.filter(issue => {
      //     return (this.sprint.snapshot.user_commits[user_id] || []).filter(commit => {
      //       return issue.commits.indexOf(commit.sha) != -1;
      //     }).length > 0;
      //   });
      // },
      // getUnassignedWithComments: function(user_id) {
      //   var issues = this.issues.filter(issue => {
      //     return (this.sprint.snapshot.user_issues[user_id] || [])
      //       .map(i => i.number)
      //       .indexOf(issue.number) == -1;
      //   });
      //   return issues.filter(issue => {
      //     return issue.comments > 0 &&
      //       (this.sprint.snapshot.user_comments[user_id] || []).filter(comment => {
      //         return issue.comments_data.map(c => c.id).indexOf(comment.id) != -1;
      //       }).length > 0;
      //   });
      // },






      // addUser: function(user) {
      //   if (!user || !user.id) return;
      //   this.project.users[user.login] = user;
      //   // if (this.project.users.filter(u => u.id == user.id).length == 0) {
      //   //   this.project.users.push(user);
      //   // }
      //   // this.users = this.users.sort((a, b) => a.login.localeCompare(b.login));
      //   // this.should_update_period = true;
      // },

    }
  }
</script>