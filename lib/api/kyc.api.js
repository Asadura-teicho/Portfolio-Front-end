export const kycAPI = {
   getAllKYC: () => api.get('/admin/kyc/all'), // <- correct endpoint
  updateKYCStatus: (userId, status) => api.post(`/admin/kyc/${userId}/status`, { status }),
  getAllKYC: () => api.get('/admin/kyc'), // <-- for admin dashboard
  submitKYC: (data) => api.post('/user/kyc/submit', data),
  uploadKYCDocuments: (formData) => api.post('/user/kyc/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateKYCStatus: (userId, status) => api.patch(`/admin/kyc/${userId}`, { status }),
}
