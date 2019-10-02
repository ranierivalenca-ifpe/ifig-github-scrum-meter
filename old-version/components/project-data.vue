<template>
  <div id="project-data">
    <div id="loader" v-if="loading">
      Total Requests: <span>{{completedRequests.length}} / {{requests.length}}</span>
      <div class="progress">
        <div class="bar"
          :style="`width:${100 * completedRequests.length / Math.max(requests.length, 1)}%`"></div>
      </div>
    </div>

    <div class="project-summary">

    </div>

    <div v-if="loaded && project">
      <span class="renew" v-on:click.prevent="loadProjectData(true)">
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

      <div class="sprint-data">
        <div class="data">
          Interval:
          <span>
          {{ new Date(sprint.from).toLocaleString() }} ~ {{new Date(sprint.to).  toLocaleString() }}
          </span>
        </div>
        <div class="data">
          Total Issues:
          <span>
            {{ Object.values(sprint.snapshot.issues).length }}
          </span>
        </div>
        <div class="data">
          Total Commits:
          <span class="commits">
            {{ Object.values(sprint.snapshot.user_commits).flat().length }}
          </span>
        </div>
        <div class="data">
          Total Comments:
          <span class="comments">
            {{ Object.values(sprint.snapshot.user_comments).flat().length }}
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

        <div class="body" :key="sprint.id">
          <data-row v-for="user in users"
            v-if="['ranierivalenca', 'lilialnas'].indexOf(user.login) == -1"
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
          <data-row v-for="user in users"
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

        milestones: [],
        commits: [],
        issues: [],
        users: [],
        comments: [],

        user_commits: {},
        user_comments: {},

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
    props: ['project'],
    mounted() {
      // console.log('montado');
    },
    watch: {
      project: function(newVal, oldVal) {
        // console.log('carregando');
        this.loadProjectData();
      }
    },
    computed: {
      requests: function() {
        return this.watcher.requests;
      },
      completedRequests: function() {
        return this.watcher.completed;
      },
      sprintCommits: function() {
        if (!this.sprint.snapshot.user_commits) return [];
        return Object.values(this.sprint.snapshot.user_commits).flat();
      },
      sprintComments: function() {
        if (!this.sprint.snapshot.user_comments) return [];
        return Object.values(this.sprint.snapshot.user_comments).flat();
      },
      sprintOpenIssues: function() {
        return issues = this.users
          .map( u => this.getOpenIssues(u.id) )
          .flat()
          .filter( (val, index, self) => self.indexOf(val) === index );
      },
      sprintClosedIssues: function() {
        return issues = this.users
          .map( u => this.getClosedIssues(u.id) )
          .flat()
          .filter( (val, index, self) => self.indexOf(val) === index );
      }
    },
    methods: {
      setSprint: function(sprint) {
        this.sprint = sprint;
      },
      createSnapshots: function() {
        for (sprint of this.project.sprints) {
          sprint.snapshot.issues = this.getSprintIssues(sprint);

          sprint.snapshot.user_commits = this.getSprintCommits(sprint);
          sprint.snapshot.user_comments = this.getSprintComments(sprint);
          sprint.snapshot.user_issues = this.getSprintAssignes(sprint);
        }

        this.sprint = this.project.sprints[this.project.sprints.length - 1];

        this.loaded = true;
        this.loading = false;
      },



      inSprintRange: function(dateString, sprint) {
        return getTime(dateString) > getTime(sprint.from) && getTime(dateString) <= getTime(sprint.to);
      },







      getSprintCommits: function(sprint) {
        var data = {};
        this.users.map(u => {
          data[u.id] = [];
          if (!this.user_commits[u.id]) return;
          data[u.id] = this.user_commits[u.id]
            .filter(commit => this.inSprintRange(commit.commit.author.date, sprint));
        });
        return data;
      },
      getSprintComments: function(sprint) {
        var data = {};
        this.users.map(u => {
          data[u.id] = [];
          if (!this.user_comments[u.id]) return;
          data[u.id] = this.user_comments[u.id]
            .filter(comment => this.inSprintRange(comment.created_at, sprint));
        });
        return data;
      },
      getSprintAssignes: function(sprint) {
        var data = {};
        this.users.map(u => {
          data[u.id] = [];
        });
        Object.values(sprint.snapshot.issues).map(issue => {
          issue.events
            .filter(e =>
              (e.event == 'assigned' || e.event == 'unassigned') &&
              getTime(e.created_at) <= getTime(sprint.to)
            )
            .map(event => {
              var u_id = event.assignee.id;
              switch(event.event) {
                case 'assigned':
                  if (!data[u_id]) {
                    this.addUser(event.assignee);
                    data[u_id] = [];
                  }
                  if (data[u_id].filter(i => i.number == issue.number).length == 0) {
                    data[u_id].push(issue);
                  }
                  break;
                case 'unassigned':
                  // data[u_id].splice(data[u_id].indexOf(issue.number), 1);
                  data[u_id] = data[u_id].filter(i => i.number != issue.number);
                  break;
              }
            });
        });
        return data;
      },
      getSprintIssues: function(sprint) {
        var data = {};
        this.issues.map(issue => {
          issue.events
            .filter(e =>
              e.event == 'milestoned' && getTime(e.created_at) <= getTime(sprint.to)
            )
            .map(e => {
              // console.log(e.milestone.title, e.event, e);
              // console.log(e.milestone.title, sprint.milestones, e.milestone.title in sprint.milestones);
              if (sprint.milestones.indexOf(e.milestone.title) != -1) {
                // console.log(`adding issue ${issue.number} to sprint ${sprint.title}`);
                data[issue.number] = issue;
                return;
              }
              // console.log(`deleting issue ${issue.number} from sprint ${sprint.title}`);
              delete data[issue.number];
            });
        });
        // console.log(data);
        // console.log(data);
        return data;
      },




      parameters: function(user_id) {
        data = {
          aip: 0, // assigned issues participation
          naip: 0, // non-assigned issues participation
          cai: 0, // closed assigned issues
          ncai: 0, // non-closed assigned issues
          aif: 0, // assigned issues factor
          wd: 0
        };

        var user_issues = this.sprint.snapshot.user_issues[user_id] || [];
        var user_commits = this.sprint.snapshot.user_commits[user_id] || [];
        var user_comments = this.sprint.snapshot.user_comments[user_id] || [];

        let round = v => Math.round(v * 100) / 100;
        let formatDate = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

        data.aip = user_issues.filter(issue => {
          return (
            user_commits.filter(commit => {
              return issue.commits.indexOf(commit.sha) != -1;
            }).length > 0 ||
            (
              issue.comments > 0 &&
              user_comments.filter(comment => {
                return issue.comments_obj.map(c => c.id).indexOf(comment.id) != -1;
              }).length > 0
            )
          );
        }).length;

        data.naip = this.issues.filter(issue => {
          return user_issues.map(i => i.number).indexOf(issue.number) == -1 &&
            (
              user_commits.filter(commit => {
                return issue.commits.indexOf(commit.sha) != -1;
              }).length > 0 ||
              (
                issue.comments > 0 &&
                user_comments.filter(comment => {
                  return issue.comments_obj.map(c => c.id).indexOf(comment.id) != -1;
                }).length > 0
              )
            );
        }).length;

        data.cai = this.getClosedIssues(user_id).length;
        data.ncai = this.getOpenIssues(user_id).length;

        data.aif = user_issues.length / (
          this.users.filter(user => {
            return this.sprint.snapshot.user_issues[user.id]
              .map(issue => issue.number)
              .filter(issueNumber => {
                return user_issues.map(i => i.number).indexOf(issueNumber) != -1;
              }).length > 0;
          }).length || 1
        );
        data.aif = round(data.aif);

        data.wd = [
          user_commits.map( commit => formatDate(new Date(commit.commit.author.date)) ),
          user_comments.map( comment => formatDate(new Date(comment.created_at)) )
        ].flat().filter((val, index, self) => self.indexOf(val) === index).length;

        data.participation = Math.max(
          // 0,
          this.coefs.aip * data.aip +
          this.coefs.naip * data.naip +
          this.coefs.cai * data.cai +
          this.coefs.ncai * data.ncai
        ) * data.aif;
        data.compromise = data.wd / 5;

        data.participation = round(data.participation);
        data.compromise = round(data.compromise);
        return data;
      },







      getSprint: function() {
        return this.sprint;
      },
      getCommits: function(user_id) {
        return this.sprint.snapshot.user_commits[user_id] || [];
      },
      getComments: function(user_id) {
        return this.sprint.snapshot.user_comments[user_id] || [];
      },
      getOpenIssues: function(user_id) {
        var issues = this.sprint.snapshot.user_issues[user_id] || [];
        return issues.filter(issue => {
          return issue.state == 'open' ||
            getTime(issue.closed_at) > getTime(this.sprint.to);
        });
      },
      getClosedIssues: function(user_id) {
        var issues = this.sprint.snapshot.user_issues[user_id] || [];
        return issues.filter(issue => {
          return issue.state == 'closed' &&
            getTime(issue.closed_at) < getTime(this.sprint.to);
        });
      },
      getAssignedWithCommits: function(user_id) {
        var issues = this.sprint.snapshot.user_issues[user_id] || [];
        return issues.filter(issue => {
          return (this.sprint.snapshot.user_commits[user_id] || []).filter(commit => {
            return issue.commits.indexOf(commit.sha) != -1;
          }).length > 0;
        });
      },
      getAssignedWithComments: function(user_id) {
        var issues = this.sprint.snapshot.user_issues[user_id] || [];
        return issues.filter(issue => {
          return issue.comments > 0 &&
            (this.sprint.snapshot.user_comments[user_id] || []).filter(comment => {
              return issue.comments_obj.map(c => c.id).indexOf(comment.id) != -1;
            }).length > 0;
        });
      },
      getUnassignedWithCommits: function(user_id) {
        var issues = this.issues.filter(issue => {
          return (this.sprint.snapshot.user_issues[user_id] || [])
            .map(i => i.number)
            .indexOf(issue.number) == -1;
        });
        return issues.filter(issue => {
          return (this.sprint.snapshot.user_commits[user_id] || []).filter(commit => {
            return issue.commits.indexOf(commit.sha) != -1;
          }).length > 0;
        });
      },
      getUnassignedWithComments: function(user_id) {
        var issues = this.issues.filter(issue => {
          return (this.sprint.snapshot.user_issues[user_id] || [])
            .map(i => i.number)
            .indexOf(issue.number) == -1;
        });
        return issues.filter(issue => {
          return issue.comments > 0 &&
            (this.sprint.snapshot.user_comments[user_id] || []).filter(comment => {
              return issue.comments_obj.map(c => c.id).indexOf(comment.id) != -1;
            }).length > 0;
        });
      },






      addUser: function(user) {
        if (!user || !user.id) return;
        if (this.users.filter(u => u.id == user.id).length == 0) {
          this.users.push(user);
        }
        this.users = this.users.sort((a, b) => a.login.localeCompare(b.login));
        this.should_update_period = true;
      },







      resetProjectData: function() {
        this.milestones = [];
        this.commits    = [];
        this.issues     = [];
        this.users      = [];
        this.comments   = [];

        this.user_commits  = {};
        this.user_comments = {};

        this.watcher = {
          requests: [],
          completed: []
        };
      },
      loadProjectData: function(reload) {
        if (!this.project) return;
        this.resetProjectData();

        this.loaded = false;
        this.loading = true;

        let repo = this.project.repo;

        let issues_url = `https://api.github.com/repos/${repo}/issues?state=all`;
        let commits_url = `https://api.github.com/repos/${repo}/commits`;
        // let comments_url = `https://api.github.com/repos/${repo}/comments`;

        let data_status = {
          issues: false,
          commits: false,
          comments: true,
        };

        getGithubData(issues_url, this.watcher, reload).then((data) => {
          for (issue of data) {
            ((issue) => {
              if (issue.milestone != null) {
                let milestone = issue.milestone;
                let id = milestone.id;
                // console.log(milestone);
                if (this.milestones.filter(m => m.id == id).length == 0) {
                  this.milestones.push(milestone);
                }
                // app.milestones = app.milestones.concat(milestone);
                // app.milestones[milestone.id] = milestone;
              }
              var eventsCompleted = false;
              var commentsCompleted = (issue.comments == 0);

              getGithubData(issue.events_url, this.watcher, reload).then(data => {
                issue.events = data;
                eventsCompleted = true;
              });
              if (!commentsCompleted) {
                getGithubData(issue.comments_url, this.watcher, reload).then((data) => {
                  issue.comments_obj = data;
                  this.comments.push(data);
                  commentsCompleted = true;
                });
              }

              wait(
                () => (eventsCompleted && commentsCompleted)
              ).then(
                () => {
                  if (issue.comments > 0) {
                    // console.log(issue);
                    issue.comments_obj.map(comment => {
                      this.addUser(comment.user);
                      if (!this.user_comments[comment.user.id]) {
                        this.user_comments[comment.user.id] = [];
                      }
                      this.user_comments[comment.user.id].push(comment);
                    })
                  }
                  issue.commits = [];
                  // console.log(issue.number, issue.events.map(e => e.event));
                  issue.events.filter(e => e.event == 'referenced').map(e => {
                    // console.log(`commit pushed on issue ${issue.number}`);
                    // console.log(e);
                    issue.commits.push(e.commit_id);
                  });
                  this.issues.push(issue);
                }
              );
            })(issue);
          }
          wait( () => this.issues.length == data.length ).then(() => {
            this.comments = this.comments.flat();
            data_status.issues = true;
          });
        });

        getGithubData(commits_url, this.watcher, reload).then((data) => {
          this.commits = data;
          for (commit of this.commits) {
            // if (commit.author && commit.author.login && commit.committer && commit.committer.login && commit.author.login == commit.committer.login) {
            //   continue;
            // }
            if (!commit.commit || !commit.author) {
              continue;
            }
            this.addUser(commit.author);

            if (!this.user_commits[commit.author.id]) {
              this.user_commits[commit.author.id] = [];
            }
            this.user_commits[commit.author.id].push(commit);
          }
          this.users = this.users.sort((a, b) => a.login.localeCompare(b.login));
          data_status.commits = true;
        });

        // getGithubData(comments_url, this.watcher, reload).then((data) => {
        //   this.comments = data;
        //   data_status.comments = true;
        // });

        // console.log(data_status);
        wait( () => data_status.issues && data_status.commits && data_status.comments ).then(() => {
          this.createSnapshots();
        });
      }
    }
  }
</script>