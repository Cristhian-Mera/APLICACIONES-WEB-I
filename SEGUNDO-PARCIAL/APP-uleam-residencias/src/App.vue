<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { DataService } from './services/dataService.js'

export default {
  name: 'App',
  mounted() {
    DataService.init()
  }
}
</script>

<style>
@import './styles/global.css';
</style>

