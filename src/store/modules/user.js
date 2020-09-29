import { login, getInfo, refreshToken } from '@/api/user'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken, setExpireTime, removeExpireTime } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  username: '',
  roles: []

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },

  SET_ROLES: (state, roles) => {
    state.roles = roles
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        setRefreshToken(data.refresh_token)
        setExpireTime(new Date().getTime() + data.expires_in * 1000)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  refreshToken({ commit }, refresh_token) {
    return new Promise((resolve, reject) => {
      refreshToken(refresh_token).then(response => {
        const { data } = response
        commit('SET_TOKEN', '')
        removeToken()
        removeRefreshToken()
        removeExpireTime()

        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        setRefreshToken(data.refresh_token)
        setExpireTime(new Date().getTime() + data.expires_in * 1000)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录.')
        }
        const { fullname, permissions, username } = data

        if (!permissions || permissions.length <= 0) {
          reject('getInfo: permissions must be a non-null array!')
        }

        commit('SET_NAME', fullname)
        commit('SET_ROLES', permissions)
        commit('SET_USERNAME', username)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_USERNAME', '')
      commit('SET_ROLES', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      removeRefreshToken()
      removeExpireTime()
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

