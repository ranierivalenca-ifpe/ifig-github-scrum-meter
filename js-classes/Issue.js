class Issue {
  data    = {};
  project = null;

  number = null;

  events   = [];
  comments = [];
  commits  = [];

  // participants = {};

  constructor(data, project) {
    this.data = data;
    this.project = project;

    this.number = data.number;
  }

  loadComments(reload) {
    if (this.data.comments == 0) return Promise.resolve();
    return getGithubData(this.data.comments_url, this.project.watcher, reload).then(data => {
      this.comments = data;
      // this.comments.map(comment => {
      //   let user = comment.user;
      //   this.participants[user.login] = user;
      // });
    });
  }

  loadEvents(reload) {
    return getGithubData(this.data.events_url, this.project.watcher, reload).then(data => {
      this.events = data;
    });
  }

  referenceCommits(commits) {
    this.events
      .filter(e => e.event == 'referenced')
      .map(event => {
        let commit = commits[event.commit_id];
        if (!commit) return;
        this.commits.push(commit);
        commit.referenceIssue(this);
      })
  }

  getCommentsUsers() {
    let users = {};
    this.comments.map(comment => {
      users[comment.user.login] = new User(comment.user, this.project);
    });
    return Object.values(users);
  }

  milestoneAt(date) {
    let milestone = '';
    this.events.filter(e => getTime(e.created_at) <= getTime(date)).map(e => {
      switch(e.event) {
        case 'milestoned':
          milestone = e.milestone.title;
          break;
        case 'demilestoned':
          milestone = '';
          break;
      }
    });
    return milestone;
  }

  userLoginsAssignedAt(date) {
    let users = {};
    this.events.filter(e => getTime(e.created_at) <= getTime(date)).map(e => {
      switch(e.event) {
        case 'assigned':
          users[e.assignee.login] = true;
          break;
        case 'unassigned':
          delete users[e.assignee.login];
          break;
      }
    });
    return Object.keys(users);
  }

  wasOpenAt(date) {
    return this.data.state == 'open' || getTime(this.data.closed_at) > getTime(date);
  }

  getCommitsInInterval(from, to) {
    return this.commits.filter(c => inInterval(c.date, from, to));
  }

  hasCommitsInIntervalFrom(login, from, to) {
    return this.getCommitsInInterval(from, to).filter(commit => commit.author.login == login).length > 0;
  }

  getCommentsInInterval(from, to) {
    return this.comments.filter(c => inInterval(c.created_at, from, to));
  }

  hasCommentsInIntervalFrom(login, from, to) {
    return this.getCommentsInInterval(from, to).filter(comment => comment.user.login == login).length > 0;
  }

  isEpic() {
    return isIn('EPIC', this.data.labels.map(l => l.name));
  }
}