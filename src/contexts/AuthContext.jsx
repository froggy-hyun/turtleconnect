// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 처음 로딩 시 localStorage에서 세션 복원
  useEffect(() => {
    const savedAccessToken = localStorage.getItem("access_token");
    const savedRefreshToken = localStorage.getItem("refresh_token");
    const savedUserId = localStorage.getItem("user_id");
    const savedRole = localStorage.getItem("role");

    if (savedAccessToken) {
      setAccessToken(savedAccessToken);
    }
    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }
    if (savedUserId) {
      setUserId(Number(savedUserId));
    }
    if (savedRole) {
      setRole(savedRole);
    }

    setLoading(false);
  }, []);

  // ✅ 로그인 성공 시: 토큰 + userId + role 모두 저장
  const login = ({ accessToken, refreshToken, userId, role }) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserId(userId);
    setRole(role);

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user_id", String(userId));
    localStorage.setItem("role", role);
  };

  // ✅ 로그아웃 시: 모두 제거
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    setRole(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
  };

  const value = {
    accessToken,
    refreshToken,
    userId,
    role,
    isLoggedIn: !!accessToken,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");
  }
  return ctx;
}
