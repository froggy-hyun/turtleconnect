// src/pages/agency/SentDispatchDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/sent-dispatch-detail.css";
import { getRouteDetail } from "../../api/agencyApi";

// 응답을 화면 모델로 매핑
function mapDetailToView(detail) {
  const titleDate = detail?.date ?? detail?.planDate ?? detail?.createdDate ?? "";
  const dateTitle = detail?.title ?? (titleDate ? `${titleDate} 배차 계획 상세` : "배차 계획 상세");
  const description = detail?.description ?? "사용자가 확정한 여행 정보를 확인할 수 있습니다.";

  const passengersRaw = detail?.passengers ?? detail?.people ?? detail?.requests ?? [];
  const passengers = Array.isArray(passengersRaw)
    ? passengersRaw.map((p, idx) => ({
        id: p?.id ?? p?.requestId ?? idx + 1,
        name: p?.name ?? p?.travelerName ?? "-",
        phone: p?.phone ?? p?.phoneNumber ?? "-",
        pickupLocation: p?.pickupLocation ?? p?.locationName ?? p?.stationName ?? "-",
        pickupTime: p?.pickupTime ?? p?.time ?? "--:--",
        people: p?.people ?? p?.passengerCount ?? p?.totalPeople ?? 0,
        status: p?.statusText ?? p?.status ?? (p?.confirmed ? "확정" : "미확정"),
      }))
    : [];

  const stats = {
    pickupAreaCount:
      detail?.stats?.pickupAreaCount ?? new Set(passengers.map((p) => p.pickupLocation)).size,
    requestCount: detail?.stats?.requestCount ?? passengers.length,
    totalPeople: detail?.stats?.totalPeople ?? passengers.reduce((s, p) => s + (p.people || 0), 0),
  };

  return { dateTitle, description, stats, passengers };
}

function SentDispatchDetail() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const location = useLocation();
  const justSentPlan = location.state?.justSentPlan;
  const [activeTab, setActiveTab] = useState("확정");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 페이지가 넘어갈 때 GET 요청을 보내지 말라는 요구에 맞춰
    // 네비게이션 state(justSentPlan)가 있으면 그것을 사용하고,
    // 없고 planId만 있는 경우에는 최소한의 빈 화면을 보여줍니다.
    setLoading(true);
    setError("");
    try {
      if (justSentPlan) {
        // state를 화면 모델로 변환
        const passengers = (justSentPlan.selectedStations || []).map((st, idx) => ({
          id: st.id ?? idx + 1,
          name: "-",
          phone: "-",
          pickupLocation: st.name ?? st.stationName ?? st.locationName ?? "-",
          pickupTime: justSentPlan.pickupTimes?.[st.id] ?? "--:--",
          people: Number(st.people || st.participantCount || st.totalPeople || 0),
          status: "확정",
        }));

        const stats = {
          pickupAreaCount: new Set(passengers.map((p) => p.pickupLocation)).size,
          requestCount: passengers.length,
          totalPeople: passengers.reduce((s, p) => s + (p.people || 0), 0),
        };

        setDetail({
          dateTitle: justSentPlan.date ? `${justSentPlan.date} 배차 계획 상세` : "배차 계획 상세",
          description: justSentPlan.note || "사용자가 확정한 여행 정보를 확인할 수 있습니다.",
          stats,
          passengers,
        });
      } else {
        // state가 없으면 빈 화면
        setDetail({ dateTitle: "배차 계획 상세", description: "", stats: { pickupAreaCount: 0, requestCount: 0, totalPeople: 0 }, passengers: [] });
      }
    } finally {
      setLoading(false);
    }
  }, [justSentPlan]);

  const confirmedList = useMemo(
    () => (detail?.passengers ?? []).filter((p) => p.status === "확정"),
    [detail]
  );
  const unconfirmedList = useMemo(
    () => (detail?.passengers ?? []).filter((p) => p.status !== "확정"),
    [detail]
  );
  const displayedList = activeTab === "확정" ? confirmedList : unconfirmedList;

  return (
    <div className="dispatch-page">
      <Header />
      <main className="dispatch-main detail-main">
        {/* 상단: 돌아가기 / 타이틀 영역 */}
        <div className="detail-header">
          <button
            className="detail-back"
            type="button"
            onClick={() => navigate("/agency-mypage/sent-dispatch")}
          >
            {/* 실제 아이콘 대신 텍스트/심볼 사용 */}
            <span className="detail-back-icon">←</span>
            <span className="detail-back-text">목록으로 돌아가기</span>
          </button>

          {error && <div className="error-text">{error}</div>}
          <h2 className="detail-title">{detail?.dateTitle ?? "배차 계획 상세"}</h2>
          <p className="detail-subtitle">{detail?.description ?? ""}</p>
        </div>

        {/* 요약 카드 영역 */}
        <section className="detail-summary-section">
          <div className="detail-summary-card">
            <div className="detail-summary-label">픽업 구역</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.stats?.pickupAreaCount ?? 0}개`}
            </div>
          </div>
          <div className="detail-summary-card">
            <div className="detail-summary-label">신청 건수</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.stats?.requestCount ?? 0}건`}
            </div>
          </div>
          <div className="detail-summary-card">
            <div className="detail-summary-label">총 인원</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.stats?.totalPeople ?? 0}명`}
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="detail-empty">불러오는 중...</td>
                </tr>
              ) : displayedList.map((p) => (
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
              {!loading && displayedList.length === 0 && (
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
