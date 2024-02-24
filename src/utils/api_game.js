import axios from 'axios'

import { requestHandler } from './api_user_account'

export const get_game_data = requestHandler(async function (room_id) {
  const response = await axios.get('/api/api/game_data/' + room_id)
  return response.data
})

export const get_players_stats = requestHandler(async function (room_id) {
  const response = await axios.get('/api/api/players_stat/' + room_id)
  return response.data
})

export function get_user_avatar_src(username) {
  return '/api/api/img/' + username
}
