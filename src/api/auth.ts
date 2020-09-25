import {} from '../types/questionPack';
import base from './base';
import { User } from '../types/user';
import store from '../utils/store';
import { AxiosResponse } from 'axios';

const authAPI = {
  postLogin: async (accessToken: string): Promise<User> => {
    try {
      const res = await base.post('/auth/login/facebook', { accessToken });

      const token = extractTokenFromResponse(res);
      const user = res.data;

      store.setAccessToken(token);

      return user;
    } catch (err) {
      store.removeLoginState();

      throw err;
    }
  },
};

const extractTokenFromResponse = (res: AxiosResponse): string => {
  const token = res.headers.authorization;
  if (!token) {
    throw Error('invalid token');
  }
  return token;
};

export default authAPI;
