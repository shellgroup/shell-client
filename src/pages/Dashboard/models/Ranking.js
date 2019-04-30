import { queryRankingMsg } from '@/services/api';

export default {
  namespace: 'ranking',

  state: {
    result: [],
    loading: false,
  },

  effects: {
    *queryRankingMsg({ payload }, { call, put }) {
      const response = yield call(queryRankingMsg,payload);
      yield put({
        type: 'save',
        payload: {
          result: response.result,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        result:[]
      };
    },
  },
};
