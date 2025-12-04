// src/pages/agency/AgencyMypage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/quote-manage.css";

// 월별 / 일별 더미 데이터
const QUOTE_DATA = {
  // 11월
  "2025-11-20": [
    { id: 1, station: "강남역", line: "2호선 / 신분당선", people: 13, count: 4 },
    { id: 2, station: "서울역", line: "1/4호선 / KTX / 공항철도", people: 13, count: 3 },
    { id: 3, station: "신도림역", line: "1/2호선", people: 12, count: 3 },
    { id: 4, station: "홍대입구역", line: "2호선 / 경의중앙선 / 공항철도", people: 10, count: 3 },
    { id: 5, station: "잠실역", line: "2/8호선", people: 8, count: 2 },
    { id: 6, station: "합정역", line: "2/6호선", people: 8, count: 2 },
    { id: 7, station: "수원역", line: "1호선 / 분당선 / KTX", people: 12, count: 3 },
    { id: 8, station: "안산중앙역", line: "4호선", people: 11, count: 3 },
    { id: 9, station: "부천종합운동장역", line: "7호선", people: 14, count: 3 },
    { id: 10, station: "인천대입구역", line: "수인선", people: 7, count: 2, wide: true },
  ],
  "2025-11-21": [
    { id: 11, station: "서울역", line: "1/4호선 / KTX / 공항철도", people: 20, count: 5 },
    { id: 12, station: "강남역", line: "2호선 / 신분당선", people: 15, count: 4 },
  ],
  "2025-11-22": [
    { id: 13, station: "수원역", line: "1호선 / 분당선 / KTX", people: 18, count: 3 },
  ],
  "2025-11-23": [
    { id: 14, station: "신도림역", line: "1/2호선", people: 9, count: 2 },
  ],

  // 9월 예시
  "2025-09-03": [
    { id: 21, station: "강남역", line: "2호선 / 신분당선", people: 10, count: 3 },
    { id: 22, station: "서울역", line: "1/4호선 / KTX / 공항철도", people: 8, count: 2 },
  ],
  "2025-09-10": [
    { id: 23, station: "수원역", line: "1호선 / 분당선 / KTX", people: 16, count: 4 },
  ],
  "2025-09-21": [
    { id: 24, station: "부천종합운동장역", line: "7호선", people: 13, count: 3, wide: true },
  ],
};

// 선택한 연/월에 대해 데이터가 있는 날짜만 뽑기
function getDatesForMonth(year, month) {
  if (!year || !month) return [];
  const ym = `${year}-${month.toString().padStart(2, "0")}`;
  return Object.keys(QUOTE_DATA)
    .filter((d) => d.startsWith(ym))
    .sort();
}

// "11월 20일" 형태 라벨
function formatDateLabel(dateStr) {
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}월 ${Number(d)}일`;
}

// 선택된 "월" 기준 전체 인원·요청 건수 합계
function getMonthStats(dates) {
  let totalPeople = 0;
  let totalCount = 0;

  dates.forEach((date) => {
    const list = QUOTE_DATA[date] || [];
    list.forEach((req) => {
      totalPeople += req.people || 0;
      totalCount += req.count || 0;
    });
  });

  return { totalPeople, totalCount };
}

// 버튼에 표시할 "2025년 11월" 라벨
function formatMonthLabel(year, month) {
  if (!year || !month) return "전체 기간";
  return `${year}년 ${Number(month)}월`;
}

function QuoteManage() {
  const navigate = useNavigate();

  // 기본값: 2025년 11월
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("11");

  const [availableDates, setAvailableDates] = useState(() =>
    getDatesForMonth("2025", "11")
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = getDatesForMonth("2025", "11");
    return dates[0] ?? null;
  });

  const { totalPeople: monthPeople, totalCount: monthCount } =
    getMonthStats(availableDates);

  const requestsForSelected = selectedDate
    ? QUOTE_DATA[selectedDate] || []
    : [];

  // 일별(선택된 날짜) 기준 합계
  const dayPeople = requestsForSelected.reduce(
    (sum, r) => sum + (r.people || 0),
    0
  );
  const dayCount = requestsForSelected.reduce(
    (sum, r) => sum + (r.count || 0),
    0
  );

  const handleSearch = () => {
    const dates = getDatesForMonth(year, month);
    setAvailableDates(dates);
    setSelectedDate(dates[0] ?? null);
  };

  const demandDateLabel = selectedDate
    ? formatDateLabel(selectedDate)
    : formatMonthLabel(year, month);

  // Dispatch 페이지로 state 넘기기
  const handleGoDispatch = () => {
    if (!selectedDate) return;
    navigate("/agency-mypage/dispatch", {
      state: {
        dateKey: selectedDate,            // "2025-11-23"
        quotes: requestsForSelected,      // 선택된 일자의 역 리스트
      },
    });
  };

  return (
    <div className="agency-page">
      <Header />
      <main className="agency-main">
        {/* 2. 견적 요청 관리 박스 */}
        <section className="agency-card quote-card">
          {/* 상단 타이틀 */}
          <div className="quote-header">
            <div>
              <h2 className="card-title">견적 요청 관리</h2>
              <p className="section-desc">
                현재 접수된 다수 여행객의 여행각지별 신청 건을 확인할 수 있습니다.
              </p>
            </div>
            {/* 여기서는 '선택된 월' 기준 총 건수 유지 */}
            <button className="quote-total-btn">총 {monthCount}건</button>
          </div>

          {/* 날짜 필터 라벨 */}
          <div className="quote-filter-label">
            <span className="icon-calendar" />
            <span>날짜별 필터</span>
          </div>

          {/* 년/월 필터 + 조회 버튼 */}
          <div className="quote-month-filter">
            <select
              className="month-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">연도 선택</option>
              <option value="2024">2024년</option>
              <option value="2025">2025년</option>
              <option value="2026">2026년</option>
            </select>

            <select
              className="month-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">월 선택</option>
              <option value="1">1월</option>
              <option value="2">2월</option>
              <option value="3">3월</option>
              <option value="4">4월</option>
              <option value="5">5월</option>
              <option value="6">6월</option>
              <option value="7">7월</option>
              <option value="8">8월</option>
              <option value="9">9월</option>
              <option value="10">10월</option>
              <option value="11">11월</option>
              <option value="12">12월</option>
            </select>

            <button className="quote-search-btn" onClick={handleSearch}>
              조회
            </button>
          </div>

          {/* 일별 버튼 - 이걸 누를 때마다 selectedDate와 하단 통계가 갱신됨 */}
          <div className="quote-date-tabs">
          {availableDates.length === 0 ? (
            <span className="no-date">선택한 월에 대한 견적 요청이 없습니다.</span>
          ) : (
            availableDates.map((date) => {
            const dayList = QUOTE_DATA[date] || [];
            const dayTotal = dayList.reduce((sum, r) => sum + (r.count || 0), 0);

            return (
                <button
                key={date}
                className={
                    "date-pill" + (date === selectedDate ? " active" : "")
                }
                onClick={() => setSelectedDate(date)}
                >
                <span>{formatDateLabel(date)}</span>

                {/* 날짜별 총 건수 배지 */}
                <span className="date-count">{dayTotal}</span>
                </button>
            );
            })
          )}
          </div>

          {/* 선택된 날짜의 견적 카드 그리드 */}
          {requestsForSelected.length > 0 && (
            <div className="request-grid">
              {requestsForSelected.map((req) => (
                <article
                  key={req.id}
                  className={
                    "request-card" + (req.wide ? " request-card-wide" : "")
                  }
                >
                  <div className="request-header">
                    <div className="request-title-block">
                      <span className="icon-location" />
                      <div>
                        <div className="request-title">{req.station}</div>
                        <div className="request-sub">{req.line}</div>
                      </div>
                    </div>
                    <div className="request-people">
                      <span className="icon-person" />
                      <span>{req.people}명</span>
                    </div>
                  </div>

                  <div className="request-footer">
                    <button className="badge-count">{req.count}건</button>
                    <button className="btn-link">상세보기</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 3. 전체 수요 현황 박스 */}
        <section className="agency-card demand-card">
          <div className="demand-header-row">
            <h2 className="card-title">전체 수요 현황</h2>

            <button className="demand-date-btn">
              <span className="icon-calendar" />
              {demandDateLabel}
            </button>
          </div>

          <div className="demand-stats-row">
            <div className="demand-stat">
              <div className="field-label">전체 인원</div>
              <button className="demand-link">{dayPeople}명</button>
            </div>
            <div className="demand-stat">
              <div className="field-label">전체 요청</div>
              <div className="field-value strong">{dayCount}건</div>
            </div>
          </div>

          <button className="demand-main-btn" onClick={handleGoDispatch}>
            전체 배차 계획 세우기
          </button>
        </section>
      </main>
    </div>
  );
}

export default QuoteManage;
