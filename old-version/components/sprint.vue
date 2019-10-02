<template>
  <div class="sprint" :class="active ? 'active' : false">
    <span v-on:click="$emit('select', sprint)">{{ sprint.title }}</span>
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
      'sprint'
    ],
    mounted() {
    },
    methods: {
      // setProject() {
      //   app.setProject()
      // }
    }
  }
</script>