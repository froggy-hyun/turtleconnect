// src/pages/agency/SentDispatchDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/sent-dispatch-detail.css";
import api from "../../api/axiosConfig";

// "2025-01-03T04:52:00" -> "04:52"
const toHHmm = (iso) => (iso && iso.length >= 16 ? iso.slice(11, 16) : "--:--");

function mapDetailToView(detail) {
  const stops = Array.isArray(detail?.stops) ? detail.stops : [];
  const sortedStops = stops
    .slice()
    .sort((a, b) => Number(a?.stopOrder ?? 0) - Number(b?.stopOrder ?? 0));

  // summary 채우기
  const summary = {
    pickupAreaCount: new Set(sortedStops.map((s) => s.locationName)).size,
    requestCount: sortedStops.length, // stops 개수
    totalPeople: Number(detail?.totalPassengerCount ?? 0),
    totalPrice: Number(detail?.totalPrice ?? 0),
  };

  // table rows (이름/연락처만 "-")
  const rows = sortedStops.map((s, idx) => {
    // const confirmed = !!s.pickupTime; // ✅ pickupTime 있으면 확정
    return {
      key: `${s.locationId}-${s.stopOrder}-${idx}`,
      name: "-",
      phone: "-",
      pickupLocation: s.locationName ?? "-",
      pickupTime: toHHmm(s.pickupTime),
      people: Number(detail?.totalPassengerCount ?? 0),
      status: "미확정",
    };
  });

  return {
    title: `${detail?.date ?? ""} 배차 계획 상세`,
    summary,
    rows,
  };
}


function SentDispatchDetail() {
  const navigate = useNavigate();
  const { routeId } = useParams();
  const params = useParams();
  console.log("params:", params);


  const [detail, setDetail] = useState(null);
  const [activeTab, setActiveTab] = useState("미확정");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function fetchDetail() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/api/agency/routes/${routeId}`);
        const detailData = res.data?.data; // ✅ { routeId, date, totalPassengerCount, totalPrice, stops... }

        const mapped = mapDetailToView(detailData);
        setDetail(mapped);

      } catch (e) {
        console.error("getRouteDetail failed:", e);
        if (alive) {
          setError("상세 정보를 불러오지 못했습니다.");
          setDetail(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (routeId) fetchDetail();
    else {
      setLoading(false);
      setError("routeId가 없습니다.");
    }

    return () => {
      alive = false;
    };
  }, [routeId]);

  const confirmedList = useMemo(
    () => (detail?.rows ?? []).filter((r) => r.status === "확정"),
    [detail]
  );

  const unconfirmedList = useMemo(
    () => (detail?.rows ?? []).filter((r) => r.status === "미확정"),
    [detail]
  );

  const displayedList = useMemo(
    () => (activeTab === "확정" ? confirmedList : unconfirmedList),
    [activeTab, confirmedList, unconfirmedList]
  );

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
            <span className="detail-back-icon">←</span>
            <span className="detail-back-text">목록으로 돌아가기</span>
          </button>

          {error && <div className="error-text">{error}</div>}
          <h2 className="detail-title">{detail?.dateTitle ?? "배차 계획 상세"}</h2>
          <p className="detail-subtitle">{detail?.description ?? ""}</p>
        </div>

        {/* 요약 카드 영역 (기존 레이아웃 유지: 3개) */}
        <section className="detail-summary-section">
          <div className="detail-summary-card">
            <div className="detail-summary-label">픽업 구역</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.summary?.pickupAreaCount ?? 0}개`}
            </div>
          </div>

          <div className="detail-summary-card">
            <div className="detail-summary-label">신청 건수</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.summary?.requestCount ?? 0}건`}
            </div>
          </div>

          <div className="detail-summary-card">
            <div className="detail-summary-label">총 인원</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.summary?.totalPeople ?? 0}명`}
            </div>
          </div>

          <div className="detail-summary-card">
            <div className="detail-summary-label">총 예산</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${(detail?.summary?.totalPrice ?? 0).toLocaleString()}원`}
            </div>
          </div>
        </section>


        {/* 탭 영역: 확정 / 미확정 (기존 레이아웃 유지) */}
        <section className="detail-tab-section">
          <button
            type="button"
            className={activeTab === "확정" ? "detail-tab-btn active" : "detail-tab-btn"}
            onClick={() => setActiveTab("확정")}
          >
            확정 <span className="detail-tab-count">{confirmedList.length}</span>
          </button>

          <button
            type="button"
            className={activeTab === "미확정" ? "detail-tab-btn active" : "detail-tab-btn"}
            onClick={() => setActiveTab("미확정")}
          >
            미확정 <span className="detail-tab-count">{unconfirmedList.length}</span>
          </button>
        </section>

        {/* 테이블 영역 (기존 레이아웃 유지) */}
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
              ) : (detail?.rows?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={6} className="detail-empty">표시할 데이터가 없습니다.</td>
                </tr>
              ) : (
                displayedList.map((r) => (
                  <tr key={r.key}>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.pickupLocation}</td>
                    <td>{r.pickupTime}</td>
                    <td>{r.people}</td>
                    <td>
                      <span
                        className={
                          r.status === "확정"
                            ? "status-pill status-confirmed"
                            : "status-pill status-pending"
                        }
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
}

export default SentDispatchDetail;
