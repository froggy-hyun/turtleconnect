import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { isLoggedIn, role, loading } = useAuth();
  const location = useLocation();

  // 아직 인증 정보를 로딩 중이면 아무 것도 렌더링하지 않음
  if (loading) return null;

  // 로그인되지 않았다면 로그인 페이지로 이동
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const roleUpper = role ? String(role).toUpperCase() : null;

  // allowedRoles가 비어있으면(기본) 로그인한 사용자에게 허용
  if (
    allowedRoles.length === 0 ||
    allowedRoles.map((r) => String(r).toUpperCase()).includes(roleUpper)
  ) {
    return children;
  }

  // 권한이 없으면 홈으로 리다이렉트(원한다면 권한 부족 페이지로 변경 가능)
  return <Navigate to="/" replace />;
}
