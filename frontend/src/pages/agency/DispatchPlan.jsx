// src/pages/agency/DispatchPlanPage.jsx
import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/dispatch-plan.css";
import api from "../../api/axiosConfig";

const SEND_PLAN_API = "/api/agency/routes";

// QUOTE 데이터(AgencyMypage에서 넘어온 quotes)를
// 서울권 / 경기권 섹션으로 나누는 함수
function buildSectionsFromQuotes(quotes = []) {
  if (!Array.isArray(quotes) || quotes.length === 0) return [];

  const seoulStations = [];
  const gyunggiStations = [];

  quotes.forEach((q, index) => {
    // ✅ 기존(station/line/people) + 신규(locationName/participantCount/totalPeople) 모두 대응
    const name =
      q?.station ?? q?.locationName ?? q?.name ?? q?.stationName ?? "";
    const line =
      q?.line ?? q?.lineName ?? q?.route ?? ""; // 없으면 빈 값
    const people =
      q?.people ?? q?.participantCount ?? q?.totalPeople ?? 0;

    const base = {
      id: q.id ? String(q.id) : q.locationId ? `loc-${q.locationId}` : `q-${index}`,
      locationId: q.locationId,          // ✅ 추가
      name: q.station ?? q.locationName, // (이미 수정하셨다면 그 로직 유지)
      line: q.line ?? "",
      people: q.people ?? q.participantCount ?? q.totalPeople ?? 0,
      selected: true,
    };

    // name이 없으면 분류 불가 → 일단 서울권으로 넣거나(혹은 continue)
    const safeName = String(name || "");

    if (
      safeName.includes("수원") ||
      safeName.includes("부천") ||
      safeName.includes("안산") ||
      safeName.includes("인천")
    ) {
      gyunggiStations.push(base);
    } else {
      seoulStations.push(base);
    }
  });

  const sections = [];
  if (seoulStations.length > 0) {
    sections.push({ id: "seoul", title: "서울권", stations: seoulStations });
  }
  if (gyunggiStations.length > 0) {
    sections.push({ id: "gyunggi", title: "경기권", stations: gyunggiStations });
  }
  return sections;
}

// dateKey("2025-11-23") -> "11/23"
function formatHeaderDate(dateKey) {
  if (!dateKey) return "";
  const [, m, d] = dateKey.split("-");
  return `${Number(m)}/${Number(d)}`;
}

function DispatchPlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dateKey, quotes } = location.state || {};

  // 넘어온 quotes로 섹션 구성 (없으면 빈 배열)
  const [sections, setSections] = useState(() =>
    buildSectionsFromQuotes(quotes)
  );

  // 픽업 일정 접기/펼치기
  const [pickupOpen, setPickupOpen] = useState(true);

  // 탑승 시간 (역별) – 동적으로 쓰이므로 빈 객체에서 시작
  const [pickupTimes, setPickupTimes] = useState({});

  // 예상 예산 (숫자) + 메모
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetMemo, setBudgetMemo] = useState("");

  const selectedStations = useMemo(
    () =>
      sections
        .flatMap((sec) =>
          sec.stations.map((st) => ({
            ...st,
            areaId: sec.id,
            areaTitle: sec.title,
          }))
        )
        .filter((st) => st.selected),
    [sections]
  );

  const summary = useMemo(() => {
    const assignedAreas = new Set(
      selectedStations.map((st) => st.areaId)
    ).size;
    const selectedCount = selectedStations.length;
    const totalPeople = selectedStations.reduce(
      (sum, st) => sum + (st.people || 0),
      0
    );
    return { assignedAreas, selectedCount, totalPeople };
  }, [selectedStations]);

  const handleToggleStation = (sectionId, stationId) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              stations: sec.stations.map((st) =>
                st.id === stationId ? { ...st, selected: !st.selected } : st
              ),
            }
      )
    );
  };

  const handlePickupTimeChange = (stationId, value) => {
    setPickupTimes((prev) => ({
      ...prev,
      [stationId]: value,
    }));
  };

const [sendError, setSendError] = useState("");
const [sending, setSending] = useState(false);

const handleSendPlan = async () => {
  setSendError("");

  if (!dateKey) {
    setSendError("날짜 정보가 없습니다. 다시 시도해 주세요.");
    return;
  }
  if (selectedStations.length === 0) {
    setSendError("전송할 역이 없습니다. 역을 선택해 주세요.");
    return;
  }

  // pickupTime 누락 검증 (선택된 역만)
  const missingTime = selectedStations.find((st) => !pickupTimes[st.id]);
  if (missingTime) {
    setSendError(`탑승 시간이 비어있습니다: ${missingTime.name}`);
    return;
  }

  // locationId 누락 검증
  const missingLocId = selectedStations.find((st) => !st.locationId && st.locationId !== 0);
  if (missingLocId) {
    setSendError(`locationId가 없습니다: ${missingLocId.name}`);
    return;
  }

  const totalPassengerCount = selectedStations.reduce(
    (sum, st) => sum + Number(st.people || 0),
    0
  );

  const totalCost = budgetAmount && !Number.isNaN(Number(budgetAmount))
    ? Number(budgetAmount)
    : 0;

  const body = {
    date: dateKey, // "YYYY-MM-DD"
    totalPassengerCount,
    totalCost,
    stops: selectedStations.map((st) => ({
      locationId: st.locationId,
      pickupTime: pickupTimes[st.id], // "HH:mm"
    })),
    note: budgetMemo || "",
  };

  try {
    setSending(true);
    const res = await api.post(SEND_PLAN_API, body);
    // console.log(res)
    const createdId = res.data.data.routeId;
    // console.log(createdId);

    // 상세 페이지에 방금 전송한 데이터를 그대로 넘김
    navigate( 
      createdId ? `/agency-mypage/sent-dispatch/${createdId}` : "/agency-mypage/sent-dispatch/new",
      {
        state: {
          justSentPlan: {
            // 헤더 정보
            date: body.date,
            totalPassengerCount: body.totalPassengerCount,
            totalCost: body.totalCost,
            note: body.note,
            // 픽업 목록 그대로
            stops: body.stops,
            // UI에 필요한 추가 정보(선택 역 원본)
            selectedStations,
            pickupTimes,
          },
        },
      }
    );
  } catch (e) {
    setSendError("배차 계획 전송에 실패했습니다.");
  } finally {
    setSending(false);
  }
};

  const dayStats = useMemo(() => {
    const people = selectedStations.reduce(
      (sum, st) => sum + (st.people || 0),
      0
    );
    const count = selectedStations.length;
    return { people, count };
  }, [selectedStations]);

  const formattedBudget =
    budgetAmount && !Number.isNaN(Number(budgetAmount))
      ? `${Number(budgetAmount).toLocaleString()}원`
      : "-";

  const headerDate = formatHeaderDate(dateKey); // "(11/23)" 용

  return (
    <div className="dispatch-page">
      <Header />
      <main className="dispatch-main">
        <div className="dispatch-layout">
          {/* 왼쪽 메인 영역 */}
          <div className="dispatch-left">
            {/* 1. 배차 계획 세우기 */}
            <section className="dispatch-section">
              <div className="section-title-row">
                <div className="section-step-circle">1</div>
                <div>
                  <h2 className="section-title">
                    {headerDate
                      ? `(${headerDate}) 배차 계획 세우기`
                      : "배차 계획 세우기"}
                  </h2>
                  <p className="section-sub">
                    픽업 지역별 여행객의 역별 탑승 시간을 설정한 후,
                    사용자에게 배차 계획을 전송하세요.
                  </p>
                </div>
              </div>

              {/* 서울권 / 경기권 카드들 */}
              {sections.map((sec) => (
                <div key={sec.id} className="area-block">
                  <div className="station-grid">
                    {sec.stations.map((st) => {
                      const isSelected = st.selected;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          className={
                            "station-card" +
                            (isSelected ? " selected" : "")
                          }
                          onClick={() =>
                            handleToggleStation(sec.id, st.id)
                          }
                        >
                          <div className="station-main-row">
                            <div className="station-name">{st.name}</div>
                            <div className="station-badge">
                              {st.people}명
                            </div>
                          </div>
                          <div className="station-sub-row">
                            <span className="station-line">{st.line}</span>
                            <span className="station-meta">소요 5분</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {sections.length === 0 && (
                <p className="time-empty">
                  전달받은 견적 데이터가 없습니다. 마이페이지에서 일자를
                  선택한 뒤 이동해 주세요.
                </p>
              )}
            </section>

            {/* 2. 탑승 시간 설정 */}
            <section className="dispatch-section">
              <div className="section-title-row">
                <div className="section-step-circle">2</div>
                <h2 className="section-title">탑승 시간 설정</h2>
              </div>

              <div className="time-list">
                {selectedStations.map((st) => (
                  <div key={st.id} className="time-row">
                    <div className="time-station">
                      <span className="time-station-name">{st.name}</span>
                      <span className="time-station-people">
                        {st.people}명
                      </span>
                    </div>
                    <div className="time-input-wrap">
                      <span className="time-label">탑승 시간</span>
                      <input
                        type="time"
                        className="time-input"
                        value={pickupTimes[st.id] || ""}
                        onChange={(e) =>
                          handlePickupTimeChange(st.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                {selectedStations.length === 0 && (
                  <p className="time-empty">
                    선택된 역이 없습니다. 상단에서 역을 먼저 선택해 주세요.
                  </p>
                )}
              </div>
            </section>

            {/* 3. 예상 예산 작성 */}
            <section className="dispatch-section">
              <div className="section-title-row">
                <div className="section-step-circle">3</div>
                <h2 className="section-title">예상 예산 작성</h2>
              </div>

              <div className="budget-wrapper">
                <label className="budget-label">
                  총 예상 예산
                  <div className="budget-input-row">
                    <input
                      type="number"
                      className="budget-input"
                      placeholder="예: 250000"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                    />
                    <span className="budget-unit">원</span>
                  </div>
                  <p className="budget-help">
                    숫자만 입력해 주세요. (자동으로 , 단위 없이 저장됩니다)
                  </p>
                </label>

                <label className="budget-label">
                  예산 메모
                  <textarea
                    className="estimate-textarea"
                    rows={3}
                    placeholder="예상 비용 산출 근거, 포함/제외 사항 등을 작성해 주세요."
                    value={budgetMemo}
                    onChange={(e) => setBudgetMemo(e.target.value)}
                  />
                </label>
              </div>
            </section>
          </div>

          {/* 오른쪽 요약 영역 */}
          <aside className="dispatch-right">
            <section className="summary-card">
              <div className="summary-header">
                <div className="section-step-circle small">4</div>
                <h3 className="summary-title">배차 계획 요약</h3>
              </div>

              <div className="summary-body">
                <div className="summary-row">
                  <span>배정 구역</span>
                  <span className="summary-value">
                    {summary.assignedAreas}개
                  </span>
                </div>
                <div className="summary-row">
                  <span>선택 수</span>
                  <span className="summary-value">
                    {summary.selectedCount}건
                  </span>
                </div>
                <div className="summary-row">
                  <span>총 인원</span>
                  <span className="summary-value">
                    {dayStats.people}명
                  </span>
                </div>
                <div className="summary-row">
                  <span>총 예산</span>
                  <span className="summary-value">{formattedBudget}</span>
                </div>

                <hr className="summary-divider" />

                <div className="summary-subtitle-row">
                  <div className="summary-subtitle">픽업 일정</div>
                  <button
                    type="button"
                    className="summary-toggle"
                    onClick={() => setPickupOpen((s) => !s)}
                  >
                    {pickupOpen ? "접기" : "펼치기"}
                  </button>
                </div>

                {selectedStations.length === 0 && (
                  <div className="summary-empty">선택된 역이 없습니다.</div>
                )}

                {selectedStations.length > 0 && pickupOpen &&
                  selectedStations.map((st) => (
                    <div key={st.id} className="summary-pickup-row">
                      <span className="summary-pickup-name">{st.name}</span>
                      <span className="summary-pickup-time">
                        {pickupTimes[st.id] || "--:--"}
                      </span>
                    </div>
                  ))}

                {selectedStations.length > 0 && !pickupOpen && (
                  <div className="summary-collapsed">
                    선택된 픽업 {selectedStations.length}건
                  </div>
                )}
              </div>

              {sendError && <div className="error-text">{sendError}</div>}

              <button
                type="button"
                className="summary-submit-btn"
                onClick={handleSendPlan}
                disabled={sending}
              >
                {sending ? "전송중..." : "배차 계획 전송하기"}
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default DispatchPlan;
