import { queryTest } from '@/services/api';
//AdminManager
export default {
  namespace: 'testPage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryTest, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    }
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
