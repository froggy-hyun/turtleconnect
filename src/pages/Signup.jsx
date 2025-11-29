// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import SignupImage from "../assets/signup_img.png"

function SignupPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleBack = () => navigate("/");

  const isPasswordMismatch = passwordCheck.length > 0 && password !== passwordCheck;

  return (
    <div className="signup-page">
      <div className="signup-visual">
        <img src={SignupImage} alt="서핑 이미지" />
      </div>

      <div className="signup-panel">
        <header className="signup-header">
          <button className="signup-back-btn" onClick={handleBack}>
            <span className="signup-back-icon">←</span>
          </button>
          <h1 className="signup-title">정보입력</h1>
        </header>

        <main className="signup-main">
          <section className="signup-intro">
            <p>터틀 커넥트 홈페이지 회원가입을 환영합니다.</p>
            <p>고객님의 정보를 입력해주세요.</p>
          </section>

          <form className="signup-form">
            <div className="signup-field">
              <input
                type="email"
                className="signup-input"
                placeholder="아이디(이메일계정)"
              />
            </div>

            {/* 이름 + 성별 */}
            <div className="signup-field signup-row">
              <input
                type="text"
                className="signup-input"
                placeholder="이름"
              />

              <div className="signup-gender">
                <button
                  type="button"
                  className={`signup-gender-btn ${
                    gender === "남" ? "selected" : ""
                  }`}
                  onClick={() => setGender("남")}
                >
                  남
                </button>

                <button
                  type="button"
                  className={`signup-gender-btn ${
                    gender === "여" ? "selected" : ""
                  }`}
                  onClick={() => setGender("여")}
                >
                  여
                </button>
              </div>
            </div>

            <div className="signup-field">
              <input
                type="date"
                className="signup-input"
                value="2000-01-01"
              />
            </div>

            <div className="signup-field">
              <input
                type="tel"
                className="signup-input"
                placeholder="휴대전화번호"
              />
            </div>

            {/* 비밀번호 */}
            <div className="signup-field">
              <input
                type="password"
                className="signup-input"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="signup-field">
              <input
                type="password"
                className={`signup-input ${
                  isPasswordMismatch ? "input-error" : ""
                }`}
                placeholder="비밀번호 확인"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />

              {/* 경고 라벨 */}
              {isPasswordMismatch && (
                <div className="password-warning">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </div>

            <div className="signup-role-wrapper">
              <label className="signup-role">
                <input type="radio" name="role" defaultChecked />
                <span>여행사</span>
              </label>
              <label className="signup-role">
                <input type="radio" name="role" />
                <span>관광객</span>
              </label>
            </div>

            <button type="submit" className="signup-next-btn">
              다음
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default SignupPage;
