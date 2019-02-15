import { queryIcon } from '@/services/api';

/**
 * 菜单ICON
 * */
export default {
  namespace: 'menuicon',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ callback }, { call, put }) {
      const response = yield call(queryIcon);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
