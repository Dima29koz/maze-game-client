import axios from 'axios'

import { requestHandler } from './api_user_account'

export const get_game_token = requestHandler(async function (room_id) {
  const response = await axios.get('/api/game/get_token/' + room_id)
  return response.data
})

export const join_game = requestHandler(async function (room_name, room_pwd) {
  try {
    const response = await axios.post('/api/game/join', {
      name: room_name,
      pwd: room_pwd
    })
    return response.data
  } catch (e) {
    if (e.response.status == 401) {
      if (
        e.response.data?.msg == 'Wrong room name or password' ||
        e.response.data?.msg == 'There are no empty slots in the room'
      ) {
        return e.response.data
      }
    }

    throw e
  }
})

export const create_game = requestHandler(async function (room_name, room_pwd, rules) {
  try {
    const response = await axios.post('/api/game/create', {
      name: room_name,
      pwd: room_pwd,
      rules: rules
    })
    return response.data
  } catch (e) {
    if (e.response.status == 401) {
      if (e.response.data?.msg == 'Room with this name already exists') {
        return e.response.data
      }
    }

    throw e
  }
})
