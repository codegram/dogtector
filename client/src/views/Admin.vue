<template>
  <div class="admin">
    <md-button class="md-raised md-accent" v-on:click="clear()" v-bind:disabled="loading">Clear all photos</md-button>
    <md-snackbar md-position="center" v-bind:md-duration=4000 :md-active.sync="cleared" md-persistent>
      <span>Photos deleted successfully.</span>
    </md-snackbar>
  </div>
</template>

<script>
import { ApiService } from "../services/api.service";

export default {
  name: 'Gallery',
  data: function () {
    return {
      loading: false,
      cleared: false
    }
  },
  methods: {
    clear: function () {
      const apiService = new ApiService(this.$http);
      this.loading = true;
      this.cleared = false;
      apiService.clearPhotos().then(() => {
        this.loading = false;
        this.cleared = true;
      }, () => {
        this.loading = false;
      });
    }
  }
}
</script>

<style>
  .admin {
    text-align: center;
  }

  .admin .md-button {
    width: 30%;
    display: inline-block;
    height: 40px;
    font-size: 1.5em;
  }

   @media(max-width: 620px) {
    .admin .md-button {
      width: 60%;
    }
  }
</style>
