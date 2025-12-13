// src/pages/agency/SentDispatch.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/sent-dispatch.css";
// API 호출 없이, 이전 페이지(DispatchPlan)에서 전달된 상태로 구성

// DispatchPlan에서 넘겨주는 justSentPlan을 화면 모델로 변환
function buildViewFromJustSentPlan(state) {
  if (!state?.justSentPlan) return null;
  const p = state.justSentPlan;
  const dateText = p.date ? `${p.date} 배차 계획` : "배차 계획";
  const departTime = "-"; // 출발 시간 값이 없으므로 비워둠
  const status = "전송 완료";

  // stops(locationId, pickupTime) + selectedStations(name/people)
  const pickups = (p.selectedStations || []).map((st, idx) => ({
    order: idx + 1,
    name: st.name ?? st.stationName ?? st.locationName ?? "-",
    time: p.pickupTimes?.[st.id] ?? "--:--",
    count: 1, // 카드에 표시할 건수(요청 수)가 없으므로 1로 표시
    people: Number(st.people || st.participantCount || st.totalPeople || 0),
  }));

  const summary = {
    areaCount: new Set(pickups.map((x) => x.name)).size,
    requestCount: pickups.length,
    peopleCount: pickups.reduce((s, x) => s + (x.people || 0), 0),
  };

  return {
    id: state.justSentPlanId ?? undefined,
    dateText,
    departTime,
    status,
    pickups,
    summary,
    _raw: p,
  };
}

function SentDispatch() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지(DispatchPlan)에서 방금 전송한 계획이 넘어온 경우
  const justSentView = useMemo(
    () => buildViewFromJustSentPlan(location.state),
    [location.state]
  );

  // 더미 데이터(넘겨받은 데이터가 없을 때 사용)
  const dummyPlans = useMemo(
    () => [
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
        summary: { areaCount: 3, requestCount: 7, peopleCount: 32 },
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
        summary: { areaCount: 3, requestCount: 5, peopleCount: 32 },
      },
    ],
    []
  );

  const plans = useMemo(() => {
    // 방금 전송된 계획이 있으면 최상단에 배치하고, 없으면 더미만 사용
    return justSentView ? [justSentView, ...dummyPlans] : dummyPlans;
  }, [justSentView, dummyPlans]);

  return (
    <div className="dispatch-page">
      <Header />
      <main className="dispatch-main">
        {/* 페이지 타이틀 */}
        <h2 className="sent-title">전송된 배차 계획</h2>
        <p className="sent-subtitle">
          지금까지 전송한 배차 계획의 목록을 확인할 수 있습니다.
        </p>

        <div className="sent-list">
          {plans.length === 0 ? (
            <section className="sent-card">
              <div className="sent-card-header">
                <div className="sent-card-header-left">목록이 비어 있습니다.</div>
              </div>
            </section>
          ) : (
          plans.map((plan) => (
            <section key={plan.id} className="sent-card">
              {/* 카드 헤더 */}
              <div className="sent-card-header">
                <div className="sent-card-header-left">
                  <div className="sent-date-row">
                    <span className="icon-calendar-outline" />
                    <span className="sent-date-text">{plan.dateText}</span>
                    <span className="sent-status-pill">{plan.status}</span>
                  </div>
                  <div className="sent-time-row">
                    <span className="icon-clock" />
                    <span className="sent-time-label">출발 시간</span>
                    <span className="sent-time-value">
                      {plan.departTime}
                    </span>
                  </div>
                </div>
                <button
                  className="sent-detail-btn"
                  onClick={() =>
                    navigate(
                      `/agency-mypage/sent-dispatch/${plan.id ?? "new"}`,
                      {
                        state: {
                          // 상세 페이지에서 GET 없이 렌더할 수 있도록 상태 전달
                          justSentPlan: plan._raw
                            ? plan._raw
                            : {
                                date: plan.dateText?.split(" ")[0]?.replace(/\./g, "-"),
                                note: "",
                                selectedStations: plan.pickups.map((p, idx) => ({
                                  id: `d-${plan.id}-${idx}`,
                                  name: p.name,
                                  people: p.people ?? 0,
                                })),
                                pickupTimes: plan.pickups.reduce((acc, p, idx) => {
                                  acc[`d-${plan.id}-${idx}`] = p.time;
                                  return acc;
                                }, {}),
                              },
                        },
                      }
                    )
                  }
                >
                  상세 보기
                </button>
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
                      <div className="sent-pickup-count">{p.count}건</div>
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
          ))
          )}
        </div>
      </main>
    </div>
  );
}

export default SentDispatch;
