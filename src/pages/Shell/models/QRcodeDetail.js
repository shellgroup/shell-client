import { createqrCodes, createqrCode, queryQrcodeDetail, getQrcodeConfigList, isExitQrcodeConfig, isExitQrcodeConfigWhenUpdate, downloadQrcode } from '@/services/api';

/**
 * 二维码详细信息
 * */
export default {
  namespace: 'qrcodedetail',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *queryQrcodeDetail({ payload, callback  }, { call, put }) {
      const response = yield call(queryQrcodeDetail, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *createqrCodes({ payload, callback }, { call, put }) {
      const response = yield call(createqrCodes, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *createqrCode({ payload, callback }, { call, put }) {
      const response = yield call(createqrCode, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getQrcodeConfigList({ payload, callback }, { call, put }) {
      const response = yield call(getQrcodeConfigList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    }
    ,
    *downloadQrcode({ payload, callback }, { call, put }) {
      const response = yield call(downloadQrcode, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *isExitQrcodeConfig({ payload, callback }, { call, put }) {
      const response = yield call(isExitQrcodeConfig, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *isExitQrcodeConfigWhenUpdate({ payload, callback }, { call, put }) {
      const response = yield call(isExitQrcodeConfigWhenUpdate, payload);
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
