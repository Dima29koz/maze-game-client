import axios from 'axios'
import router from '@/router'

export function requestHandler(fn) {
  return async function (...args) {
    try {
      return await fn(...args)
    } catch (e) {
      if (e.response.status == 403 && e.response.data?.msg === 'already authenticated') {
        router.push({ name: 'my_games' })
      }
      console.log(e)
      throw e
    }
  }
}

export const login = requestHandler(async function (username, pwd, remember) {
  try {
    const response = await axios.post('/api/user_account/login', {
      username: username,
      pwd: pwd,
      remember: remember
    })
    return response.data
  } catch (e) {
    if (
      e.response.status == 401 &&
      'msg' in e.response.data &&
      e.response.data.msg == 'Wrong username or password'
    ) {
      return e.response.data
    }
    throw e
  }
})

export const profile_data = requestHandler(async function () {
  try {
    const response = await axios.get('/api/user_account/profile_settings')
    return response.data
  } catch (e) {
    if (e.response.status == 401 && e.response.data == 'login required') {
      return
    }
    throw e
  }
})

export const reset_password_request = requestHandler(async function (username) {
  const response = await axios.post(
    '/api/user_account/reset_password_request',
    {
      username: username
    },
    { headers: { 'X-ORIGIN': window.location.origin } }
  )
  return response.data
})

export const reset_password = requestHandler(async function (token, pwd, pwd_repeat) {
  try {
    const response = await axios.post('/api/user_account/reset_password', {
      token: token,
      pwd: pwd,
      pwd_repeat: pwd_repeat
    })
    return response.data
  } catch (e) {
    if (e.response.status == 400 && e.response.data?.msg === 'Wrong token') {
      return e.response.data
    }
    throw e
  }
})

export const registration = requestHandler(async function (userName, email, password) {
  try {
    const response = await axios.post(
      '/api/user_account/registration',
      {
        username: userName,
        email: email,
        pwd: password
      },
      { headers: { 'X-ORIGIN': window.location.origin } }
    )
    return response.data
  } catch (e) {
    if (e.response.status == 400 && e.response.data?.msg == 'username is not allowed') {
      return e.response.data
    }
    throw e
  }
})

export const confirm_email = requestHandler(async function (token) {
  const response = await axios.post('/api/user_account/confirm_email', { token: token })
  return response.data.msg
})

export const logout = requestHandler(async function () {
  const response = await axios.get('/api/user_account/logout')
  return response.data
})

export const edit_email = requestHandler(async function (new_email) {
  const response = await axios.post('/api/user_account/edit_profile/email', { email: new_email })
  return response.data
})

export const edit_password = requestHandler(
  async function (current_password, new_password, new_password_repeat) {
    try {
      const response = await axios.post('/api/user_account/edit_profile/password', {
        current_pwd: current_password,
        pwd: new_password,
        pwd_repeat: new_password_repeat
      })
      return response.data
    } catch (e) {
      if (e.response.status == 401 && e.response.data?.msg == 'Wrong username or password') {
        return e.response.data
      }
      throw e
    }
  }
)

export const user_games = requestHandler(async function () {
  const response = await axios.get('/api/user_account/user_games')
  return response.data
})
