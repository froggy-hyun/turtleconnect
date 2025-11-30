// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import SignupImage from "../assets/signup_img.png";

const SIGNUP_API_URL = "http://localhost/api/auth/signup";

function SignupPage() {
  const navigate = useNavigate();

  // 입력값 상태
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [first, setFirst] = useState("");   // 전화번호 앞자리 (지역번호)
  const [middle, setMiddle] = useState(""); // 중간
  const [last, setLast] = useState("");     // 끝자리


  // 선택값 상태
  const [gender, setGender] = useState(null); // "MALE" 또는 "FEMALE"
  const [role, setRole] = useState("AGENCY"); // "AGENCY" 또는 "TRAVELER"

  // 비밀번호
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 전송 상태
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // 뒤로가기(홈으로)
  const handleBack = () => {
    navigate("/");
  };

  // 비밀번호 불일치 여부
  const isPasswordMismatch =
    passwordCheck.length > 0 && password !== passwordCheck;

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // 숫자만 남기기
    value = value.replace(/[^0-9]/g, "");

    // 3자리 입력되면 자동 하이픈: 010-
    if (value.length < 3) {
      value = value;
    } 
    // 3자리 + 나머지: 010-1, 010-12, 010-1234
    else if (value.length < 7) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } 
    // 010-1234-5678 형태
    else {
      value =
        value.slice(0, 3) +
        "-" +
        value.slice(3, 7) +
        "-" +
        value.slice(7, 11);
    }

    setPhone(value);
  };


  // 폼 제출 (회원가입 요청)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    // 기본 검증
    if (!email || !name || !birthDate || !password || !passwordCheck) {
      setSubmitError("필수 정보를 모두 입력해주세요.");
      return;
    }
    if (!first || !middle || !last) {
      setSubmitError("전화번호를 모두 입력해주세요.");
      return;
    }
    if (!gender) {
      setSubmitError("성별을 선택해주세요.");
      return;
    }
    if (isPasswordMismatch) {
      setSubmitError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      // 백엔드 요청 body (요구하신 스펙 그대로)
      const body = {
        email,
        password,
        name,
        phone: `${first}-${middle}-${last}`,
        gender,     // "MALE" | "FEMALE"
        birthDate,  // "YYYY-MM-DD"
        role,       // "TRAVELER" | "AGENCY" (ADMIN은 제외)
      };

      const res = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status == 200){
        setSubmitSuccess("회원가입이 완료되었습니다.");
      }
      else{
        let message = "회원가입에 실패했습니다.";
        try {
          const data = await res.json();
          if (data.message) message = data.message;
        } catch (_) {}
        throw new Error(message);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* 좌측 이미지 */}
      <div className="signup-visual">
        <img src={SignupImage} alt="Signup Visual" />
      </div>

      {/* 우측 입력 패널 */}
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

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* 이메일 */}
            <div className="signup-field">
              <input
                type="email"
                className="signup-input"
                placeholder="아이디(이메일계정)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 이름 + 성별 */}
            <div className="signup-field signup-row">
              <input
                type="text"
                className="signup-input"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="signup-gender">
                <button
                  type="button"
                  className={`signup-gender-btn ${
                    gender === "MALE" ? "selected" : ""
                  }`}
                  onClick={() => setGender("MALE")}
                >
                  남
                </button>
                <button
                  type="button"
                  className={`signup-gender-btn ${
                    gender === "FEMALE" ? "selected" : ""
                  }`}
                  onClick={() => setGender("FEMALE")}
                >
                  여
                </button>
              </div>
            </div>

            {/* 생년월일 */}
            <div className="signup-field">
              <input
                type="date"
                className="signup-input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            {/* 전화번호 (3칸 입력) */}
            <div className="signup-field signup-phone">
              <input
                type="text"
                className="signup-phone-input"
                placeholder="010"
                maxLength={3}
                value={first}
                onChange={(e) => setFirst(e.target.value.replace(/[^0-9]/g, ""))}
              />

              <span className="signup-phone-sep">-</span>

              <input
                type="text"
                className="signup-phone-input"
                placeholder="0000"
                maxLength={4}
                value={middle}
                onChange={(e) => setMiddle(e.target.value.replace(/[^0-9]/g, ""))}
              />

              <span className="signup-phone-sep">-</span>

              <input
                type="text"
                className="signup-phone-input"
                placeholder="0000"
                maxLength={4}
                value={last}
                onChange={(e) => setLast(e.target.value.replace(/[^0-9]/g, ""))}
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
              {isPasswordMismatch && (
                <div className="password-warning">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </div>

            {/* 회원 유형 선택 */}
            <div className="signup-role-wrapper">
              <button
                type="button"
                className={`signup-role-btn ${
                  role === "AGENCY" ? "active" : ""
                }`}
                onClick={() => setRole("AGENCY")}
              >
                여행사
              </button>
              <button
                type="button"
                className={`signup-role-btn ${
                  role === "TRAVELER" ? "active" : ""
                }`}
                onClick={() => setRole("TRAVELER")}
              >
                관광객
              </button>
            </div>

            {/* 에러 / 성공 메시지 */}
            {submitError && (
              <div className="signup-message signup-error">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="signup-message signup-success">
                {submitSuccess}
              </div>
            )}

            {/* 제출 버튼 */}
            <button type="submit" className="signup-next-btn" disabled={loading}>
              {loading ? "처리 중..." : "회원가입"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default SignupPage;
