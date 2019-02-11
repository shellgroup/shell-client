import { configList } from '@/services/api';

/**
 * 文件上传配置
 * */
export default {
  namespace: 'fileuploadConfig',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {

    *config({ payload, callback }, { call, put }) {
      const response = yield call(configList, payload);
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
