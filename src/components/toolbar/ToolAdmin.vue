<template>
  <div class="wb-admin">
    <div class="wb-admin__admin-user">
      <span v-if="wbAdminUser">
        <span class="wb-admin__admin-user-name">
          <span v-if="isAdmin">(Me)</span>
          <span v-else>{{ wbAdminUser.userName }}</span>
        </span>
        <span class="wb-admin__admin-user-label">正在演示</span>
      </span>

      <a-button
        v-if="!isAdmin"
        size="small"
        type="primary"
        @click="applyForWbAdmin"
      >
        申请演示
      </a-button>
      <a-tooltip title="分享链接">
        <a-button
          size="small"
          type="primary"
          :style="{ marginLeft: '10px' }"
          icon="share-alt"
          @click="copyLink"
        />
      </a-tooltip>
      <a-tooltip :title="isFullScreen ? '退出全屏' : '全屏'">
        <a-button
          size="small"
          type="primary"
          :style="{ marginLeft: '10px' }"
          :icon="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
          @click="toggleFullScreen"
        />
      </a-tooltip>
      <a-tooltip title="退出">
        <a-button
          size="small"
          :style="{ marginLeft: '10px' }"
          icon="logout"
          @click="leaveChannel"
        />
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import { Button, Tooltip } from 'ant-design-vue';
import { applyForWbAdmin } from '../../utils/panorts';
import { mapGetters } from 'vuex';
export default {
  name: 'ToolAdmin',
  props: {
    isAdmin: Boolean
  },
  components: {
    'a-button': Button,
    'a-tooltip': Tooltip
  },
  data() {
    return {
      applyForWbAdmin,
      isFullScreen: false
    };
  },
  computed: {
    ...mapGetters(['wbAdminUser'])
  },
  methods: {
    leaveChannel() {
      window.rtcWhiteboard && window.rtcWhiteboard.leaveChannel();
      window.onbeforeunload = null;
      this.$router.replace({ name: 'Login' });
    },
    copyLink() {
      const input = document.createElement('input');
      const main = window.location.href.split('#')[0];
      input.setAttribute(
        'value',
        `${main}/#/join?channelId=${this.$store.getters.channelId}`
      );
      document.body.appendChild(input);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        document.body.removeChild(input);
        this.$message.success('链接已复制到剪切板');
      }
    },
    toggleFullScreen() {
      this.isFullScreen ? this.exitFullscreen() : this.enterFullScreen();
    },
    exitFullscreen() {
      const el = document;
      const cfs =
        el.exitFullscreen ||
        el.mozCancelFullScreen ||
        el.webkitCancelFullScreen ||
        el.msExitFullscreen;
      if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el);
      }
      this.isFullScreen = false;
    },
    enterFullScreen() {
      const el = document.documentElement;
      const rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el);
      }
      this.isFullScreen = true;
    }
  },
  beforeDestroy() {
    this.leaveChannel();
  }
};
</script>

<style lang="scss" scoped>
.wb-admin {
  position: absolute;
  right: 0;
  top: 16px;
  z-index: 10;
  font-size: 12px;
  padding: 5px 16px;
  min-height: 30px;
  display: flex;
  align-items: center;
  color: #333;
  user-select: none;
  height: 24px;
  button {
    margin-left: 5px;
    font-size: 12px !important;
  }
  &__admin-user-name {
    font-weight: bold;
  }
  &__admin-user-label {
    margin-left: 3px;
    color: #1890ff;
  }
}
</style>
