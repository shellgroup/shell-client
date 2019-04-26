import { queryQrcodeConfigDetail } from '@/services/api';

/**
 * 查询单挑二维码参数信息
 * */
export default {
  namespace: 'qrcodeParameter',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *queryQrcodeConfigDetail({ payload, callback  }, { call, put }) {
      const response = yield call(queryQrcodeConfigDetail, payload);
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
