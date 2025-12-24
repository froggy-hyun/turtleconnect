// src/pages/agency/SentDispatch.jsx
import React, { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/sent-dispatch.css";
import api from "../../api/axiosConfig"; // 경로는 프로젝트에 맞게 조정 (예: ../../api/axiosConfig.js)

// DispatchPlan에서 넘겨주는 justSentPlan을 화면 모델로 변환
function buildViewFromJustSentPlan(state) {
  if (!state?.justSentPlan) return null;
  const p = state.justSentPlan;
  const dateText = p.date ? `${p.date} 배차 계획` : "배차 계획";
  const departTime = "-";
  const status = "전송 완료";

  const pickups = (p.selectedStations || []).map((st, idx) => ({
    order: idx + 1,
    name: st.name ?? st.stationName ?? st.locationName ?? "-",
    time: p.pickupTimes?.[st.id] ?? "--:--",
    count: 1,
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

async function fetchRouteDetail(routeId) {
  const res = await api.get(`/api/agency/routes/${routeId}`);
  return res.data?.data;
}

function SentDispatch() {
  const navigate = useNavigate();
  const location = useLocation();

  const [routePlans, setRoutePlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이전 페이지(DispatchPlan)에서 방금 전송한 계획이 넘어온 경우
  const justSentView = useMemo(
    () => buildViewFromJustSentPlan(location.state),
    [location.state]
  );

  useEffect(() => {
    let alive = true;

  async function fetchRoutes() {
    try {
      setLoading(true);

      // 1. 목록 조회
      const res = await api.get("/api/agency/routes");
      const list = res.data?.data ?? [];

      // 2. 각 routeId별 상세 조회
      const views = await Promise.all(
        list.map(async (r) => {
          let detail = null;

          try {
            detail = await fetchRouteDetail(r.routeId);
          } catch (e) {
            console.error(`route ${r.routeId} 상세 조회 실패`, e);
          }

          return {
            id: r.routeId,
            dateText: `${r.date} 배차 계획`,
            departTime: "-",
            status: "전송 완료",

            pickups:
              detail?.stops?.map((s) => ({
                order: s.stopOrder,
                name: s.locationName,
                time: s.pickupTime
                  ? s.pickupTime.slice(11, 16) // HH:mm
                  : "--:--",
                count: 1,
                people: r.totalPassengerCount,
              })) ?? [],

            summary: {
              areaCount: r.stopCount,
              requestCount: r.stopCount,
              peopleCount: r.totalPassengerCount,
              totalPrice: r.totalPrice
            },

            _raw: detail,
          };
        })
      );

      setRoutePlans(views);
    } catch (e) {
      console.error("배차 목록 조회 실패", e);
      setRoutePlans([]);
    } finally {
      setLoading(false);
    }
  }


    fetchRoutes();
    return () => {
      alive = false;
    };
  }, []);

  const plans = useMemo(() => {
    return justSentView ? [justSentView, ...routePlans] : routePlans;
  }, [justSentView, routePlans]);

  return (
    <div className="dispatch-page">
      <Header />
      <main className="dispatch-main">
        <h2 className="sent-title">전송된 배차 계획</h2>
        <p className="sent-subtitle">
          지금까지 전송한 배차 계획의 목록을 확인할 수 있습니다.
        </p>

        <div className="sent-list">
          {loading ? (
            <section className="sent-card">
              <div className="sent-card-header">
                <div className="sent-card-header-left">불러오는 중...</div>
              </div>
            </section>
          ) : plans.length === 0 ? (
            <section className="sent-card">
              <div className="sent-card-header">
                <div className="sent-card-header-left">목록이 비어 있습니다.</div>
              </div>
            </section>
          ) : (
            plans.map((plan) => (
              <section key={plan.id ?? plan.dateText} className="sent-card">
                <div className="sent-card-header">
                  <div className="sent-card-header-left">
                    <div className="sent-date-row">
                      <span className="icon-calendar-outline" />
                      <span className="sent-date-text">{plan.dateText}</span>
                      <span className="sent-status-pill">{plan.status}</span>
                    </div>
                  </div>

                  <button
                    className="sent-detail-btn"
                    onClick={() =>
                      navigate(
                        `/agency-mypage/sent-dispatch/${plan.id ?? "new"}`,
                        {
                          state: {
                            // 상세 페이지가 최소한 렌더는 가능하도록 기본값 포함
                            justSentPlan: plan._raw
                              ? {
                                  ...plan._raw,
                                  date:
                                    plan._raw.date ??
                                    plan.dateText?.slice(0, 10) ??
                                    "",
                                  selectedStations:
                                    plan._raw.selectedStations ?? [],
                                  pickupTimes: plan._raw.pickupTimes ?? {},
                                  note: plan._raw.note ?? "",
                                }
                              : {
                                  date: plan.dateText?.slice(0, 10) ?? "",
                                  note: "",
                                  selectedStations: [],
                                  pickupTimes: {},
                                },
                          },
                        }
                      )
                    }
                  >
                    상세 보기
                  </button>
                </div>

                <div className="sent-section-label">픽업 구역</div>

                {/* API 응답에 stop 상세가 없어서, 카드 영역은 비어있을 수 있음 */}
                <div className="sent-pickup-row">
                  {plan.pickups.length === 0 ? (
                    <div className="sent-pickup-card" style={{ opacity: 0.7 }}>
                      <div className="sent-pickup-top">
                        <div className="sent-pickup-order">-</div>
                        <div className="sent-pickup-name">픽업 상세 정보 없음</div>
                        <div className="sent-pickup-count">-</div>
                      </div>
                      <div className="sent-pickup-time">
                        <span className="icon-clock-small" />
                        <span>--:--</span>
                      </div>
                    </div>
                  ) : (
                    plan.pickups.map((p) => (
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
                    ))
                  )}
                </div>

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
                  <div className="sent-summary-item">
                    <span className="icon-price-small" />
                    <span className="sent-summary-label">총 예산</span>
                    <span className="sent-summary-value">
                      {plan.summary.totalPrice} 원
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
