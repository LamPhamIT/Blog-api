import { API_PREFIX, API_VERSION } from './api.constant';

export const ENDPOINTS = {
  auth: {
    base: `${API_PREFIX}${API_VERSION}/auth`,
    register: '/register',
    login: '/login',
  },
};
