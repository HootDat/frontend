import {
  CommunityQuestionPack,
  LocalQuestionPack,
} from '../types/questionPack';
import { Category } from '../types/category';
import { User } from '../types/user';

const ACCESS_TOKEN = 'access_token';
const LOCAL_PACKS = 'packs';
const CURRENT_USER = 'user';

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
  getAccessToken() {
    if (!this.isAvailable()) {
      // generate new token whenever called (should only be called once
      // on each load)
      return null;
    }

    const access_token = this.storage!.getItem(ACCESS_TOKEN);
    if (access_token === null) return null;
    return access_token;
  }

  setAccessToken(access_token: string) {
    if (!this.isAvailable()) {
      return;
    }
    this.storage!.setItem(ACCESS_TOKEN, access_token);
  }

  getCurrentUser(): User | null {
    if (!this.isAvailable()) {
      return null;
    }

    const user = this.storage!.getItem(CURRENT_USER);
    if (user === null) return null;
    return JSON.parse(user);
  }

  setCurrentUser(user: User) {
    if (!this.isAvailable()) {
      return;
    }

    this.storage!.setItem(CURRENT_USER, JSON.stringify(user));
  }

  removeLoginState() {
    if (!this.isAvailable()) {
      return;
    }

    this.storage!.removeItem(CURRENT_USER);
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

  // replaces the pack with the same id in
  // storage
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

  getCategories(): Category[] {
    if (!this.isAvailable()) {
      return [];
    }

    const categories = this.getLocalPacks()
      .map(pack => pack.categories)
      .flat();
    return Array.from(new Set(categories));
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
