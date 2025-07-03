
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refreshToken')
        const res = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh,
        })

        const newAccessToken = res.data.access
        localStorage.setItem('accessToken', newAccessToken)

        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
