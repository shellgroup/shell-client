import { query as queryUsers, queryCurrent } from '@/services/user';
import {baseURL} from "../services/baseurl";

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const user = yield call(queryCurrent);
      const  response = user.user;
      var reg = RegExp(/(http)/);
      if(!reg.test(response.avatar)){
        response.avatar = `${baseURL}/images/${response.avatar}`;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          // notifyCount: action.payload.totalCount,
          // unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
