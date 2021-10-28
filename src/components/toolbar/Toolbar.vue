<template>
  <div class="pano-wb-tb">
    <!-- 课件交互 -->
    <div
      class="pano-wb-tb__item pano-withtip"
      :class="{
        'pano-wb-tb__item--selected': insertType === ToolType.Click
      }"
      @click="setToolType(ToolType.Click)"
      data-tip="课件交互"
    >
      <div class="iconfont icon-click" />
    </div>

    <!-- 选择 -->
    <div
      @click="setToolType(ToolType.Select)"
      class="pano-wb-tb__item pano-withtip"
      :class="{
        'pano-wb-tb__item--selected': insertType === ToolType.Select
      }"
      data-tip="图形选择"
    >
      <div class="iconfont icon-move" />
    </div>

    <!-- 画笔 -->
    <a-popover placement="right" trigger="click">
      <template slot="content">
        <div class="pano-wb-popup">
          <div class="pano-wb-popup__item">
            <span class="pano-wb-popup__item__label">线宽：</span>
            <a-slider
              :style="{ flex: '1', width: '140px' }"
              v-model="penWidth"
              :step="1"
              :min="1"
              :max="20"
              @change="handlerLineWidthChange"
            />
          </div>
          <div class="pano-wb-popup__item">
            <ToolColors
              :selectedColor="strokeStyle"
              :didSelectedColor="didSelectedColor"
            />
          </div>
        </div>
      </template>
      <div
        class="pano-wb-tb__item pano-withtip"
        :class="{
          'pano-wb-tb__item--selected': insertType === ToolType.Pen
        }"
        data-tip="画笔"
        @click="setToolType(ToolType.Pen)"
      >
        <span class="iconfont icon-pencil" />
        <div
          :class="{
            'pano-wb-tb__item__triangle--selected':
              insertType === ToolType.Pen,
            'pano-wb-tb__item__triangle': insertType !== ToolType.Pen
          }"
        />
      </div>
    </a-popover>

    <!-- 图形 -->
    <a-popover placement="right" trigger="click">
      <template slot="content">
        <div class="pano-wb-popup">
          <div class="pano-wb-popup__item pano-wb-popup__item--no-flex">
            <div class="pano-wb-popup__item2">
              <a-tooltip title="直线">
                <div
                  :class="{
                    'pano-wb-popup__item__select': true,
                    'pano-wb-popup__item__select--selected':
                      insertType === ToolType.Line
                  }"
                  @click="setShapeType(ToolType.Line, 'none')"
                >
                  <span class="iconfont icon-minus" />
                </div>
              </a-tooltip>

              <a-tooltip title="箭头">
                <div
                  :class="{
                    'pano-wb-popup__item__select': true,
                    'pano-wb-popup__item__select--selected':
                      insertType === ToolType.Arrow
                  }"
                  @click="setShapeType(ToolType.Arrow, 'none')"
                >
                  <span class="iconfont icon-arrow-left2" />
                </div>
              </a-tooltip>

              <a-tooltip title="椭圆, 按住shift可绘制正圆">
                <div
                  :class="{
                    'pano-wb-popup__item__select': true,
                    'pano-wb-popup__item__select--selected':
                      fillType === 'none' &&
                      insertType === ToolType.Ellipse
                  }"
                  @click="setShapeType(ToolType.Ellipse, 'none')"
                >
                  <span class="iconfont icon-radio-unchecked" />
                </div>
              </a-tooltip>

              <a-tooltip title="矩形, 按住shift可绘制正方形">
                <div
                  :class="{
                    'pano-wb-popup__item__select': true,
                    'pano-wb-popup__item__select--selected':
                      fillType === 'none' &&
                      insertType === ToolType.Rect
                  }"
                  @click="setShapeType(ToolType.Rect, 'none')"
                >
                  <span class="iconfont icon-checkbox-unchecked" />
                </div>
              </a-tooltip>
            </div>
            <div class="pano-wb-popup__item2">
              <a-tooltip title="椭圆, 按住shift可绘制正圆">
                <div
                  :class="{
                    'pano-wb-popup__item__select': true,
                    'pano-wb-popup__item__select--selected':
                      fillType === 'color' &&
                      insertType === ToolType.Ellipse
                  }"
                  @click="setShapeType(ToolType.Ellipse, 'color')"
                >
                  <span class="iconfont icon-circle-h" />
                </div>
              </a-tooltip>
              <a-tooltip title="矩形, 按住shift可绘制正方形">
                <div
                  :class="{
                    'pano-wb-popup__item__select': true,
                    'pano-wb-popup__item__select--selected':
                      fillType === 'color' &&
                      insertType === ToolType.Rect
                  }"
                  @click="setShapeType(ToolType.Rect, 'color')"
                >
                  <span class="iconfont icon-rect-h" />
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="pano-wb-popup__item">
            <span class="pano-wb-popup__item__label">线宽: </span>
            <a-slider
              :style="{ flex: '1', maxWidth: '140px' }"
              v-model="shapeWidth"
              :step="1"
              :min="1"
              :max="20"
              @change="handlerLineWidthChange"
            />
          </div>
          <ToolColors
            :selectedColor="strokeStyle"
            :didSelectedColor="didSelectedColor"
          />
        </div>
      </template>
      <div
        :class="{
          'pano-withtip': true,
          'pano-wb-tb__item': true,
          'pano-wb-tb__item--selected': this.isShapeSelected
        }"
        data-tip="图形"
        @click="chooseShape"
      >
        <span class="iconfont icon-solid" />
        <div
          :class="
            isShapeSelected
              ? 'pano-wb-tb__item__triangle--selected'
              : 'pano-wb-tb__item__triangle'
          "
        />
      </div>
    </a-popover>

    <!-- 文本 -->
    <a-popover placement="right" trigger="click">
      <template slot="content">
        <div class="pano-wb-popup">
          <div class="pano-wb-popup__item">
            <a-tooltip title="加粗">
              <div
                :class="{
                  'pano-wb-popup__item__select': true,
                  'pano-wb-popup__item__select--selected': bold
                }"
                @click="toggleFontBold"
              >
                <span class="iconfont icon-bold" />
              </div>
            </a-tooltip>
            <a-tooltip title="斜体">
              <div
                :class="{
                  'pano-wb-popup__item__select': true,
                  'pano-wb-popup__item__select--selected': italic
                }"
                @click="toggleItalics"
              >
                <span class="iconfont icon-italic" />
              </div>
            </a-tooltip>
          </div>
          <div class="pano-wb-popup__item">
            <span class="pano-wb-popup__item__label">字号：</span>
            <a-slider
              :style="{ flex: '1', width: '140px' }"
              v-model="fontSize"
              :step="2"
              :min="12"
              :max="60"
              @change="handlerFontSizeChange"
            />
          </div>
          <ToolColors
            :selectedColor="strokeStyle"
            :didSelectedColor="didSelectedColor"
          />
        </div>
      </template>
      <div
        :class="{
          'pano-withtip': true,
          'pano-wb-tb__item': true,
          'pano-wb-tb__item--selected': insertType === ToolType.Text
        }"
        data-tip="文本"
        @click="setToolType(ToolType.Text)"
      >
        <span class="iconfont icon-text" />
        <div
          :class="
            insertType === ToolType.Text
              ? 'pano-wb-tb__item__triangle--selected'
              : 'pano-wb-tb__item__triangle'
          "
        />
      </div>
    </a-popover>

    <!-- 橡皮擦 -->
    <a-popover placement="right" trigger="click">
      <template slot="content">
        <div class="pano-wb-popup" :style="{ width: 'auto' }">
          <div class="pano-wb-popup__item">
            <a-tooltip title="擦除涂抹到的轨迹">
              <div
                :class="{
                  'pano-wb-popup__item__select': true,
                  'pano-wb-popup__item__select--selected':
                    insertType === ToolType.Eraser
                }"
                @click="setToolType(ToolType.Eraser)"
              >
                <span class="iconfont icon-eraser" />
              </div>
            </a-tooltip>
            <a-tooltip title="删除与擦除轨迹有交汇的文字、图形">
              <div
                :class="{
                  'pano-wb-popup__item__select': true,
                  'pano-wb-popup__item__select--selected':
                    insertType === ToolType.Delete
                }"
                @click="setToolType(ToolType.Delete)"
              >
                <span class="iconfont icon-delete" />
              </div>
            </a-tooltip>
          </div>
          <div class="pano-wb-popup__item">
            <span>大小：</span>
            <a-slider
              :style="{ flex: '1', maxWidth: '140px', minWidth: '100px' }"
              v-model="earserWidth"
              :step="1"
              :min="10"
              :max="100"
              @change="handlerLineWidthChange"
            />
          </div>
          <div class="pano-wb-popup__item" :style="{ display: 'block' }">
            <a-button
              size="small"
              type="text"
              :style="{ display: 'block', marginBottom: '5px' }"
              @click="clearContents(false, WBClearType.All)"
            >
              清除所有内容
            </a-button>
            <a-button
              type="text"
              size="small"
              :style="{ display: 'block', marginBottom: '5px' }"
              @click="clearContents(true, WBClearType.All)"
            >
              清除当前页
            </a-button>
            <a-button
              type="text"
              size="small"
              :style="{ display: 'block', marginBottom: '5px' }"
              @click="clearMyContents(true, WBClearType.DRAWS)"
            >
              清除我的笔迹
            </a-button>
            <a-button
              type="text"
              size="small"
              :style="{ display: 'block', marginBottom: '5px' }"
              @click="
                clearMyContents(true, WBClearType.BACKGROUND_IMAGE)
              "
            >
              清除我的背景图
            </a-button>
          </div>
        </div>
      </template>
      <div
        :class="{
          'pano-withtip': true,
          'pano-wb-tb__item': true,
          'pano-wb-tb__item--selected': isEraseSelected
        }"
        data-tip="橡皮擦"
        @click="setToolType(ToolType.Delete)"
      >
        <span class="iconfont icon-eraser" />
        <div
          :class="
            isEraseSelected
              ? 'pano-wb-tb__item__triangle--selected'
              : 'pano-wb-tb__item__triangle'
          "
        />
      </div>
    </a-popover>

    <!-- 激光笔 -->
    <div
      class="pano-wb-tb__item pano-withtip"
      :class="{
        'pano-wb-tb__item--selected':
          insertType === ToolType.LaserPointer
      }"
      @click="setToolType(ToolType.LaserPointer)"
      data-tip="激光笔"
    >
      <div class="iconfont icon-laser-pointer" :style="{ fontSize: '20px' }" />
    </div>

    <!-- 媒体文件 -->
    <a-popover placement="right" trigger="click">
      <template slot="content">
        <div class="wb-img-inputs-wrapper">
          <div class="wb-img-wrapper">
            <div
              class="wb-img-wrapper__input-wrapper"
              :style="{ flexWrap: 'wrap' }"
            >
              <div class="wb-img-wrapper__header">媒体元素</div>
              <a-button
                type="primary"
                :loading="imageUploading"
                :style="{ marginTop: '5px' }"
                @click="uploadImage"
              >
                上传图片
                {{ this.imageUploading ? this.imageUploadProgress : '' }}
              </a-button>
              <a-button
                type="primary"
                :loading="audioUploading"
                :style="{ marginTop: '5px', marginLeft: '10px' }"
                @click="uploadAudio"
              >
                上传音频
                {{ this.audioUploading ? this.audioUploadProgress : '' }}
              </a-button>
              <a-button
                type="primary"
                :loading="videoUploading"
                :style="{ marginTop: '5px', marginLeft: '10px' }"
                @click="uploadVideo"
              >
                上传视频
                {{ this.videoUploading ? this.videoUploadProgress : '' }}
              </a-button>
            </div>

            <div class="wb-img-wrapper__divider" />

            <div class="wb-img-wrapper__input-wrapper">
              <div class="wb-img-wrapper__header">背景图片</div>
            </div>
            <div class="wb-img-wrapper__label">图片Url:</div>
            <div class="wb-img-wrapper__input-wrapper">
              <input
                type="text"
                :value="imgUrl"
                @change="handleImageInputChange"
              />
              <a-button
                class="wb-img-wrapper__input-wrapper__button"
                type="primary"
                :style="{ marginLeft: '10px' }"
                @click="setBackgroundImage"
              >
                设为背景
              </a-button>
            </div>

            <div
              class="wb-img-wrapper__input-wrapper"
              :style="{ marginTop: '10px' }"
            >
              <a-button
                type="primary"
                class="wb-img-wrapper__input-wrapper__button"
                @click="uploadLocalImage"
              >
                本地上传
              </a-button>
            </div>
            <div class="wb-img-wrapper__label">背景图缩放模式</div>
            <div class="wb-img-wrapper__input-wrapper">
              <label>
                <input
                  type="radio"
                  name="fillMode"
                  :value="WBImageScalingMode.Fit"
                  :checked="imgScaleMode === WBImageScalingMode.Fit"
                  @change="
                    setBackgroundImageScalingMode(
                      WBImageScalingMode.Fit
                    )
                  "
                />
                自适应居中
              </label>
              <label>
                <input
                  type="radio"
                  name="fillMode"
                  :value="WBImageScalingMode.FillWidth"
                  :checked="
                    imgScaleMode === WBImageScalingMode.FillWidth
                  "
                  @change="
                    setBackgroundImageScalingMode(
                      WBImageScalingMode.FillWidth
                    )
                  "
                />
                宽度满屏
              </label>
              <label>
                <input
                  type="radio"
                  name="fillMode"
                  :value="WBImageScalingMode.FillHeight"
                  :checked="
                    imgScaleMode === WBImageScalingMode.FillHeight
                  "
                  @change="
                    setBackgroundImageScalingMode(
                      WBImageScalingMode.FillHeight
                    )
                  "
                />
                高度满屏
              </label>
            </div>
          </div>
        </div>
      </template>
      <div class="pano-wb-tb__item pano-withtip" data-tip="多媒体文件">
        <span class="iconfont icon-images" />
        <div class="pano-wb-tb__item__triangle" />
      </div>
    </a-popover>

    <!-- 撤销 -->
    <div
      @click="whiteboard.undo()"
      class="pano-wb-tb__item pano-withtip"
      data-tip="撤销"
    >
      <span class="iconfont icon-undo" />
    </div>

    <!-- 重做 -->
    <div
      @click="whiteboard.redo()"
      class="pano-wb-tb__item pano-withtip"
      data-tip="重做"
    >
      <span class="iconfont icon-redo" />
    </div>

    <!-- 截图 -->
    <a-popover placement="rightBottom" trigger="click">
      <template slot="content">
        <div class="pano-wb-popup">
          <a-button
            type="text"
            size="small"
            :loading="snapshotingAll"
            :style="{ display: 'block', marginBottom: '10px' }"
            @click="snapshot('all')"
          >
            截取全部内容
          </a-button>
          <a-button
            type="text"
            size="small"
            :loading="snapshotingView"
            :style="{ display: 'block', marginBottom: '5px' }"
            @click="snapshot('view')"
          >
            仅截取可见区域
          </a-button>
        </div>
      </template>
      <div class="pano-wb-tb__item pano-withtip" data-tip="截图">
        <div class="iconfont icon-instagram" />
      </div>
    </a-popover>

    <!-- 操作提示 -->
    <a-popover placement="rightBottom" trigger="hover">
      <template slot="content">
        <div class="toolbar-instruction">
          <div class="toolbar-instruction__item">
            <div class="toolbar-instruction__item-title">
              课件交互：
            </div>
            <div class="toolbar-instruction__item-conetnt">
              可以在左侧工具条中选择&ldquo;课件交互&rdquo;功能
              <br />
              或者如果您是演示者，可以用键盘上下左右键控制课件
            </div>
          </div>
          <div class="toolbar-instruction__item">
            <div class="toolbar-instruction__item-title">
              设置样式：
            </div>
            <div class="toolbar-instruction__item-conetnt">
              单选中图形时，修改只对当前选中的图形生效；
              <br />
              没有选中图形时，修改全局样式，对接下来新绘制图形生效;
            </div>
          </div>
          <div class="toolbar-instruction__item">
            <div class="toolbar-instruction__item-title">
              缩放画板：
            </div>
            <div class="toolbar-instruction__item-conetnt">
              使用鼠标滚轮滚动，或者在触摸板上双指向上下推动
            </div>
          </div>
          <div class="toolbar-instruction__item">
            <div class="toolbar-instruction__item-title">
              拖动画板：
            </div>
            <div class="toolbar-instruction__item-conetnt">
              使用鼠标右键按住拖拽，或在触摸板上双指按下后拖动
            </div>
          </div>
        </div>
      </template>
      <div class="pano-wb-tb__item">
        <span class="iconfont icon-info" />
      </div>
    </a-popover>
  </div>
</template>

<script>
import { Popover, Slider, Button, Tooltip } from 'ant-design-vue';
import { RtcWhiteboard } from '@pano.video/panorts';
import { randomWbColor, checkIsAdmin } from '../../utils/panorts';
import ToolColors from './ToolColors.vue';

const { ToolType, WBClearType, WBImageScalingMode } = RtcWhiteboard;

export default {
  name: 'Toolbar',
  props: {
    isAdmin: Boolean,
    whiteboard: RtcWhiteboard
  },
  components: {
    ToolColors,
    'a-popover': Popover,
    'a-tooltip': Tooltip,
    'a-button': Button,
    'a-slider': Slider
  },
  data() {
    return {
      ToolType,
      WBClearType,
      WBImageScalingMode,
      imageUploading: false,
      imageUploadProgress: '',
      audioUploading: false,
      audioUploadProgress: '',
      videoUploading: false,
      videoUploadProgress: '',
      imgUrl: 'https://developer.pano.video/download/example.jpeg',
      imgScaleMode: WBImageScalingMode.Fit,
      fontSize: 24,
      bold: this.whiteboard.bold,
      italic: this.whiteboard.italic,
      scale: this.whiteboard.scale,
      pageCount: this.whiteboard.getTotalNumberOfPages(),
      pageIndex: this.whiteboard.getCurrentPageNumber(),
      penWidth: this.whiteboard.lineWidth,
      shapeWidth: 3,
      earserWidth: 50,
      strokeStyle: randomWbColor(),
      insertType: this.whiteboard.getToolType(),
      fillType: this.whiteboard.fillType,
      snapshotingAll: false,
      snapshotingView: false
    };
  },
  computed: {
    isShapeSelected: function() {
      return (
        (this.fillType === 'none' &&
          (this.insertType === ToolType.Line ||
            this.insertType === ToolType.Arrow ||
            this.insertType === ToolType.Rect ||
            this.insertType === ToolType.Ellipse)) ||
        (this.fillType === 'color' &&
          (this.insertType === ToolType.Rect ||
            this.insertType === ToolType.Ellipse))
      );
    },
    isEraseSelected: function() {
      return (
        this.insertType === ToolType.Delete ||
        this.insertType === ToolType.Eraser
      );
    }
  },
  methods: {
    setToolType(type) {
      switch (type) {
        case ToolType.Pen:
          this.whiteboard.lineWidth = this.penWidth;
          break;
        case ToolType.Eraser:
          this.whiteboard.lineWidth = this.earserWidth;
      }
      this.whiteboard.setToolType(type);
      this.insertType = type;
    },
    setShapeType(type, fillType) {
      this.insertType = type;
      this.fillType = fillType;
      this.setToolType(type);
      this.whiteboard.fillType = fillType;
      if (this.whiteboard.selectedShape) {
        this.whiteboard.setSelectedShapeStyle({
          strokeStyle: this.strokeStyle,
          fillType
        });
      }
    },
    chooseShape() {
      this.whiteboard.lineWidth = this.shapeWidth;
      if (!this.isShapeSelected) {
        this.setShapeType(ToolType.Line, 'none');
      }
    },
    uploadImage() {
      this.whiteboard.uploadImage((state) => {
        if (state.code === 2) {
          this.imageUploading = true;
          this.imageUploadProgress = `(${(
            (state.uploadProgress.loaded / state.uploadProgress.total) *
            100
          ).toFixed(1)})%`;
        } else {
          this.imageUploading = false;
          this.imageUploadProgress = '';
          state.code !== 1 && this.$message.error('上传失败');
        }
      }, false);
    },
    uploadAudio() {
      this.whiteboard.uploadAudio((state) => {
        if (state.code === 2) {
          this.audioUploading = true;
          this.audioUploadProgress = `(${(
            (state.uploadProgress.loaded / state.uploadProgress.total) *
            100
          ).toFixed(1)})%`;
        } else {
          this.audioUploading = false;
          this.audioUploadProgress = '';
          state.code !== 1 && this.$message.error('上传失败');
        }
      });
    },
    uploadVideo() {
      this.whiteboard.uploadVideo((state) => {
        if (state.code === 2) {
          this.videoUploading = true;
          this.videoUploadProgress = `(${(
            (state.uploadProgress.loaded / state.uploadProgress.total) *
            100
          ).toFixed(1)}%)`;
        } else {
          this.videoUploading = false;
          this.videoUploadProgress = '';
          state.code !== 1 && this.$message.error('上传失败');
        }
      });
    },
    handleImageInputChange(e) {
      this.imgUrl = e.target.value;
    },
    setBackgroundImage() {
      if (!checkIsAdmin() || !this.imgUrl) {
        return;
      }
      this.whiteboard.setBackgroundImage(this.imgUrl);
    },
    uploadLocalImage() {
      if (!checkIsAdmin()) return;
      this.whiteboard.uploadImage((state) => {
        if (state.code === 1) {
          console.log('上传成功!');
        } else if (state.code === 2) {
          console.log(
            `已上传${(state.uploadProgress.loaded /
              state.uploadProgress.total) *
              100}%`
          );
        } else {
          this.$message.error('上传失败');
        }
      });
    },
    handlerLineWidthChange(lineWidth) {
      if (lineWidth > 0) {
        if (this.whiteboard.selectedShape) {
          this.whiteboard.setSelectedShapeStyle({
            lineWidth
          });
        }
        this.whiteboard.lineWidth = lineWidth;
      }
    },
    handlerFontSizeChange(fontSize) {
      if (this.whiteboard.selectedShape) {
        this.whiteboard.setSelectedShapeFontStyle({
          fontSize
        });
      } else {
        this.whiteboard.fontSize = fontSize;
      }
    },
    toggleItalics() {
      if (this.whiteboard.selectedShape) {
        this.whiteboard.setSelectedShapeFontStyle({
          italic: !this.italic
        });
      } else {
        this.whiteboard.italic = !this.italic;
      }
      this.italic = !this.italic;
    },
    toggleFontBold() {
      if (this.whiteboard.selectedShape) {
        this.whiteboard.setSelectedShapeFontStyle({
          bold: !this.bold
        });
      } else {
        this.whiteboard.bold = !this.bold;
      }
      this.bold = !this.bold;
    },
    didSelectedColor(color) {
      if (this.whiteboard.selectedShape) {
        this.whiteboard.setSelectedShapeStyle({
          strokeStyle: color,
          fillStyle: color
        });
      }
      this.whiteboard.fillStyle = color;
      this.whiteboard.strokeStyle = color;
      this.strokeStyle = color;
    },
    async snapshot(mode) {
      mode === 'all'
        ? (this.snapshotingAll = true)
        : (this.snapshotingView = true);
      await this.whiteboard.snapshot(true, mode);
      this.snapshotingAll = false;
      this.snapshotingView = false;
    },
    clearContents(curPage, type) {
      if (!checkIsAdmin()) return;
      this.whiteboard.clearContents(curPage ? curPage : false, type);
    },
    clearMyContents(type) {
      this.whiteboard.clearUserContents(
        this.$store.getters.userMe.userId,
        false,
        type
      );
    }
  },
  mounted() {
    this.didSelectedColor(this.strokeStyle);
    this.whiteboard.setToolType(RtcWhiteboard.ToolType.Pen);
  }
};
</script>

<style lang="scss" scoped>
.pano-wb-tb {
  border-radius: 5px;
  font-size: 12px;
  padding: 8px;
  position: absolute;
  z-index: 2;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
  font-size: 12px;
  box-shadow: 2px 2px 8px rgba(20, 14, 14, 0.2);
  background-color: #fff;
  &__item {
    font-size: 18px;
    display: inline-flex;
    width: 30px;
    height: 30px;
    padding: 2px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    margin: 1px 0;
    color: #333;
    position: relative;
    &:hover {
      background-color: lightgray;
    }
    &--selected {
      // background-color: @deep-grey;
      color: #0899f9;
      &:hover {
        background-color: lightgray;
      }
    }
    &__color-dot {
      position: absolute;
      right: 0;
      bottom: 3px;
      width: 6px;
      height: 6px;
      border-radius: 6px;
    }
    &__triangle {
      position: absolute;
      right: 2px;
      bottom: 3px;
      border: 3px solid transparent;
      border-right-color: #333;
      border-bottom-color: #333;
      &--selected {
        position: absolute;
        right: 2px;
        bottom: 3px;
        border: 3px solid transparent;
        border-right-color: #0899f9;
        border-bottom-color: #0899f9;
      }
    }
  }
}

.pano-withtip {
  position: relative;
  &::after {
    content: attr(data-tip);
    position: absolute;
    // top:-30px;
    // right: -40px;
    // width: 100px;
    min-width: 80px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    z-index: 100;
    transform: translateX(calc(90% - 10px));
    font-size: 12px;
    opacity: 0;
    transition: all 0.3s ease-in-out;
    display: none;
  }
  &:hover::after {
    display: block;
    opacity: 1;
    transform: translateX(90%);
  }
}
.pano-withtip-top {
  &::after {
    transform: translate(-50%, -30px);
    left: 50%;
  }
  &:hover::after {
    transform: translate(-50%, -40px);
  }
}

.pano-wb-popup {
  font-size: 12px;
  button:hover {
    background-color: #eee;
  }
  &__item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    button {
      font-size: 12px !important;
      border: none;
    }
    &__label {
      font-size: 12px;
      padding-right: 5px;
    }
    &__select {
      font-size: 18px;
      display: inline-flex;
      width: 40px;
      height: 36px;
      padding: 8px 0;
      justify-content: center;
      align-items: center;
      border-radius: 3px;
      cursor: pointer;
      color: #333;
      position: relative;
      &:hover {
        background-color: lightgray;
      }
      &--selected {
        color: #0899f9;
        &:hover {
          background-color: lightgray;
        }
      }
    }
    // &__select ~ &__select {
    //   margin-left: 5px;
    // }
    &__colors {
      width: 25%;
      display: flex;
      justify-content: center;
      padding: 8px 0;
      &__color-dot {
        cursor: pointer;
        width: 20px;
        height: 20px;
        position: relative;
        &--selected::before {
          position: absolute;
          left: -5px;
          top: -5px;
          width: 30px;
          height: 30px;
          border: 1px solid #0899f9;
          content: '';
        }
      }
    }
    &--no-flex {
      display: block;
    }
    &--fixedWith {
      width: 160px;
    }
  }

  &__item ~ &__item {
    margin-top: 5px;
    position: relative;
    line-height: 32px;
    padding-top: 5px;
    &::before {
      position: absolute;
      content: '';
      width: 100%;
      height: 1px;
      background-color: #eee;
      top: 0;
    }
  }

  &__item2 {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 160px;
  }
}

.wb-img-inputs-wrapper {
  background-color: #fff;
  font-size: 12px;
  padding: 0 8px;
  .wb-img-wrapper {
    margin: 8px 0;
    line-height: 30px;
    &__header {
      font-size: 18px;
      font-weight: bold;
      width: 100%;
      margin-bottom: 5px;
    }
    &__divider {
      height: 1px;
      background-color: #ddd;
      margin: 10px auto;
    }
    &__input-wrapper {
      display: flex;
      align-items: center;
      &__button {
        background-color: transparent;
        color: #0899f9;
        border-color: #0899f9;
        &:hover,
        &:focus {
          background-color: transparent;
          border-color: #0899f9;
        }
        &:active,
        &.active {
          background-color: transparent;
          border-color: #0899f9;
        }
      }
      label {
        margin-right: 15px;
      }
    }
    &__input-wrapper ~ &__input-wrapper {
      margin-top: 10px;
    }
    &__label {
      font-weight: bold;
      position: relative;
      & ~ &::before {
        position: absolute;
        left: -5px;
        top: 1px;
        content: '';
        height: 16px;
        width: 1px;
        background-color: #999;
      }
    }
    input[type='text'] {
      width: 250px;
      border: 1px solid #d5d5d5;
      border-radius: 3px;
      outline: none;
      height: 32px;
      padding: 0 4px;
    }
    label {
      display: inline-flex;
      align-items: center;
      height: 20px;
      input {
        margin: 0 4px;
      }
      input[type='raido']:checked {
        background-color: #0899f9;
      }
    }
  }
}

.toolbar-instruction {
  list-style: none;
  max-width: 350px;
  padding: 10px 10px;
  color: #555;
  font-size: 12px;
  &__item {
    display: flex;
    &-title {
      min-width: 60px;
    }
  }
  &__item ~ &__item {
    margin-top: 10px;
  }
}
</style>
