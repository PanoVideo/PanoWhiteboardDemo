<template>
  <div>
    <div class="main">
      <div class="logo">
        <img alt="logo" src="../assets/login.svg" />
      </div>
      <div class="loginForm">
        <div class="welcome">
          <div class="welcomeTop">欢迎使用</div>
          <div class="welcomeBottom">Pano Whiteboard</div>
        </div>
        <a-form :form="form" @submit="joinChannel" class="tableListForm">
          <a-form-item label="AppId">
            <a-input
              name="appId"
              v-decorator="[
                'appId',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户AppId'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="Token">
            <a-input
              name="token"
              v-decorator="[
                'token',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户Token'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="房间号">
            <a-input
              name="channelId"
              v-decorator="[
                'channelId',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入不超过20位的房间号(只允许字母和数字)'
                    },
                    {
                      pattern: /^[0-9a-zA-Z]{1,20}$/,
                      message: '请输入不超过20位的房间号(只允许字母和数字)'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input
              name="username"
              v-decorator="[
                'username',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名!'
                    },
                    {
                      pattern: /^.{1,12}$/,
                      message: '用户名最多输入12个字符!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="用户ID">
            <a-input
              name="userId"
              v-decorator="[
                'userId',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户ID!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model="isAdmin">
              演示者权限
            </a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button class="submit" type="primary" html-type="submit">
              立即加入
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Form, Input, Checkbox } from 'ant-design-vue';
import { mapMutations } from 'vuex';
import { statusCodeToQResult } from '@pano.video/panorts';

const LS_KEY_USERNAME = 'LS_KEY_USERNAME';
const LS_KEY_CHANNELID = 'LS_KEY_CHANNELID';

export default {
  data() {
    return {
      joinLoading: false,
      isAdmin: false,
      form: this.$form.createForm(this, { name: 'login' })
    };
  },
  methods: {
    ...mapMutations([
      'setAppId',
      'setPanoToken',
      'setChannelId',
      'updateUserMe',
      'setMeetingStatus',
      'resetMeetingStore'
    ]),
    joinChannel(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (err) return;
        console.log('Received values of form: ', values);
        this.joinLoading = true;
        const appId = values.appId;
        const token = values.token;
        const name = values.username;
        const channelId = values.channelId;
        const userId = values.userId;
        this.updateUserMe({
          name,
          userId,
          isWbAdmin: this.isAdmin
        });
        window.rtcWhiteboard.joinChannel(
          {
            appId,
            token,
            userId,
            name,
            channelId,
            autoJoinWhiteboardSession: false
          },
          () => {
            console.log('join success!');
            this.joinLoading = false;
            this.setMeetingStatus('connected');
            this.$router.replace({ path: '/whiteboard' });
          },
          (error) => {
            console.error('join', error);
            this.joinLoading = false;
            this.$message.error(`入会失败 (${statusCodeToQResult(error)})`);
          }
        );
      });
    }
  },
  components: {
    'a-form': Form,
    'a-input': Input,
    'a-button': Button,
    'a-form-item': Form.Item,
    'a-checkbox': Checkbox
  },
  mounted() {
    this.form.setFieldsValue({
      username: localStorage.getItem(LS_KEY_USERNAME) || '',
      channelId:
        this.$route.params.channelId ||
        localStorage.getItem(LS_KEY_CHANNELID) ||
        ''
    });
  }
};
</script>

<style lang="scss">
.main {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 640px;
  margin: auto;
  user-select: none;
  z-index: 10;
  display: flex;
  box-shadow: 0px 5px 50px 0px rgba(186, 186, 186, 0.5);
  border-radius: 10px;

  .submit {
    width: 100%;
  }
}

.main input {
  user-select: all;
}

.logo {
  display: flex;
  width: 260px;
  background-color: #f8fafe;
  justify-content: center;
  img {
    width: 220px;
  }
  .version {
    text-align: right;
    font-weight: 500;
    color: #777;
  }
}

.loginForm {
  flex: 1;
  padding: 0 40px;
  .welcome {
    margin: 25px 0 10px;
    font-weight: bold;
    .welcomeTop {
      font-size: 18px;
    }
    .welcomeBottom {
      font-size: 20px;
    }
  }

  .tableListForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 20px;
    .ant-form-item {
      margin-bottom: 5px;
    }
    .ant-form-item-label {
      width: auto;
      padding: 0 4px 0 0;
      line-height: 24px;
    }
  }

  .submit {
    margin-top: 5px;
    width: 100%;
  }
}
</style>
