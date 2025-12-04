// src/pages/SentDispatch.jsx
import React from "react";
import Header from "../components/Header";
import "../styles/sent-dispatch.css";

// 더미 데이터: 전송된 배차 계획 목록
const SENT_PLANS = [
  {
    id: 1,
    dateText: "2025.11.10 배차 계획",
    departTime: "14:30",
    status: "전송 완료",
    pickups: [
      { order: 1, name: "홍대입구역", time: "08:00", count: 2 },
      { order: 2, name: "서울역", time: "08:20", count: 2 },
      { order: 3, name: "강남역", time: "09:00", count: 2 },
    ],
    summary: {
      areaCount: 3,
      requestCount: 7,
      peopleCount: 32,
    },
  },
  {
    id: 2,
    dateText: "2025.11.08 배차 계획",
    departTime: "10:15",
    status: "전송 완료",
    pickups: [
      { order: 1, name: "합정역", time: "10:00", count: 2 },
      { order: 2, name: "신도림역", time: "10:15", count: 1 },
      { order: 3, name: "부천종합운동장역", time: "10:40", count: 2 },
    ],
    summary: {
      areaCount: 3,
      requestCount: 5,
      peopleCount: 32,
    },
  },
  {
    id: 3,
    dateText: "2025.11.05 배차 계획",
    departTime: "09:00",
    status: "전송 완료",
    pickups: [
      { order: 1, name: "강남역", time: "09:00", count: 4 },
      { order: 2, name: "서울역", time: "09:20", count: 3 },
    ],
    summary: {
      areaCount: 2,
      requestCount: 7,
      peopleCount: 28,
    },
  },
];

function SentDispatch() {
  return (
    <div className="dispatch-page">
      <Header />
      <main className="dispatch-main">
        {/* 상단 탭: 2번 탭 활성화 */}
        <div className="dispatch-breadcrumb">
          <button className="step-tab">
            <span className="step-number">1</span>
            <span>배차 계획 세우기</span>
          </button>
          <span className="breadcrumb-separator">›</span>
          <button className="step-tab active">
            <span className="step-number">2</span>
            <span>전송된 배차 계획</span>
          </button>
        </div>

        {/* 페이지 타이틀 */}
        <h2 className="sent-title">전송된 배차 계획</h2>
        <p className="sent-subtitle">
          지금까지 전송한 배차 계획의 목록을 확인할 수 있습니다.
        </p>

        <div className="sent-list">
          {SENT_PLANS.map((plan) => (
            <section key={plan.id} className="sent-card">
              {/* 카드 헤더 */}
              <div className="sent-card-header">
                <div className="sent-card-header-left">
                  <div className="sent-date-row">
                    <span className="icon-calendar-outline" />
                    <span className="sent-date-text">{plan.dateText}</span>
                    <span className="sent-status-pill">
                      {plan.status}
                    </span>
                  </div>
                  <div className="sent-time-row">
                    <span className="icon-clock" />
                    <span className="sent-time-label">출발 시간</span>
                    <span className="sent-time-value">
                      {plan.departTime}
                    </span>
                  </div>
                </div>
                <button className="sent-detail-btn">상세 보기</button>
              </div>

              {/* 픽업 구역 라벨 */}
              <div className="sent-section-label">픽업 구역</div>

              {/* 픽업 역 카드들 */}
              <div className="sent-pickup-row">
                {plan.pickups.map((p) => (
                  <div key={p.order} className="sent-pickup-card">
                    <div className="sent-pickup-top">
                      <div className="sent-pickup-order">{p.order}</div>
                      <div className="sent-pickup-name">{p.name}</div>
                      <div className="sent-pickup-count">
                        {p.count}건
                      </div>
                    </div>
                    <div className="sent-pickup-time">
                      <span className="icon-clock-small" />
                      <span>{p.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 요약 영역 */}
              <div className="sent-summary-row">
                <div className="sent-summary-item">
                  <span className="icon-location-small" />
                  <span className="sent-summary-label">픽업 구역</span>
                  <span className="sent-summary-value">
                    {plan.summary.areaCount}개
                  </span>
                </div>
                <div className="sent-summary-item">
                  <span className="icon-list-small" />
                  <span className="sent-summary-label">선택 건수</span>
                  <span className="sent-summary-value">
                    {plan.summary.requestCount}건
                  </span>
                </div>
                <div className="sent-summary-item">
                  <span className="icon-person-small" />
                  <span className="sent-summary-label">총 인원</span>
                  <span className="sent-summary-value">
                    {plan.summary.peopleCount}명
                  </span>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default SentDispatch;
