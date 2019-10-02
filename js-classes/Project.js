class Project {
  name = null;
  repo = null;

  issues  = {};
  commits = {};
  users   = {};
  sprints = [];

  watcher = {
    requests: [],
    completed: [],
  };
  is_loading = false;
  has_loaded = false;

  constructor(name, repo) {
    this.name = name;
    this.repo = repo;
    this.resetData();
  }

  getUsers() { return Object.values(this.users).sort((u1, u2) => u1.login.localeCompare(u2.login)); }
  getIssues() { return Object.values(this.issues); }
  getCommits() { return Object.values(this.commits); }

  resetData() {
    this.issues  = {};
    this.commits = {};
    this.users   = {};

    this.watcher = {
      requests: [],
      completed: [],
    };
  }

  addSprint(title, milestones, from, to) {
    this.sprints.push(new Sprint(title, milestones, from, to, this));
    return this;
  }

  loadData(reload = false) {
    if (this.has_loaded && !reload) return Promise.resolve();
    this.is_loading = true;
    this.resetData();

    return new Promise(res => {
      Promise.all([
        this.loadIssues(reload),
        this.loadCommits(reload)
      ]).then(() => {
        return Promise.all([
          this.findUsers(),
          this.referenceCommits()
        ])
      }).then(() => {
        this.loadSprintsData();

        console.log('project loaded');
        this.is_loading = false;
        this.has_loaded = true;
        res();
      })
    });
  }

  loadIssues(reload) {
    let issues_url = `https://api.github.com/repos/${this.repo}/issues?state=all`;
    return new Promise(res => {
      let issues_promises = [];
      getGithubData(issues_url, this.wacher, reload).then(data => {
        data.map(issue_data => {
          let issue = new Issue(issue_data, this);
          if (issue.isEpic()) return;

          issues_promises.push(
            issue.loadComments(reload),
            issue.loadEvents(reload)
          );
          this.issues[issue.number] = issue;
        });
        Promise.all(issues_promises).then(() => res());
      });
    });
  }

  loadCommits(reload) {
    let commits_url = `https://api.github.com/repos/${this.repo}/commits`;
    return getGithubData(commits_url, this.watcher, reload).then(data => {
      data.map(commit_data => {
        if (!commit_data.commit || !commit_data.author) return;
        let commit = new Commit(commit_data, this);
        this.commits[commit.sha] = commit;
      });
    });
  }

  findUsers() {
    return new Promise(res => {
      this.getCommits().map(commit => {
        let user = commit.author;
        this.users[user.login] = user;
      });
      this.getIssues().map(issue => {
        issue.getCommentsUsers().map(user => {
          this.users[user.login] = user;
        })
      });
      res();
    });
  }

  referenceCommits() {
    return new Promise(res => {
      this.getIssues().map(issue => {
        issue.referenceCommits(this.commits);
      });
      res();
    });
  }

  loadSprintsData() {
    this.sprints.map(sprint => {
      sprint.setUsers(this.getUsers());

      this.getIssues().map(issue => {
        sprint.loadIssueData(issue);
      });
    });
  }

  lastSprint() {
    return this.sprints[this.sprints.length - 1];
  }
}