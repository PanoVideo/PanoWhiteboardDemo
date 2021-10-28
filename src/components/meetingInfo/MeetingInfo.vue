<template>
  <div class="meetingInfo">
    <span class="content">
      <span>房间号：</span> {{ roomId }} 剩余时间：
      {{ mins > 0 && `${mins}分钟` }}
      {{ seconds }} 秒
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'MeetingInfo',
  computed: {
    ...mapGetters(['channelId', 'remainSeconds']),
    seconds() {
      const seconds = this.remainSeconds % 60;
      return seconds >= 10 ? seconds : `0${seconds}`;
    },
    mins() {
      return Math.floor(this.remainSeconds / 60);
    }
  },
  data() {
    return {
      roomId: this.$store.getters.channelId
    };
  }
};
</script>

<style scoped>
.meetingInfo {
  position: absolute;
  left: 20px;
  bottom: 23px;
  color: #333;
  z-index: 10;
}
.info {
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
}

.content {
  margin-right: 5px;
  font-size: 12px;
  user-select: none;
}
</style>
