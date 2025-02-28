export class UrlUtils {
  static getUrlParams(param) {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    return  urlParams.get(param);
  }
}