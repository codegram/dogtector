export class ApiService {
  apiUrl = process.env.VUE_APP_API_URL;
  $http;

  constructor($http) {
    this.$http = $http;
  }

  loadPhotos() {
    return new Promise((resolve, reject) => {
      return this.$http.get(`${this.apiUrl}/uploads`).then(res => {
        resolve(res.body.map(photo => ({
          ...photo,
          url: `${this.apiUrl}/uploads/${photo.fileName}`
        })));
      }, reject);
    });
  }

  clearPhotos() {
    return new Promise((resolve, reject) => {
      return this.$http.delete(`${this.apiUrl}/uploads`).then(() => {
        resolve();
      }, reject);
    });
  }

  uploadPhoto(formData) {
    return new Promise((resolve, reject) => {
      return this.$http.post(`${this.apiUrl}/upload`, formData).then(res => {
        resolve({
          ...res.body,
          url: `${this.apiUrl}/uploads/${res.body.fileName}`
        })
      }, reject);
    });
  }
}
