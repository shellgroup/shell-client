import { queryRankingMsg} from '@/services/api';

/**
 * 二维码详细信息
 * */
export default {
  namespace: 'ranking',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *queryRankingMsg({ payload, callback  }, { call, put }) {
      const response = yield call(queryRankingMsg, payload);
      yield put({
        type: 'save',
        result: response.result,
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
