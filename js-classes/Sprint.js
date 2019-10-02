class Sprint {
  project    = null;
  title      = '';
  milestones = [];
  from       = '';
  to         = '';

  issues           = {};
  user_commits     = {};
  user_comments    = {};
  user_assignments = {};

  constructor(title, milestones, from, to, project) {
    this.project    = project;
    this.title      = title;
    this.milestones = milestones;
    this.from       = from;
    this.to         = to;
  }

  setUsers(users) {
    users.map(u => u.login).map(login => {
      this.user_commits[login]     = [];
      this.user_comments[login]    = [];
      this.user_assignments[login] = {};
    });
  }

  isDateInRange(date) {
    return getTime(date) > getTime(this.from) && getTime(date) <= getTime(this.to);
  }

  loadIssueData(issue) {
    // with this, commits and comments only count for issues in sprint
    // if (!isIn(issue.milestoneAt(this.to), this.milestones)) return;

    if (isIn(issue.milestoneAt(this.to), this.milestones)) {
      this.issues[issue.number] = issue;

      issue.userLoginsAssignedAt(this.to).map(login => {
          this.user_assignments[login][issue.number] = issue;
      });
    }

    issue.getCommitsInInterval(this.from, this.to).map(commit => {
      let login = commit.author.login;
      this.user_commits[login].push(commit);
    });

    issue.getCommentsInInterval(this.from, this.to).map(comment => {
      let login = comment.user.login;
      this.user_comments[login].push(comment);
    });
  }

  getIssuesNumbers() {
    return Object.keys(this.issues);
  }

  getIssues() {
    return Object.values(this.issues);
  }

  getOpenIssues() {
    return this.getIssues().filter(i => i.wasOpenAt(this.to));
  }

  getClosedIssues() {
    return this.getIssues().filter(i => !i.wasOpenAt(this.to));
  }

  getAllCommits() {
    return Object.values(this.user_commits).flat();
  }

  getAllComments() {
    return Object.values(this.user_comments).flat();
  }

  getUserCommits(login) {
    return this.user_commits[login];
  }

  getUserComments(login) {
    return this.user_comments[login];
  }

  getUserAssignedIssues(login) {
    return Object.values(this.user_assignments[login]);
  }

  getUserOpenIssues(login) {
    return this.getUserAssignedIssues(login).filter(issue => issue.wasOpenAt(this.to));
  }

  getUserClosedIssues(login) {
    return this.getUserAssignedIssues(login).filter(issue => !issue.wasOpenAt(this.to));
  }

  getUserAssignedIssuesWithCommits(login) {
    return this.getUserAssignedIssues(login).filter(issue =>
      issue.hasCommitsInIntervalFrom(login, this.from, this.to)
    );
  }

  getUserAssignedIssuesWithComments(login) {
    return this.getUserAssignedIssues(login).filter(issue =>
      issue.hasCommentsInIntervalFrom(login, this.from, this.to)
    );
  }

  getUserUnassignedIssues(login) {
    return this.getIssues().filter(issue => {
      return !isIn(issue.number, this.getUserAssignedIssues(login).map(i => i.number));
    });
  }

  getUserUnassignedIssuesWithCommits(login) {
    return this.getUserUnassignedIssues(login).filter(issue =>
      issue.hasCommitsInIntervalFrom(login, this.from, this.to)
    );
  }

  getUserUnassignedIssuesWithComments(login) {
    return this.getUserUnassignedIssues(login).filter(issue =>
      issue.hasCommentsInIntervalFrom(login, this.from, this.to)
    );
  }

  getIssueAssignees(issue) {
    let logins = [];
    Object.keys(this.user_assignments).map(login => {
      if (this.user_assignments[login][issue.number]) {
        logins.push(login);
      }
    });
    return logins;
  }

  getUserMetrics(login) {
    let data = {
      aip: 0, // assigned issues participation
      naip: 0, // non-assigned issues participation
      cai: 0, // closed assigned issues
      ncai: 0, // non-closed assigned issues
      aif: 0, // assigned issues factor
      wd: 0
    };

    let round = v => Math.round(v * 100) / 100;
    let getDay = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    let countUsers = (issues) => [... new Set(issues.map(i => this.getIssueAssignees(i)).flat())].length;

    let aiwcommits = this.getUserAssignedIssuesWithCommits(login);
    let aiwcomments = this.getUserAssignedIssuesWithComments(login);
    let uiwcommits = this.getUserUnassignedIssuesWithCommits(login);
    let uiwcomments = this.getUserUnassignedIssuesWithComments(login);

    data.aip = [... new Set([aiwcommits, aiwcomments].flat().map(i => i.number))].length;
    data.naip = [... new Set([uiwcommits, uiwcomments].flat().map(i => i.number))].length;
    data.cai = this.getUserClosedIssues(login).length;
    data.ncai = this.getUserOpenIssues(login).length;

    let ai = this.getUserAssignedIssues(login);
    data.aif = ai.length / (countUsers(ai) ||1);

    let ucommits = this.getUserCommits(login).map(c => getDay(new Date(c.date)));
    let ucomments = this.getUserComments(login).map(c => getDay(new Date(c.created_at))); // not good...
    data.wd = [... new Set([ucommits, ucomments].flat())].length;

    Object.keys(data).map(key => {
      data[key] = round(data[key]);
    });

    return data;
  }

}