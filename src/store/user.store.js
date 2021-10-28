import { find, findIndex } from 'lodash-es';

function createUser(userId, userName) {
  return {
    userId,
    userName,
    isWbAdmin: false,
  };
}

function createUserMe() {
  return {
    ...createUser('1234', 'me'),
  };
}


export default {
  state: {
    userMe: createUserMe(),
    userList: [],
  },
  mutations: {
    updateUserMe(state, payload) {
      state.userMe = { ...state.userMe, ...payload };
    },
    updateUser(state, userInfo) {
      const user = find([state.userMe, ...state.userList], {
        userId: userInfo.userId
      });
      Object.assign(user, userInfo);
    },
    addUser(state, { userId, userName }) {
      let user = this.getters.getUserById(userId);
      if (user) {
        user.userName = userName;
      } else {
        user = createUser(userId, userName);
        state.userList.push(user);
      }
      return user;
    },
    removeUser(state, userId) {
      state.userList.splice(findIndex(state.userList, { userId }), 1);
    },
    // 设置白板 admin 用户
    setWbHost(state, userId) {
      [...state.userList, state.userMe].forEach(u => {
        u.isWbAdmin = u.userId === userId;
      });
    },
    resetUserStore(state) {
      state.userMe = createUserMe();
      state.userList = [];
    }
  },
  actions: { },
  getters: {
    allUsers: state => [state.userMe, ...state.userList],
    userList: state => state.userList,
    userMe: state => state.userMe,
    wbAdminUser: (state, getters) =>
      find(getters.allUsers, { isWbAdmin: true }),
    getUserById: (state, getters) => userId =>
      find(getters.allUsers, { userId }),
    getUserIndexById: (state, getters) => userId =>
      findIndex(getters.allUsers, { userId })
  }
};