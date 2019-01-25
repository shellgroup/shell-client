import { queryTimingLog } from '@/services/api'; //, removeRule, addRule, updateRule
//TimingManager
export default {
  namespace: 'timingLog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTimingLog, payload);
      console.log(response, '***************定时任务日志列表数据');
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
