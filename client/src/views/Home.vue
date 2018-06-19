<template>
  <div>
    <div class="wrapper">
      <md-card>
        <md-card-media-cover>
          <md-card-media md-ratio="16:9">
            <img v-if="photo" v-bind:src="photo.url" />
            <img v-else src="../assets/no-photo.png" />
          </md-card-media>

          <md-card-area>
            <md-card-actions>
              <md-button v-on:click="showCamera($event)" class="md-fab md-primary" v-bind:disabled="loading">
                <md-icon>camera</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-area>
        </md-card-media-cover>
      </md-card>
      <p v-if="photo" class="md-title">{{ photo.breed }}</p>
      <p v-else class="md-title">No photo</p>
      <md-progress-spinner v-if="loading" md-mode="indeterminate"></md-progress-spinner>
    </div>

    <form>
      <input ref="upload" type="file" accept="image/*" capture="camera" v-on:change="uploadFile($event)"/>
    </form>
  </div>
</template>

<script>
import { ApiService } from "../services/api.service";

export default {
  name: 'Home',
  data: function () {
    return {
      loading: false,
      photo: null
    };
  },
  methods: {
    showCamera(event) {
      this.$refs.upload.click();
      event.preventDefault();
    },
    uploadFile(event) {
      this.photo = null;
      if (event.target.files.length > 0) {
        const [photo] = event.target.files;
        const formData = new FormData();
        formData.append("photo", photo, photo.name);
        const apiService = new ApiService(this.$http);
        this.loading = true;
        apiService.uploadPhoto(formData).then(photo => {
          this.photo = photo
          this.loading = false;
        });
      }
    }
  }
}
</script>

<style>
  .wrapper {
    width: 100%;
    text-align: center;
  }

  .wrapper .md-progress-spinner {
    display: block;
    width: 100px;
    margin: 0 auto;
  }

  .wrapper .md-card {
    width: 60%;
    margin-top: 5%;
    display: inline-block;
    vertical-align: top;
  }

  @media(max-width: 620px) {
    .wrapper .md-card {
      width: 80%;
    }
  }

  input[type="file"] {
    display: none;
  }
</style>
