class User {
  data    = {};
  project = {};

  login = null;

  constructor(data, project) {
    this.data    = data;
    this.project = project;

    this.login = data.login;
  }
}