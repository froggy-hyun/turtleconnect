// src/pages/agency/AgencyMypage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header"; // 기존 헤더 그대로 사용
import "../../styles/agency-mypage.css";
import ellipseAvatar from "../../assets/Ellipse.png";

function AgencyMypage() {
  const navigate = useNavigate();
  return (
    <div className="agency-page">
      <Header />

      <main className="agency-main">
        {/* 상단 여행사 프로필 카드 */}
        <section className="agency-card">
          <h2 className="card-title">여행사 프로필</h2>

          <div className="profile-row">
            {/* 좌측 프로필 이미지 + 기본 정보 */}
            <div className="profile-left">
              <div className="profile-avatar">
                <img
                  src={ellipseAvatar}
                  alt="프로필"
                />
              </div>

              <div className="profile-info">
                <div className="field-label">여행사명</div>
                <div className="name-row">
                  <span className="agency-name">거북섬 투어</span>
                  <button className="btn-secondary">변경</button>
                </div>

                <div className="field-label">사업자 등록번호</div>
                <span className="field-value">123-45-67890</span>
              </div>
            </div>

            {/* 우측 이메일 + 회원탈퇴 */}
            <div className="profile-right">
              <button className="btn-text">회원탈퇴</button>

              <div className="email-block">
                <div className="field-label">대표 이메일</div>
                <div className="field-value">turtle.tour@naver.com</div>
              </div>
            </div>
          </div>

          <div className="card-divider" />

          {/* 카드 하단 – 비밀번호 변경 */}
          <div className="card-bottom-row">
            <div>
              <div className="section-title-small">비밀번호 변경</div>
              <p className="section-desc">
                계정 보안을 위해 주기적으로 비밀번호를 변경해 주세요.
              </p>
            </div>
            <button className="btn-primary">비밀번호 변경</button>
          </div>
        </section>

        <section className="agency-card">
          <div className="password-header">
            <h3 className="section-title">견적 요청 관리</h3>
            <button className="btn-outline" onClick={() => navigate("/agency-mypage/quotes")}>
              <span className="icon-key" />
              이동
            </button>
          </div>
          <p className="section-desc">
            견적 요청 관리
          </p>
        </section>

        <section className="agency-card">
          <div className="password-header">
            <h3 className="section-title">전송된 배차 계획 관리</h3>
            <button className="btn-outline" onClick={() => navigate("/agency-mypage/sent-dispatch")}>
              <span className="icon-key" />
              이동
            </button>
          </div>
          <p className="section-desc">
            전송된 배차 계획 관리
          </p>
        </section>
      </main>
    </div>
  );
}

export default AgencyMypage;
