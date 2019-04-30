import { isExitDeptNameWhenAdd, isExitDeptNameWhenUpdate } from '@/services/api';

/**
 * 渠道商管理
 * */
export default {
  namespace: 'channelUpdate',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *isExitDeptNameWhenAdd({ payload, callback }, { call, put }) {
      const response = yield call(isExitDeptNameWhenAdd, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *isExitDeptNameWhenUpdate({ payload, callback }, { call, put }) {
      const response = yield call(isExitDeptNameWhenUpdate, payload);
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
