import { WxUserInfoByDataFilter } from '@/services/api';

export default {
  namespace: 'dataFilter',

  state: {
    resultMap: [],
    loading: false,
  },

  effects: {
    *WxUserInfoByDataFilter(_, { call, put }) {
      const response = yield call(WxUserInfoByDataFilter);
      yield put({
        type: 'save',
        payload: {
          resultMap: response.resultMap,
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
        resultMap:[]
      };
    },
  },
};
