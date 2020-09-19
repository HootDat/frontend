import {
  CommunityQuestionPack,
  LocalQuestionPack,
} from '../types/questionPack';

const ACCESS_TOKEN = 'access_token';
const LOCAL_PACKS = 'packs';

// currently does not handle the case where quota is exceeded
// throughout the app, we don't care whether local storage is available for now
// should address this later just in case
class Store {
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

  private getPacks(): { [key: number]: LocalQuestionPack } {
    const packs = this.storage!.getItem(LOCAL_PACKS);
    if (packs === null) {
      return {};
    }

    return JSON.parse(packs);
  }

  private setPack(pack: LocalQuestionPack) {
    const packs = this.getPacks();
    this.storage!.setItem(
      LOCAL_PACKS,
      JSON.stringify({ ...packs, [pack.id]: pack })
    );
  }

  deletePack(id: number) {
    const packs = this.getPacks();
    delete packs[id];
    this.storage!.setItem(LOCAL_PACKS, JSON.stringify(packs));
  }

  private isPackLocalOnly(pack: LocalQuestionPack) {
    return pack.id < 0;
  }

  private genRandomLocalId(): number {
    const min = -1000000;
    const packs = this.getPacks();
    let test;
    do {
      test = Math.floor(Math.random() * -min + min);
    } while (packs[test] !== undefined);

    return test;
  }

  getLocalPacks(): LocalQuestionPack[] {
    if (!this.isAvailable()) {
      return [];
    }

    return Object.values(this.getPacks()).filter(
      pack => pack.action !== 'delete'
    );
  }

  // Assumes localStorage is present.
  getLocalPack(id: number): LocalQuestionPack {
    return this.getPacks()[id];
  }

  newLocalPack(pack: LocalQuestionPack, name: string) {
    if (!this.isAvailable()) {
      return;
    }

    const PackNew: LocalQuestionPack = {
      ...pack,
      id: this.genRandomLocalId(),
      owner: {
        id: 0, // placeholder, since the server will overwrite this
        name: name, // only meaningful if user is logged in
      },
      action: 'new',
      updated_at: new Date().toISOString(),
    };
    this.setPack(PackNew);
  }

  editLocalPack(pack: LocalQuestionPack) {
    if (!this.isAvailable()) {
      return;
    }

    // if it is local only, we just keep it marked as new
    const action = this.isPackLocalOnly(pack) ? 'new' : 'edit';
    const editedPack: LocalQuestionPack = {
      ...pack,
      action: action,
      updated_at: new Date().toISOString(),
    };
    this.setPack(editedPack);
  }

  deleteLocalPack(pack: LocalQuestionPack) {
    if (!this.isAvailable()) {
      return;
    }

    if (this.isPackLocalOnly(pack)) {
      this.deletePack(pack.id);
    } else {
      const deletedPack: LocalQuestionPack = {
        ...pack,
        action: 'delete',
        updated_at: new Date().toISOString(),
      };
      this.setPack(deletedPack);
    }
  }

  downloadPack(pack: CommunityQuestionPack) {
    if (!this.isAvailable()) {
      return;
    }

    const localPack: LocalQuestionPack = {
      ...pack,
      action: 'none',
    };
    this.setPack(localPack);
  }

  clearPacks() {
    if (!this.isAvailable()) {
      return;
    }

    this.storage!.removeItem(LOCAL_PACKS);
  }

  // logged out with storage
  // offline and online are the same for these. just make changes
  // for no storage, just complain and block functionalities
  // with storage, just make changes locally, no need to try to sync

  // on login, should try to sync all local question packs by checking
  // server's updated time, then checking my local updated time

  // logged in no storage
  // logged out with storage
}

const store = new Store();
export default store;
