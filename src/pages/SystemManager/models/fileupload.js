import { fileUploadList, configList, addSaveConfig, fileUpload, removeUpload } from '@/services/api';

/**
 * 文件上传
 * */
export default {
  namespace: 'fileupload',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fileUploadList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addSaveConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call, put }) {
      const response = yield call(fileUpload, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *config({ payload, callback }, { call, put }) {
      const response = yield call(configList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUpload, payload);
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
