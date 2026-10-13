import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const profileApi = {
  getProfile: () => api.get('/profile').then((r) => r.data),
  updateProfile: (profile) => api.put('/profile', profile).then((r) => r.data),
  toggleDocument: (key) => api.post('/profile/documents/toggle', { key }).then((r) => r.data),
};

export const opportunityApi = {
  getOpportunities: (type, q) =>
    api.get('/opportunities', { params: { type, q } }).then((r) => r.data),
  getById: (id) => api.get(`/opportunities/${id}`).then((r) => r.data),
  reportOutdated: (id) =>
    api.post(`/opportunities/${id}/report-outdated`).then((r) => r.data),
};

export const eligibilityApi = {
  checkAll: (studentProfile) =>
    api.post('/eligibility/check', studentProfile || {}).then((r) => r.data),
  checkSingle: (id) => api.get(`/eligibility/check/${id}`).then((r) => r.data),
};

export const simulatorApi = {
  run: (overrides) => api.post('/simulator', overrides).then((r) => r.data),
};

export const conflictApi = {
  detectConflicts: (opportunityIds) =>
    api.post('/conflicts', { opportunityIds }).then((r) => r.data),
};

export const planApi = {
  getBestCombination: (opportunityIds, maxPick = 3) =>
    api.post('/plan/best-combination', { opportunityIds, maxPick }).then((r) => r.data),
};

export const deadlineApi = {
  getUpcoming: () => api.get('/deadlines').then((r) => r.data),
};

export const documentApi = {
  getChecklist: (opportunityIds) =>
    api
      .get('/documents/checklist', {
        params: {
          opportunityIds: opportunityIds && opportunityIds.length > 0 ? opportunityIds.join(',') : undefined,
        },
      })
      .then((r) => r.data),
};

export const ageClockApi = {
  getClock: () => api.get('/age-clock').then((r) => r.data),
};

export const costApi = {
  estimate: (opportunityIds) =>
    api.post('/cost/estimate', { opportunityIds }).then((r) => r.data),
};

export const savedApi = {
  getSaved: () => api.get('/saved').then((r) => r.data),
  save: (id) => api.post(`/saved/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/saved/${id}`).then((r) => r.data),
};

export const aiNoticeApi = {
  extractNotice: (noticeText) =>
    api.post('/ai/extract-notice', { noticeText }).then((r) => r.data),
  saveDraft: (draft) => api.post('/ai/save-draft', draft).then((r) => r.data),
};

export default api;
