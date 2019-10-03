<template>
  <div id="metrics">
    <h2>Metrics</h2>
    <div :key="selections">

      <div class="projects-list">
        <span
          class="project"
          v-for="project in projects"
          v-bind:class="{
            'loaded': project.isLoaded(),
            'selected': isSelected(project)
          }"
          v-on:click.prevent="toggleSelectProject(project)"
        >
          {{project.name}}
        </span>
      </div>
      <div class="sprints-list">
        <span
          v-for="title in getSprintsTitles()"
          v-on:click.prevent="selectSprint(title)"
          v-bind:class="{'selected': selectedSprintTitle == title}"
        >
          {{title}}
        </span>
      </div>
      <div class="sprint-data" v-if="selectedSprintTitle">
        <table>
          <tr v-for="user in getUsers()">
            <td>{{user.login}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    data() {
      return {
        selectedProjects: {},
        selectedSprintTitle: null,

        selections: 0,
      }
    },
    props: [
      'projects'
    ],
    computed: {

    },
    methods: {
      getProjects: function() {
        return Object.values(this.selectedProjects);
      },

      isSelected: function(project) {
        if (!this.selectedProjects[project.name]) return false;
        return true;
      },

      toggleSelectProject: function(project) {
        this.selections++;
        if (!project.isLoaded()) return;
        if (!this.isSelected(project)) {
          this.selectedProjects[project.name] = project;
          return;
        }
        delete this.selectedProjects[project.name];
        // this.selectedSprintTitle = null;
      },

      getSprints: function() {
        let sprints = {};
        this.getProjects().map(p => {
          p.sprints.map(s => {
            if (!sprints[s.title]) {
              sprints[s.title] = [];
            }
            sprints[s.title].push(s);
          });
        });
        return sprints;
      },

      getSprintsTitles: function() {
        return Object.keys(this.getSprints())
          .sort((t1, t2) => t1.localeCompare(t2));
      },

      selectSprint(title) {
        this.selectedSprintTitle = title;
        this.selections++;
      },

      getUsers: function() {
        if (!this.selectedSprintTitle) return [];
        let users = {};
        this.getSprints()[this.selectedSprintTitle].map(s => {
          s.project.getUsers().map(u => {
            if ([teachers, exceptUsers].flat().includes(u.login)) return;
            users[u.login] = u;
          })
        });
        console.log(Object.values(users));
        return Object.values(users).sort((u1, u2) => u1.login.localeCompare(u2.login));
      },
    }
  }
</script>