<!-- Single File Component -->

<template>
  <div class="project" :class="active ? 'active' : false" v-on:click.prevent="$emit('select', project)">
    {{project.name}}
  </div>
</template>

<script>
  module.exports = {
    data() {
      return {
      }
    },
    props: [
      'active',
      'project'
    ],
    mounted() {
      // console.log(this.app);
    },
    methods: {
      // setProject() {
      //   app.setProject()
      // }
    }
  }
</script>