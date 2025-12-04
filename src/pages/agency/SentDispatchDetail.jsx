// src/pages/agency/SentDispatchDetail.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/sent-dispatch-detail.css";

// 더미 상세 데이터
const SENT_PLAN_DETAILS = {
  1: {
    dateTitle: "2025.11.10 배차 계획 상세",
    description: "사용자가 확정한 여행 정보를 확인할 수 있습니다.",
    stats: {
      pickupAreaCount: 3,
      requestCount: 8,
      totalPeople: 32,
    },
    passengers: [
      {
        id: 1,
        name: "김민수",
        phone: "010-1234-5678",
        pickupLocation: "홍대입구역",
        pickupTime: "09:00",
        people: 4,
        status: "확정",
      },
      {
        id: 2,
        name: "이지은",
        phone: "010-2345-6789",
        pickupLocation: "홍대입구역",
        pickupTime: "09:00",
        people: 4,
        status: "확정",
      },
      {
        id: 3,
        name: "최서연",
        phone: "010-4567-8901",
        pickupLocation: "서울역",
        pickupTime: "09:20",
        people: 4,
        status: "확정",
      },
      {
        id: 4,
        name: "강예진",
        phone: "010-6789-0123",
        pickupLocation: "강남역",
        pickupTime: "09:40",
        people: 4,
        status: "확정",
      },
      {
        id: 5,
        name: "홍지민",
        phone: "010-8901-2345",
        pickupLocation: "홍대입구역",
        pickupTime: "09:00",
        people: 1,
        status: "확정",
      },
      {
        id: 6,
        name: "박서준",
        phone: "010-0000-0001",
        pickupLocation: "서울역",
        pickupTime: "09:30",
        people: 4,
        status: "미확정",
      },
      {
        id: 7,
        name: "이하늘",
        phone: "010-0000-0002",
        pickupLocation: "강남역",
        pickupTime: "09:50",
        people: 4,
        status: "미확정",
      },
      {
        id: 8,
        name: "정다은",
        phone: "010-0000-0003",
        pickupLocation: "홍대입구역",
        pickupTime: "09:10",
        people: 7,
        status: "미확정",
      },
    ],
  },
  // 필요하면 2, 3번도 동일하게 추가
};

function SentDispatchDetail() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const [activeTab, setActiveTab] = useState("확정");

  const plan = SENT_PLAN_DETAILS[planId] || SENT_PLAN_DETAILS[1];

  const confirmedList = plan.passengers.filter((p) => p.status === "확정");
  const unconfirmedList = plan.passengers.filter((p) => p.status === "미확정");

  const displayedList =
    activeTab === "확정" ? confirmedList : unconfirmedList;

  return (
    <div className="dispatch-page">
      <Header />
      <main className="dispatch-main detail-main">
        {/* 상단: 돌아가기 / 타이틀 영역 */}
        <div className="detail-header">
          <button
            className="detail-back"
            type="button"
            onClick={() => navigate("/sent-dispatch")}
          >
            {/* 실제 아이콘 대신 텍스트/심볼 사용 */}
            <span className="detail-back-icon">←</span>
            <span className="detail-back-text">목록으로 돌아가기</span>
          </button>

          <h2 className="detail-title">{plan.dateTitle}</h2>
          <p className="detail-subtitle">{plan.description}</p>
        </div>

        {/* 요약 카드 영역 */}
        <section className="detail-summary-section">
          <div className="detail-summary-card">
            <div className="detail-summary-label">픽업 구역</div>
            <div className="detail-summary-value">
              {plan.stats.pickupAreaCount}개
            </div>
          </div>
          <div className="detail-summary-card">
            <div className="detail-summary-label">신청 건수</div>
            <div className="detail-summary-value">
              {plan.stats.requestCount}건
            </div>
          </div>
          <div className="detail-summary-card">
            <div className="detail-summary-label">총 인원</div>
            <div className="detail-summary-value">
              {plan.stats.totalPeople}명
            </div>
          </div>
        </section>

        {/* 탭 영역: 확정 / 미확정 */}
        <section className="detail-tab-section">
          <button
            type="button"
            className={
              activeTab === "확정"
                ? "detail-tab-btn active"
                : "detail-tab-btn"
            }
            onClick={() => setActiveTab("확정")}
          >
            확정
            <span className="detail-tab-count">{confirmedList.length}</span>
          </button>
          <button
            type="button"
            className={
              activeTab === "미확정"
                ? "detail-tab-btn active"
                : "detail-tab-btn"
            }
            onClick={() => setActiveTab("미확정")}
          >
            미확정
            <span className="detail-tab-count">
              {unconfirmedList.length}
            </span>
          </button>
        </section>

        {/* 테이블 영역 */}
        <section className="detail-table-section">
          <table className="detail-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>연락처</th>
                <th>픽업 위치</th>
                <th>픽업 시간</th>
                <th>인원</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {displayedList.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.pickupLocation}</td>
                  <td>{p.pickupTime}</td>
                  <td>{p.people}명</td>
                  <td>
                    <span
                      className={
                        p.status === "확정"
                          ? "status-pill status-confirmed"
                          : "status-pill status-pending"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {displayedList.length === 0 && (
                <tr>
                  <td colSpan={6} className="detail-empty">
                    표시할 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default SentDispatchDetail;
