<template>
  <div class="pvcWbWrapper">
    <div class="pvc-whiteboard-rapper" ref="whiteboardWrapper"></div>
    <div>
      <ToolbarDoc
        :isAdmin="isAdmin"
        :whiteboard="whiteboard"
        :activeDocId="activeDocId"
      />
      <Toolbar :isAdmin="isAdmin" :whiteboard="whiteboard" />
      <ToolAdmin :isAdmin="isAdmin" />
      <ToolPagination
        :isAdmin="isAdmin"
        :whiteboard="whiteboard"
        :activeDocId="activeDocId"
      />
      <MeetingInfo />
    </div>
  </div>
</template>

<script>
import ToolbarDoc from '../toolbar/ToolbarDoc.vue';
import Toolbar from '../toolbar/Toolbar.vue';
import ToolAdmin from '../toolbar/ToolAdmin.vue';
import ToolPagination from '../toolbar/ToolPagination.vue';
import MeetingInfo from '../meetingInfo/MeetingInfo.vue';
import { applyForWbAdmin } from '../../utils/panorts';
import { mapMutations } from 'vuex';
import { RtcWhiteboard } from '@pano.video/panorts';

export default {
  components: {
    ToolbarDoc,
    Toolbar,
    ToolAdmin,
    ToolPagination,
    MeetingInfo
  },
  data() {
    return {
      activeDocId: 'default'
    };
  },
  methods: {
    ...mapMutations([
      'setFollowVision',
      'setFollowVisionUser',
      'setSharingVision'
    ]),
    initWhiteboard() {
      this.$nextTick(() => {
        this.whiteboard.open(this.$refs.whiteboardWrapper);
        setTimeout(() => {
          window.rtcWhiteboard.updateCanvasSize();
          if (this.isAdmin) {
            applyForWbAdmin().then(() => {
              window.rtcWhiteboard.startVisionShare();
              this.setFollowVision(false);
              this.setFollowVisionUser({ userId: '', name: '' });
              this.setSharingVision(true);
            });
          }
        }, 1000);
      });
      this.whiteboard.cursorSyncType = 'all';
    },
    onDocChanged() {
      this.activeDocId = this.whiteboard.activeDocId;
    }
  },
  computed: {
    isAdmin: function() {
      // this.$message.info('该操作需要演示人权限，请点击右上角申请成为演示人');
      return this.$store.getters.userMe === this.$store.getters.wbAdminUser;
    }
  },
  mounted() {
    this.initWhiteboard();
    this.whiteboard.on(
      RtcWhiteboard.Events.whiteboardContentUpdate,
      this.onDocChanged
    );
  },
  beforeCreate() {
    this.whiteboard = window.rtcWhiteboard;
  },
  beforeDestroy() {
    this.whiteboard.off(
      RtcWhiteboard.Events.whiteboardContentUpdate,
      this.onDocChanged
    );
    this.whiteboard.close();
  }
};
</script>

<style lang="scss" scoped>
.pvcWbWrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  .pvc-whiteboard-rapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
  }
}
</style>
