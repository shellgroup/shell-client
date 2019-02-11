import { querySystemlog } from '@/services/api';

/**
 * 系统日志
 * */
export default {
  namespace: 'systemlog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySystemlog, payload);
      console.log(response, '***************系统日志列表数据');
      yield put({
        type: 'save',
        payload: response,
      });
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
