import * as Constants from '../constants';

function getQueryValue(queryName) {
  const query = decodeURI(window.location.href.split('?')[1]);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === queryName) {
      return pair[1];
    }
  }
  return null;
}

let countdownInterval;

function getInitialState() {
  return {
    appId: '',
    panoToken: '',
    channelId:
      getQueryValue('channelId') ||
      localStorage.getItem(Constants.localCacheKeyChannelId) ||
      '',
    meetingStatus: '',
    meetingEndReason: '',
    whiteboardAvailable: false, // 白板是否已经连接
    remainSeconds: -1,
    followVision: false, //
    followVisionUser: { userId: '', name: '' },
    isSharingVision: false
  };
}

export default {
  state: getInitialState(),
  mutations: {
    setAppId(state, appId) {
      state.appId = appId;
      Constants.localCacheKeyChannelId;
    },
    setPanoToken(state, panoToken) {
      state.panoToken = panoToken;
    },
    setWhiteboardAvailable(state, whiteboardAvailable) {
      state.whiteboardAvailable = whiteboardAvailable;
    },
    setChannelId(state, channelId) {
      state.channelId = channelId;
    },
    setMeetingStatus(state, status) {
      state.meetingStatus = status;
    },
    setmeetingEndReason(state, payload) {
      state.meetingEndReason = payload;
    },
    setRemainSeconds(state, remainSeconds) {
      state.remainSeconds = remainSeconds;
    },
    setFollowVision(state, follow) {
      state.followVision = follow;
    },
    setFollowVisionUser(state, user) {
      state.followVisionUser = user;
    },
    setSharingVision(state, sharing) {
      state.isSharingVision = sharing;
    },
    resetMeetingStore(state) {
      Object.assign(state, getInitialState());
      clearInterval(countdownInterval);
    },
    beginCountdown(state, remainSeconds) {
      state.remainSeconds = remainSeconds;
      clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        state.remainSeconds = state.remainSeconds - 1;
        if (state.remainSeconds <= 0) {
          state.meetingStatus = 'countdownover';
          clearInterval(countdownInterval);
        }
      }, 1000);
    }
  },
  getters: {
    appId: (state) => state.appId,
    panoToken: (state) => state.panoToken,
    channelId: (state) => state.channelId,
    meetingStatus: (state) => state.meetingStatus,
    meetingEndReason: (state) => state.meetingEndReason,
    remainSeconds: (state) => state.remainSeconds,
    whiteboardAvailable: (state) => state.whiteboardAvailable,
    followVision: (state) => state.followVision,
    followVisionUser: (state) => state.followVisionUser,
    isSharingVision: (state) => state.isSharingVision
  }
};
