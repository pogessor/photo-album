import axiosClient from './axiosClient'

export const photoApi = {
  getAll: async () => {
    const response = await axiosClient.get('/photos')
    return response.data
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/photos/${id}`)
    return response.data
  },

  search: async (keyword) => {
    const response = await axiosClient.get('/photos/search', {
      params: { keyword },
    })
    return response.data
  },

  upload: async (file, year, description) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('year', year)
    if (description) {
      formData.append('description', description)
    }
    const response = await axiosClient.post('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  describe: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axiosClient.post('/photos/describe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
    return response.data
  },

  update: async (id, year, description) => {
    const response = await axiosClient.patch(`/photos/${id}`, {
      year,
      description,
    })
    return response.data
  },

  delete: async (id) => {
    await axiosClient.delete(`/photos/${id}`)
  },

  getImageUrl: (id) => {
    return `http://localhost:8080/api/photos/${id}/image`
  },
}
