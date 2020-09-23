import {} from '../types/questionPack';
import base from './base';
import { User } from '../types/user';
import store from '../utils/store';
import { AxiosResponse } from 'axios';

const authAPI = {
  postLogin: async (accessToken: string): Promise<User> => {
    try {
      const res = await base.postData('/auth/login/facebook', { accessToken });
      console.log(res);

      const token = extractTokenFromResponse(res);
      // TODO const user = res.data;
      const user = { name: 'Jon', id: 1 };

      store.setAccessToken(token);

      return user;
    } catch (err) {
      store.removeLoginState();

      throw err;
    }
  },
};

// TODO fix
const extractTokenFromResponse = (res: AxiosResponse): string =>
  (res as unknown) as string;

export default authAPI;
