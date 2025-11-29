// src/pages/Login.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/login.css";
import LoginImage from "../assets/login_img.png"
import logoTurtle from "../assets/logo-turtle.png";

function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <div className="login-page">
      <div className="login-visual">
        <img src={LoginImage} alt="서핑 이미지" />
      </div>

      <div className="login-panel">
        <header className="login-header">
          <button type="button" className="login-back-btn" onClick={() => navigate("/")}>
            <span className="login-back-icon">←</span>
          </button>
          <h1 className="login-title">로그인</h1>
        </header>

        <main className="login-main">
          <div className="login-logo">
            <img src={logoTurtle} alt="거북섬 커넥트" />
          </div>

          <form className="login-form">
            <div className="login-field">
              <input
                type="text"
                className="login-input"
                placeholder="아이디(이메일/계정)"
              />
            </div>

            <div className="login-field">
              <input
                type="password"
                className="login-input"
                placeholder="비밀번호"
              />
            </div>

            <button type="submit" className="login-submit">
              로그인
            </button>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>아이디 저장</span>
              </label>

              <div className="login-links">
                <button type="button" className="login-link" onClick={() => navigate("/signup")}>
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
