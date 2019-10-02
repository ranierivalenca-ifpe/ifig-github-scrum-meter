class Commit {
  data    = {};
  project = {};

  sha = null;
  issue = null;
  author = null;
  date = null;

  constructor(data, project) {
    this.data = data;
    this.project = project;

    this.sha = data.sha;
    this.author = new User(data.author, project);
    this.date = data.commit.author.date;
  }

  referenceIssue(issue) {
    this.issue = issue;
  }
}