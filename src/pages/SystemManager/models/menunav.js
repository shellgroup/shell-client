import { queryMenus } from '@/services/api'; //, removeRule, addRule, updateRule
//DictionaryManager
export default {
  namespace: 'menunav',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ callback }, { call, put }) {
      const response = yield call(queryMenus);
      console.log(response, '***************菜单数据');
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
