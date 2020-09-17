const ACCESS_TOKEN = 'access_token';

// currently does not handle the case where quota is exceeded
class localStorage {
  storage: Storage | null;

  constructor() {
    this.storage = this.storageAvailable() ? window.localStorage : null;
  }

  // from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  private storageAvailable() {
    let storage;
    try {
      storage = window.localStorage;
      var x = 'storage_test';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage !== undefined &&
        storage.length !== 0
      );
    }
  }

  isAvailable() {
    return this.storage !== null;
  }

  // TODO api requests
  getAccessToken(verify?: boolean) {
    if (!this.isAvailable()) {
      // generate new token whenever called (should only be called once
      // on each load)
      return null;
    }

    let access_token = this.storage!.getItem(ACCESS_TOKEN);
    if (access_token === null) return null;
    if (verify) {
      // send api request to verify authenticity / generate new token
      // replace as necessary
    }
    return access_token;
  }

  setAccessToken(access_token: string) {
    if (!this.isAvailable()) {
      return;
    }
    this.storage!.setItem(ACCESS_TOKEN, access_token);
  }

  removeAccessToken() {
    if (!this.isAvailable()) {
      return;
    }

    this.storage!.removeItem(ACCESS_TOKEN);
  }
}

const storage = new localStorage();
export default storage;
