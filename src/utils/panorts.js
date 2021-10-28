import { message, Modal } from 'ant-design-vue';
import {
  RtcWhiteboard,
  RtsService,
  Constants,
  statusCodeToQResult
} from '@pano.video/panorts';
import store from '../store';
import router from '../router';

const rtsService = RtsService.getInstance();
const rtcWhiteboard = new RtcWhiteboard();
window.rtsService = rtsService;
window.rtcWhiteboard = rtcWhiteboard;

/**
 * 初始化pano rts相关逻辑，pano rts包括 Whiteboard, Annotation, RtcMessage, RemoteControl 等
 */
export default function initPanoRts() {
  rtsService.on(RtsService.Events.failover, (data) => {
    // data:  { state: 'Reconnecting' | 'Success' | 'Failed' }
    if (data.state === 'Reconnecting') {
      message.info('PanoRts 服务连接已断开，正在重连...');
    } else if (data.state === 'Success') {
      console.log('rejoinRtms success');
      message.success('PanoRts 服务重连成功');
    } else if (data.state === 'Failed') {
      store.commit('setmeetingEndReason', 'RtsService 无法连接到服务器');
      store.commit('setMeetingStatus', 'ended');
    }
  });

  rtsService.on(RtsService.Events.userJoin, (userId, userData) => {
    console.log('RtcMessage.Events.userJoin', userId, userData);
    store.commit('addUser', { userId, userName: userData.name });
  });
  rtsService.on(RtsService.Events.userLeave, (userId) => {
    const user = store.getters.getUserById(userId);
    if (user) {
      store.commit('removeUser', userId);
    }
  });

  rtcWhiteboard.on(
    RtcWhiteboard.Events.channelCountDown,
    (channelCountDown) => {
      // store.commit('setRemainSeconds', channelCountDown);
      store.commit('beginCountdown', channelCountDown);
    }
  );

  rtcWhiteboard.on(RtcWhiteboard.Events.messageReceived, (payload) => {
    console.log('got whiteboard message:', payload);
    const msg = payload.message;
    if (msg.wbHostId) {
      if (
        msg.wbHostId.toString() !== store.getters.userMe.userId &&
        store.getters.getUserById(msg.wbHostId.toString())
      ) {
        message.info(
          `${
            store.getters.getUserById(msg.wbHostId.toString())?.userName
          } 正在演示`
        );
      }
      store.commit('setWbHost', msg.wbHostId.toString());
    }
  });

  rtcWhiteboard.on(RtcWhiteboard.Events.readyStateChanged, (payload) => {
    console.log('whiteboard ready state changed,', payload);
    store.commit('setWhiteboardAvailable', payload.ready);
    // {
    //   ready: true, // 是否 ready
    //   type: "join", // 触发类型，'join' | 'failover' | 'left'
    //   message: "Join channel success." // 提示消息
    // }
    if (
      payload.type === 'left' &&
      payload.reason !== Constants.StatusCode.SUCCESS
    ) {
      Modal.info({
        title: '通知',
        content: `您已离开白板， 因为${statusCodeToQResult(payload.reason)}`,
        onOk() {
          router.push({ name: 'Login' });
        }
      });
    }
  });

  rtcWhiteboard.on(RtcWhiteboard.Events.userRoleTypeChanged, (role) => {
    if (role !== RtcWhiteboard.WBRoleType.Attendee) {
      // 仅admin角色可以通过键盘操作课件
      rtcWhiteboard.enableCoursewareInteraction();
    } else {
      rtcWhiteboard.disableCoursewareInteraction();
    }
  });
}

/**
 * 申请 admin 角色（演示权限）
 */
export async function applyForWbAdmin() {
  console.log('applyForWbAdmin');
  if (window.rtcWhiteboard.isAdmin) {
    window.rtcWhiteboard.broadcastMessage({
      wbHostId: store.getters.userMe.userId
    });
    return;
  }
  try {
    await window.rtcWhiteboard.setRoleType(RtcWhiteboard.WBRoleType.Admin);
    console.log('演示权限获取成功');
    window.rtcWhiteboard.broadcastMessage({
      wbHostId: store.getters.userMe.userId
    });
  } catch (error) {
    message.error('获取演示权限失败，请重试.');
  }
}

export const allWbColors = [
  'rgba(224, 44, 11, 0.56)',
  'rgba(220, 0, 129, 1)',
  'rgba(228, 100, 8, 1)',
  'rgba(231, 189, 14, 1)',
  'rgba(86, 19, 216, 1)',
  'rgba(22, 49, 211, 1)',
  'rgba(12, 142, 229, 1)',
  'rgba(32, 216, 8, 1)',
  'rgba(144, 222, 15, 1)',
  'rgba(1, 2, 4, 1)',
  'rgba(153, 153, 153, 1)',
  'rgba(255, 255, 255, 1)'
];

export function randomWbColor() {
  const res = allWbColors[Math.floor(Math.random() * (allWbColors.length - 1))];
  return res;
}

export function checkIsAdmin() {
  if (store.getters.userMe !== store.getters.wbAdminUser) {
    message.info('该操作需要演示人权限，请点击右上角申请成为演示人');
    return false;
  }
  return true;
}
