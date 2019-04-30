import { downloadMembers } from '@/services/api';

/**
 * 会员管理
 * */
export default {
  namespace: 'memberDownload',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *download({ payload }, { call, put }) {
      yield call(downloadMembers, payload);
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
