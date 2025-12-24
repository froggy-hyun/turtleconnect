import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/quote-manage.css";
import api from "../../api/axiosConfig";

const MONTHLY_API = "/api/agency/requests/dates";
const DAILY_SUMMARY_API = "/api/agency/requests/summary";
const BY_LOCATION_API = "/api/agency/requests/by-location";

const formatDateLabel = (date) => {
  const [, m, d] = date.split("-");
  return `${Number(m)}월 ${Number(d)}일`;
};

export default function QuoteManage() {
  const navigate = useNavigate();

  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("11");

  const [monthlyList, setMonthlyList] = useState([]); // [{date, requestCount}]
  const [selectedDate, setSelectedDate] = useState(null);

  const [dailySummary, setDailySummary] = useState({
    totalRequests: 0,
    totalPeople: 0,
  });

  const [locations, setLocations] = useState([]); // [{locationId, locationName, requestCount, totalPeople}]

  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);
  const [error, setError] = useState("");

  const monthTotal = useMemo(
    () => monthlyList.reduce((sum, d) => sum + (d.requestCount || 0), 0),
    [monthlyList]
  );

  const fetchMonthly = async () => {
    setLoadingMonth(true);
    setError("");

    try {
      const res = await api.get(MONTHLY_API, {
        params: { year: Number(year), month: Number(month) },
      });

      // 월별 응답: { success, data: [{date, requestCount}], error }
      const list = res.data?.data ?? [];
      const cleaned = list.map((item) => ({
        date: item.date,
        requestCount: Number(item.requestCount || 0),
      }));

      setMonthlyList(cleaned);

      const firstDate = cleaned[0]?.date ?? null;
      setSelectedDate(firstDate);

      if (firstDate) {
        await fetchDailyData(firstDate);
      } else {
        setDailySummary({ totalRequests: 0, totalPeople: 0 });
        setLocations([]);
      }
    } catch {
      setError("월별 데이터를 불러오지 못했습니다.");
      setMonthlyList([]);
      setSelectedDate(null);
      setDailySummary({ totalRequests: 0, totalPeople: 0 });
      setLocations([]);
    } finally {
      setLoadingMonth(false);
    }
  };

  // ✅ 날짜 클릭 시 summary + by-location 동시 반영
  const fetchDailyData = async (date) => {
    setLoadingDay(true);
    setError("");

    try {
      const [summaryRes, locRes] = await Promise.all([
        api.get(DAILY_SUMMARY_API, { params: { date } }),
        api.get(BY_LOCATION_API, { params: { date } }),
      ]);

      // summary 응답: { totalRequests, totalPeople }
      setDailySummary({
        totalRequests: Number(summaryRes.data?.totalRequests || 0),
        totalPeople: Number(summaryRes.data?.totalPeople || 0),
      });

      // by-location 응답: { success, data: [...], error }
      const locList = locRes.data?.data ?? [];
      setLocations(
        locList.map((x) => ({
          locationId: x.locationId,
          locationName: x.locationName,
          requestCount: Number(x.requestCount || 0),
          totalPeople: Number(x.totalPeople || 0),
        }))
      );
    } catch {
      setError("일별 데이터를 불러오지 못했습니다.");
      setDailySummary({ totalRequests: 0, totalPeople: 0 });
      setLocations([]);
    } finally {
      setLoadingDay(false);
    }
  };

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    await fetchDailyData(date);
  };

  const goDispatch = () => {
    if (!selectedDate) return;

    // ✅ DispatchPlan이 기존에 쓰던 형태로 변환해서 전달
    const quotesForDispatch = locations.map((loc) => ({
      startDate: selectedDate,                 // YYYY-MM-DD
      locationName: loc.locationName,          // "홍대입구역"
      participantCount: loc.totalPeople,       // 인원수
      requestCount: loc.requestCount,          // (있으면 유용, 기존 로직이 안 쓰면 무시됨)
      locationId: loc.locationId,              // (있으면 유용)
    }));

    navigate("/agency-mypage/dispatch", {
      state: {
        dateKey: selectedDate,   // 기존에 쓰던 키가 있으면 유지
        quotes: quotesForDispatch, // ✅ 기존 로직 재사용 핵심
      },
    });
  };


  const totalRequestCount = useMemo(
    () => locations.reduce((sum, l) => sum + (l.requestCount || 0), 0),
    [locations]
  );

  const totalPeopleCount = useMemo(
    () => locations.reduce((sum, l) => sum + (l.totalPeople || 0), 0),
    [locations]
  );


  return (
    <div className="agency-page">
      <Header />
      <main className="agency-main">
        <section className="agency-card quote-card">
          <div className="quote-header">
            <div>
              <h2 className="card-title">견적 요청 관리</h2>
              <p className="section-desc">날짜별 견적 요청 건수를 확인할 수 있습니다.</p>
            </div>
            <button className="quote-total-btn">총 {monthTotal}건</button>
          </div>

          <div className="quote-month-filter">
            <select className="month-select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">연도 선택</option>
              <option value="2024">2024년</option>
              <option value="2025">2025년</option>
              <option value="2026">2026년</option>
            </select>

            <select className="month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">월 선택</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={String(m)}>
                  {m}월
                </option>
              ))}
            </select>

            <button className="quote-search-btn" onClick={fetchMonthly} disabled={loadingMonth}>
              {loadingMonth ? "조회중..." : "조회"}
            </button>
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="quote-date-tabs">
            {monthlyList.length === 0 ? (
              <span className="no-date">{loadingMonth ? "불러오는 중..." : "요청 데이터가 없습니다."}</span>
            ) : (
              monthlyList.map((d) => (
                <button
                  key={d.date}
                  className={`date-pill ${selectedDate === d.date ? "active" : ""}`}
                  onClick={() => handleDateClick(d.date)}
                  disabled={loadingDay && selectedDate === d.date}
                >
                  <span>{formatDateLabel(d.date)}</span>
                  <span className="date-count">{d.requestCount}</span>
                </button>
              ))
            )}
          </div>

          {/* ✅ 하단 역 카드: by-location 데이터로 렌더 */}
          <div className="request-grid">
            {loadingDay ? (
              <div className="no-request">불러오는 중...</div>
            ) : locations.length === 0 ? (
              <div className="no-request">해당 날짜의 역별 요청이 없습니다.</div>
            ) : (
              locations.map((loc) => (
                <div key={loc.locationId} className="request-card">
                  <div className="request-header">
                  <div className="request-title-block">
                    <span className="icon-location" />
                    <div>
                      <div className="request-title">{loc.locationName}</div>
                    </div>
                  </div>
                  <div className="request-people">
                    <span className="icon-person" />
                    <span>{loc.totalPeople}명</span>
                  </div>
                </div>

                <div className="request-footer">
                  <button className="badge-count">{loc.requestCount}건</button>
                  <button className="btn-link">상세보기</button>
                </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="agency-card demand-card">
          <div className="demand-header-row">
            <h2 className="card-title">전체 수요 현황</h2>
            <button className="demand-date-btn">
              {selectedDate ? formatDateLabel(selectedDate) : "-"}
            </button>
          </div>

          <div className="demand-stats-row">
            <div className="demand-stat">
              <div className="field-label">전체 인원</div>
              <div className="field-value">
                {loadingDay ? "..." : `${totalPeopleCount}명`}
              </div>
            </div>

            <div className="demand-stat">
              <div className="field-label">전체 요청</div>
              <div className="field-value strong">
                {loadingDay ? "..." : `${totalRequestCount}건`}
              </div>
            </div>
          </div>

          <button
            className="demand-main-btn"
            onClick={goDispatch}
            disabled={!selectedDate}
          >
            전체 배차 계획 세우기
          </button>
        </section>

      </main>
    </div>
  );
}
