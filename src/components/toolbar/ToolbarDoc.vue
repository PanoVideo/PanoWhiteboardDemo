<template>
  <div class="wb-docs">
    <div class="wb-docs__current">
      <a-select
        ref="docsSelectRef"
        :value="activeDocId"
        style="width: 200px"
        @change="handleSelectChange"
      >
        <a-select-option
          v-for="(doc, index) in docs"
          :key="doc.docId"
          :value="doc.docId"
        >
          <div class="wb-doc">
            <span class="wb-doc__name">{{
              index === 0 ? '默认白板' : doc.name
            }}</span>
            <span
              v-if="index > 0"
              class="iconfont icon-delete_doc doc-delete"
              :style="{
                fontSize: '14px',
                color: '#afafaf',
                fontWeight: 'normal'
              }"
              @click="deleteDoc(doc.docId)"
            >
            </span>
          </div>
        </a-select-option>
      </a-select>
    </div>
    <div class="wb-docs__tool">
      <a-popover title="" trigger="click">
        <template slot="content">
          <div class="upload-doc-popover">
            <div class="upload-doc-popover__item">
              <div class="upload-doc-popover__item-title">文档转码</div>
              <div class="upload-doc-popover__item-content">
                将文档转为图片，支持 .docx, .xlsx, .pptx, .doc, .xls, .ppt, .pdf
                等格式
              </div>
              <div class="upload-doc-popover__item-button">
                <a-button
                  type="primary"
                  size="small"
                  @click="uploadFileAndTranscode('doc')"
                >
                  上传课件
                </a-button>
              </div>
            </div>
            <div class="upload-doc-popover__item">
              <div class="upload-doc-popover__item-title">动态课件</div>
              <div class="upload-doc-popover__item-content">
                将 PPT 课件转为在线资源，支持动态交互，支持.pptx、.ppt格式
              </div>
              <div class="upload-doc-popover__item-button">
                <a-button
                  type="primary"
                  size="small"
                  @click="uploadFileAndTranscode('courseware')"
                >
                  上传课件
                </a-button>
              </div>
            </div>
          </div>
        </template>
        <a-tooltip>
          <template slot="title">
            上传文档
          </template>
          <span class="iconfont icon-upload2" />
        </a-tooltip>
      </a-popover>
      <a-tooltip>
        <template slot="title">
          {{ !isWhiteboardHidden ? '隐藏白板上所有的图形笔迹' : '显示笔迹' }}
        </template>
        <span
          class="iconfont icon-track"
          :style="{
            color: isWhiteboardHidden ? '#0899F9' : '#333'
          }"
          @click="toggleWhiteboard"
        />
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          {{ !isSharingVision ? '开启视角分享' : '关闭视角分享' }}
        </template>
        <span
          class="iconfont icon-vision"
          :style="{
            color: isSharingVision ? '#0899F9' : '#333'
          }"
          @click="toggleShareVision"
        />
      </a-tooltip>
      <a-tooltip v-if="isShowFollow">
        <template v-if="followVision" slot="title">
          正在跟随
          {{
            meetingStore.followVisionUser.name ||
              meetingStore.followVisionUser.userId
          }}
          的视角 <br />
          点击关闭跟随
        </template>
        <template v-else slot="title">
          {{ followVisionUser.name || followVisionUser.userId }}
          正在分享视角 <br />
          点击开始跟随
        </template>
        <a-popconfirm
          ok-text="Yes"
          cancel-text="No"
          @confirm="startFollowVision"
          @cancel="cancelFollowVision"
        >
          <div slot="title">
            {{ followVisionUser.name || followVisionUser.userId }} 正在分享视角
            <br />
            是否跟随
          </div>
          <span
            class="iconfont icon-vision2"
            :style="{
              color: followVision ? '#0899F9' : '#333'
            }"
            @click="toggleFollowVision"
          />
        </a-popconfirm>
      </a-tooltip>
      <a-tooltip title="将文档或课件一键居中，默认白板恢复初始大小">
        <span class="iconfont icon-reset2" @click="resetWhiteboard" />
      </a-tooltip>
    </div>
    <div v-if="uploading" class="wb-upload-progress">
      <div
        class="wb-upload-progress__loaded"
        :style="{ width: `${uploadProgress * 100}%` }"
      />
    </div>
  </div>
</template>

<script>
import { Popover, Popconfirm, Button, Tooltip, Select } from 'ant-design-vue';
import { RtcWhiteboard } from '@pano.video/panorts';
import { checkIsAdmin } from '../../utils/panorts';

export default {
  name: 'ToolbarDoc',
  props: {
    isAdmin: Boolean,
    whiteboard: RtcWhiteboard,
    activeDocId: String
  },
  data() {
    return {
      docs: [],
      isWhiteboardHidden: false,
      followVision: false,
      followVisionUser: {
        userId: '',
        name: ''
      },
      visionFollowPopVisible: true,
      uploading: false,
      uploadProgress: 0,
      hud: undefined
    };
  },
  components: {
    'a-select': Select,
    'a-select-option': Select.Option,
    'a-popover': Popover,
    'a-tooltip': Tooltip,
    'a-button': Button,
    'a-popconfirm': Popconfirm
  },
  computed: {
    isShowFollow() {
      return this.followVisionUser.userId || this.followVision;
    },
    isSharingVision() {
      return this.$store.getters.isSharingVision;
    }
  },
  mounted() {
    this.addWbListener();
    this.onDocChanged();
  },
  beforeDestroy() {
    this.removeWbListener();
  },
  methods: {
    beforeDestroy() {
      this.removeWbListener();
    },
    addWbListener() {
      this.whiteboard.on(RtcWhiteboard.Events.docCreated, this.onDocChanged);
      this.whiteboard.on(RtcWhiteboard.Events.docDeleted, this.onDocChanged);
      this.whiteboard.on(RtcWhiteboard.Events.docUpdated, this.onDocChanged);
    },
    removeWbListener() {
      this.whiteboard.off(RtcWhiteboard.Events.docCreated, this.onDocChanged);
      this.whiteboard.off(RtcWhiteboard.Events.docDeleted, this.onDocChanged);
      this.whiteboard.off(RtcWhiteboard.Events.docUpdated, this.onDocChanged);
    },
    onDocChanged() {
      this.docs = this.whiteboard.enumerateDocs();
    },
    handleSelectChange(value) {
      if (checkIsAdmin()) {
        this.whiteboard.switchToDoc(value);
      }
    },
    deleteDoc(docId) {
      if (checkIsAdmin()) {
        if (docId === this.whiteboard.activeDocId) {
          this.$refs.docsSelectRef.blur();
        }
        this.whiteboard.deleteDoc(docId);
      }
    },
    uploadFileAndTranscode(type) {
      if (!checkIsAdmin()) return;
      this.whiteboard.uploadDoc(
        this.onUploadStateChange,
        type === 'doc' ? 'doc' : 'courseware',
        type === 'courseware'
      );
    },
    onUploadStateChange(state) {
      let errorMsg = '';
      console.log('state.code: ', state.code);
      switch (state.code) {
        case 1:
          this.hide = this.$message.loading('正在转码...', 0);
          this.uploading = false;
          this.uploadProgress = 0;
          break;
        case 2:
          break;
        case 3:
          this.hide && this.hide();
          this.uploading = false;
          this.uploadProgress = 0;
          this.$message.success('转码成功');
          break;
        case 4:
          if (state.uploadProgress.loaded === state.uploadProgress.total) {
            this.$message.success('文件上传成功，等待转码');
          }
          this.uploading =
            state.uploadProgress.loaded !== state.uploadProgress.total;
          this.uploadProgress =
            state.uploadProgress.loaded / state.uploadProgress.total;
          break;
        case 0:
          break;
        case -1:
          errorMsg = '文件过大，最大支持40M';
          break;
        case -2:
          errorMsg = '文件上传失败，请重试';
          break;
        case -3:
          errorMsg = '文件转码失败，请重试';
          break;
        default:
          this.hide && this.hide();
      }
      if (errorMsg) {
        this.hide && this.hide();
        this.$message.error(errorMsg);
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
    toggleWhiteboard() {
      if (!this.isWhiteboardHidden) {
        this.whiteboard.hideWhiteboard();
      } else {
        this.whiteboard.showWhiteboard();
      }
      this.isWhiteboardHidden = !this.isWhiteboardHidden;
    },
    toggleShareVision() {
      if (this.isSharingVision) {
        this.whiteboard.stopVisionShare();
        this.$message.success('您已停止视角分享');
      } else {
        this.$message.success('其他用户将收到您的视角跟随邀请');
        this.followVision = false;
        this.followVisionUser = { userId: '', name: '' };
        this.whiteboard.startVisionShare();
      }
      this.$store.commit('setSharingVision', !this.isSharingVision);
    },
    toggleFollowVision() {
      this.$emit('toggleFollowVision', !this.followVision);
      !this.followVision ? this.startFollowVision() : this.stopFollowVision();
    },
    startFollowVision() {
      this.whiteboard.startFollowVision();
      this.followVision = true;
      this.visionFollowPopVisible = false;
    },
    stopFollowVision() {
      this.whiteboard.stopFollowVision();
      this.followVision = false;
    },
    cancelFollowVision() {
      this.visionFollowPopVisible = false;
    },
    resetWhiteboard() {
      this.whiteboard.center();
    }
  }
};
</script>

<style lang="scss">
.wb-doc {
  width: 100%;
  display: flex;
  align-items: center;
  &__name {
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.wb-docs {
  position: absolute;
  top: 17px;
  left: 0;
  padding-left: 40px;
  display: flex;
  flex-wrap: wrap;
  z-index: 10;
  font-size: 12px;
  align-items: center;
  user-select: none;
  max-width: calc(100% - 180px);
  color: #333;
  &__item {
    display: flex;
    align-items: center;
    padding: 5px 16px;
    border-radius: 4px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin-right: 8px;
    margin-bottom: 10px;
    background-color: #fff;
    min-height: 26px;
    flex-shrink: 0;
    position: relative;
    .icon-bin {
      position: absolute;
      visibility: visible;
      position: relative;
      right: -4px;
    }
  }
  &__item--active {
    color: #1890ff;
  }
  &__add-doc-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #fff;
    padding: 4px 10px;
    span {
      color: #555;
    }
  }
  &__current {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }

  &__tool {
    margin-left: 8px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 3px 8px;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid rgb(217, 217, 217);
    box-shadow: 0 0 2px rgb(217, 217, 217);
    .iconfont {
      font-size: 18px;
      cursor: pointer;
      min-width: 26px;
      height: 26px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 3px;
      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}

.upload-doc-popover {
  margin: 0;
  width: 240px;
  &__item {
    position: relative;
    padding: 4px 8px;
    transition: all 0.3s ease-in-out;
    border-radius: 5px;
    cursor: pointer;
    // &:hover {
    //    background-color: #f5f5f5;
    // }
    &-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    &-content {
      font-size: 14px;
      color: #777;
      margin-bottom: 5px;
    }
    &-button {
      margin-bottom: 5px;
      height: 32px;
      position: relative;
      button {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
}

.wb-upload-progress {
  position: absolute;
  height: 4px;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  &__loaded {
    position: absolute;
    z-index: 2;
    left: 0;
    height: 100%;
    background-color: #4091f7;
    transition: width 0.3s ease-in-out;
  }
}
</style>
