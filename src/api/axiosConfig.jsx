// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 매 요청마다 localStorage의 토큰을 Bearer로 실어 보냄
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401(인증 에러)일 때 자동 로그아웃 처리 (선택)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패 → 세션 정리
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // 로그인 페이지로 보내기
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
