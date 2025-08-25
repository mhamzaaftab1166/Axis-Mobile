import axios from 'axios';
import config from "../config.json";
import useAuthStore from './../store/authStore/index';

export const _axios = async (method, url, body, contentType = 'application/json', params) => {
  const endpoint = `${config.apiUrl}/${url}`

  const token = useAuthStore.getState().token

  try {
    const res = await axios({
      headers: {
        'Content-Type': contentType,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      method: method,
      url: endpoint,
      data: body,
      params: params
    })
    return res.data
  } catch (err) {
    console.error('Axios error:', err)
    throw err
  }
}
