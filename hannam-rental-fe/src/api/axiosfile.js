import axios from 'axios';

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// ��û ���ͼ���
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// �α׾ƿ� �Լ�
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = "/login";
};

// ���� ���ͼ���
instance.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const { config, response } = error;
    const status = response?.status;
    const data = response?.data;

    if (status === 401) {
      if (data?.message === "InvalidTokenException") {
        logout();
      } else {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && !config._retry) {
          config._retry = true;
          try {
            const { data } = await axios.post('/auth/refresh', { refreshToken });
            localStorage.setItem('accessToken', data.accessToken);
            config.headers['Authorization'] = `Bearer ${data.accessToken}`;
            return instance(config);
          } catch (refreshError) {
            logout();
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
