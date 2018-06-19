<template>
  <div class="gallery">
    <p v-if="photos.length === 0">There are no photos in the gallery</p>
    <md-card v-for="photo in photos" v-bind:key="photo.fileName">
      <md-card-media-cover>
        <md-card-media md-ratio="16:9">
          <img v-bind:src="photo.url" />
        </md-card-media>
      </md-card-media-cover>
      <md-card-area>
        <md-card-header>
          <span class="md-title">{{ photo.breed }}</span>
        </md-card-header>
      </md-card-area>
    </md-card>
  </div>
</template>

<script>
import { ApiService } from "../services/api.service";

export default {
  name: 'Gallery',
  data: function () {
    return {
      photos: []
    };
  },
  created: function () {
    const apiService = new ApiService(this.$http);
    apiService.loadPhotos().then(photos => this.photos = photos);
  }
}
</script>

<style>
  .gallery .md-card {
    width: 23%;
    margin: 1%;
    display: inline-block;
    vertical-align: top;
  }

  @media(max-width: 620px) {
    .gallery .md-card {
      width: 48%;
    }
  }

  .gallery .md-card .md-card-area {
    text-align: center;
  }

  .gallery .md-card .md-card-area span {
    font-size: 1em;
  }

  p {
    text-align: center;
    font-size: 1em;
  }
</style>