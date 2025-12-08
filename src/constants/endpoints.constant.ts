import { API_PREFIX, API_VERSION } from './api.constant';

export const ENDPOINTS = {
  auth: {
    base: `${API_PREFIX}${API_VERSION}/auth`,
    register: '/register',
    login: '/login',
    me: '/me',
  },
  posts: {
    base: `${API_PREFIX}${API_VERSION}/posts`,
    root: '/',
    detail: '/:slug',
    upvote: '/:id/upvote',
  },
  upload: {
    base: `${API_PREFIX}${API_VERSION}/upload`,
    image: '/image',
  },
  series: {
    base: `${API_PREFIX}${API_VERSION}/series`,
    root: '/',
    detail: '/:slug',
  },
  comment: {
    base: `${API_PREFIX}${API_VERSION}/comments`,
    root: '/',
  },
};
