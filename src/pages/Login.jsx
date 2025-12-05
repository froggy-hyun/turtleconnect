// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import LoginImage from "../assets/login_img_.png";
import logoTurtle from "../assets/login-logo.svg";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";

const LOGIN_API_URL = "/api/auth/login";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 입력값 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 요청 상태
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // ✅ axios 인스턴스로 로그인 요청
      const res = await api.post(LOGIN_API_URL, {
        email,
        password,
      });

      // 응답 구조: { success, data: { accessToken, refreshToken }, error }
      const { success, data, error } = res.data || {};

      if (!success) {
        throw new Error(error || "로그인에 실패했습니다.");
      }

      if (!data?.accessToken || !data?.refreshToken) {
        throw new Error("서버에서 토큰 정보를 받지 못했습니다.");
      }

      const { accessToken, refreshToken, userId, role } = data;

      // ✅ AuthContext에 로그인 정보 전달 (localStorage 저장 포함)
      login({ accessToken, refreshToken, userId, role });

      if (role == "TRAVELER") navigate("/");
      if (role == "AGENCY" || role == "ADMIN") navigate("/festivals");

    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message;
        
      setErrorMsg(message);
      // 사용자에게 즉시 알림
      alert("로그인에 실패했습니다.");
      try {
        window.location.reload();
      } catch (reloadErr) {
        // reload 실패해도 무시
        console.error("자동 새로고침 실패:", reloadErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <img src={LoginImage} alt="서핑 이미지" />
      </div>

      <div className="login-panel">
        <header className="login-header">
          <button
            type="button"
            className="login-back-btn"
            onClick={() => navigate("/")}
          >
            <span className="login-back-icon">←</span>
          </button>
          <h1 className="login-title">로그인</h1>
        </header>

        <main className="login-main">
          <div className="login-logo">
            <img src={logoTurtle} alt="거북섬 커넥트" />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <input
                type="text"
                className="login-input"
                placeholder="아이디(이메일/계정)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-field">
              <input
                type="password"
                className="login-input"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="login-error-msg">
                {errorMsg}
              </div>
            )}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>아이디 저장</span>
              </label>

              <div className="login-links">
                <button
                  type="button"
                  className="login-link"
                  onClick={() => navigate("/signup")}
                >
                  회원가입
                </button>
                <span className="login-link-sep">|</span>
                <button type="button" className="login-link">
                  아이디 찾기
                </button>
                <span className="login-link-sep">|</span>
                <button type="button" className="login-link">
                  비밀번호 찾기
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
