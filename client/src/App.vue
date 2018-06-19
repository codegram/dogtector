<template>
  <div id="app">
    <md-tabs md-sync-route class="md-primary" md-alignment="centered">
      <md-tab id="tab-home" md-label="Home" to="/"></md-tab>
      <md-tab id="tab-gallery" md-label="Gallery" to="/gallery"></md-tab>
      <md-tab id="tab-admin" md-label="Admin" to="/admin"></md-tab>
    </md-tabs>
    <router-view/>
  </div>
</template>

<style>
</style>
