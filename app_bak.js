let app = new Vue({
  el: '#app',
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
            to: '2019-09-17T08:00:00'
          },
          {
            title: 'Sprint 2',
            milestones: ['Sprint 2'],
            from: '2019-09-17T09:30:00',
            to: '2019-09-24T09:15:00'
          }
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
            to: '2019-09-24T08:00:00'
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
            to: '2019-09-25T12:50:00'
          }
        ]
      }
    ],

    current_project: null,



    // message: 'Hello'
    milestones: [],
    commits: [],
    issues: [],
    users: [],
    comments: [],

    user_commits: {},
    user_comments: {},

    sprints: [
      {
        title: 'Sprint 1',
        milestones: ['Sprint 1'],
        from: '2019-09-10T00:00:00',
        to: '2019-09-17T08:00:00',
        snapshot: {
          user_commits: {},
          user_comments: {},
          user_issues: {},
          issues: {}
        }
      },
      {
        title: 'Sprint 2',
        milestones: ['Sprint 2'],
        from: '2019-09-17T09:30:00',
        to: '2019-09-24T09:15:00',
        snapshot: {
          user_commits: {},
          user_comments: {},
          user_issues: {},
          issues: {}
        }
      }
    ],
    current_sprint: 0,

    from_date: '2019-09-10T00:00:00',
    to_date: '2019-09-24T23:00:00',
    render_key: 0,
  },
  watch: {
    from_date: function(oldV, newV) {
      this.should_update_period = true;
    },
    to_date: function(oldV, newV) {
      this.should_update_period = true;
    }
  },
  methods: {
    setSprint: function(sprint) {
      this.current_sprint = sprint;
    },
    createSnapshots: function() {
      for (sprint of this.sprints) {
        console.log(sprint);
        sprint.snapshot.user_commits = this.getSprintCommits(sprint);
        sprint.snapshot.user_comments = this.getSprintComments(sprint);
        sprint.snapshot.user_issues = this.getSprintAssignes(sprint);
        sprint.snapshot.issues = this.getSprintIssues(sprint);
      }
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
      this.issues.map(issue => {
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
              data[issue.id] = issue;
              return;
            }
            delete data[issue.id];
          });
      });
      // console.log(data);
      return data;
    },







    getSprint: function() {
      return this.sprints[this.current_sprint];
    },
    getCommits: function(user_id) {
      return this.getSprint().snapshot.user_commits[user_id] || [];
    },
    getComments: function(user_id) {
      return this.getSprint().snapshot.user_comments[user_id] || [];
    },
    getOpenIssues: function(user_id) {
      var issues = this.getSprint().snapshot.user_issues[user_id] || [];
      return issues.filter(issue => {
        return issue.state == 'open' ||
          getTime(issue.closed_at) > getTime(this.getSprint().to);
      });
    },
    getClosedIssues: function(user_id) {
      var issues = this.getSprint().snapshot.user_issues[user_id] || [];
      return issues.filter(issue => {
        return issue.state == 'closed' &&
          getTime(issue.closed_at) < getTime(this.getSprint().to);
      });
    },
    getAssignedWithCommits: function(user_id) {
      var issues = this.getSprint().snapshot.user_issues[user_id] || [];
      return issues.filter(issue => {
        return (this.getSprint().snapshot.user_commits[user_id] || []).filter(commit => {
          return issue.commits.indexOf(commit.sha) != -1;
        }).length > 0;
      });
    },
    getAssignedWithComments: function(user_id) {
      var issues = this.getSprint().snapshot.user_issues[user_id] || [];
      return issues.filter(issue => {
        return issue.comments > 0 &&
          (this.getSprint().snapshot.user_comments[user_id] || []).filter(comment => {
            return issue.comments_obj.map(c => c.id).indexOf(comment.id) != -1;
          }).length > 0;
      });
    },
    getUnassignedWithCommits: function(user_id) {
      var issues = this.issues.filter(issue => {
        return (this.getSprint().snapshot.user_issues[user_id] || [])
          .map(i => i.number)
          .indexOf(issue.number) == -1;
      });
      return issues.filter(issue => {
        return (this.getSprint().snapshot.user_commits[user_id] || []).filter(commit => {
          return issue.commits.indexOf(commit.sha) != -1;
        }).length > 0;
      });
    },
    getUnassignedWithComments: function(user_id) {
      var issues = this.issues.filter(issue => {
        return (this.getSprint().snapshot.user_issues[user_id] || [])
          .map(i => i.number)
          .indexOf(issue.number) == -1;
      });
      return issues.filter(issue => {
        return issue.comments > 0 &&
          (this.getSprint().snapshot.user_comments[user_id] || []).filter(comment => {
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
    }
  },




  mounted: function() {
    let app = this;

    // let repo = 'Murielson/SGM';
    // let repo = 'KevinSousa/ctic';
    // let repo = 'gmatheus66/OSON';
    let repo = 'gmatheus66/reqon';
    let all_milestones_url = `https://api.github.com/repos/${repo}/milestones?state=all`;
    let all_issues_url = `https://api.github.com/repos/${repo}/issues?state=all`;

    let commits_url = `https://api.github.com/repos/${repo}/commits`;
    let comments_url = `https://api.github.com/repos/${repo}/comments`;

    let data_status = {
      issues: false,
      commits: false,
      comments: false
    };

    getGithubData(all_issues_url).then((data) => {
      for (issue of data) {
        ((issue) => {
          if (issue.milestone != null) {
            let milestone = issue.milestone;
            let id = milestone.id;
            // console.log(milestone);
            if (app.milestones.filter(m => m.id == id).length == 0) {
              app.milestones.push(milestone);
            }
            // app.milestones = app.milestones.concat(milestone);
            // app.milestones[milestone.id] = milestone;
          }
          var eventsCompleted = false;
          var commentsCompleted = (issue.comments == 0);

          getGithubData(issue.events_url).then(data => {
            issue.events = data;
            eventsCompleted = true;
          });
          if (!commentsCompleted) {
            getGithubData(issue.comments_url).then((data) => {
              issue.comments_obj = data;
              commentsCompleted = true;
            });
          }

          wait( () => (eventsCompleted && commentsCompleted) ).then(() => {

            if (issue.comments > 0) {
              // console.log(issue);
              for (comment of issue.comments_obj) {
                this.addUser(comment.user);
                if (!this.user_comments[comment.user.id]) {
                  this.user_comments[comment.user.id] = [];
                }
                this.user_comments[comment.user.id].push(comment);
              }
            }
            issue.commits = [];
            issue.events.filter(e => e.event == 'referenced').map(e => {
              issue.commits.push(e.commit_id);
            });
            this.issues.push(issue);
          });
        })(issue);
      }
      wait( () => this.issues.length == data.length ).then(() => {
        data_status.issues = true;
      });
    });

    getGithubData(commits_url).then((data) => {
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

    getGithubData(comments_url).then((data) => {
      this.comments = data;
      data_status.comments = true;
    });

    wait( () => data_status.issues && data_status.commits && data_status.comments ).then(() => {
      this.createSnapshots();
    });

  }
});