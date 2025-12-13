// src/pages/TurtleConnectMain.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTourRequest } from "../api/tourApi";
import "../styles/main-and-booking.css";
import Header from "../components/Header";
import banner from "../assets/banner.png"
import Footer from "../components/Footer";
import userImg from "../assets/Ellipse.png";

const LOCATION_MAP = {
  "강남역": 1,
  "서울역": 2,
  "신도림역": 3,
  "홍대입구역": 4,
  "잠실역": 5,
  "합정역": 6,
  "수원역": 7,
  "안산 중앙역": 8,
  "부천종합운동장역": 9,
  "인천대입구역": 10
};

const PICKUP_OPTIONS = [
  "강남역", "서울역", "신도림역", "홍대입구역", 
  "잠실역", "합정역", "수원역", "안산 중앙역", 
  "부천종합운동장역", "인천대입구역"
];

export default function TurtleConnectMain() {
  return (
    <div className="tc-root">
      <Header />
      <main className="tc-main">
        <Hero />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="tc-hero">
      <div className="tc-hero__bg">
        <img src={banner} alt="거북섬 배경" />
      </div>
      <div className="tc-hero__content">
        <p className="tc-hero__subtitle">
          복잡한 이동 계획은 이제 그만. 클릭 몇 번이면 충분합니다.
        </p>
        <h1 className="tc-hero__title-small">쉽고 편리한 거북섬 단체 이동</h1>
        <h2 className="tc-hero__title">터틀커넥트와 함께</h2>
      </div>
    </section>
  );
}

function BookingSection() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("강남역");
  const [isPickupOpen, setPickupOpen] = useState(false);
  const [people, setPeople] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]);

  const increase = () => setPeople((p) => Math.min(99, p + 1));
  const decrease = () => setPeople((p) => Math.max(1, p - 1));

  const handleSelectPickup = (value) => {
    setPickup(value);
    setPickupOpen(false);
  };

  const handleReset = () => {
    setPickup("강남역");
    setPeople(1);
    setSelectedDates([]);
  };

  const handleBooking = async () => {
    // 1. 로그인 체크
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role"); // 로그인 시 저장해둔 역할

    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    // 2. 역할 체크(TRAVELER만 가능)
    if (role !== "TRAVELER") {
      alert("여행자(TRAVELER) 회원만 견적을 신청할 수 있습니다.");
      return;
    }

    // 3. 유효성 검사
    if (selectedDates.length === 0) {
      alert("날짜를 선택해주세요.");
      return;
    }

    try {
      const locationId = LOCATION_MAP[pickup] || 1;

      const requestData = {
        locationId,
        startDates: selectedDates,
        participantCount: people,
      };

      const response = await createTourRequest(requestData);

      alert(`${selectedDates.length}건의 견적 신청이 완료되었습니다!`);
      navigate("/mypage");
    } catch (error) {
      console.error(error);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };


  return (
    <section className="tc-booking">
      <div className="tc-booking__card">
        {/* 왼쪽 - 나의 여행 계획 / 설명 */}
        <div className="tc-booking__column tc-booking__column--left">
          <h3 className="tc-section-title">나의 여행 계획</h3>
          <p className="tc-section-caption">
            여정 정보를 선택하고 다음 단계로 이동하세요.
          </p>

          <div className="tc-booking__participants">
            <div className="tc-booking__participants-name">
              거북섬으로 가장 편하게 가는 방법!
            </div>
          </div>

          <ul className="tc-booking__benefits">
            <li>✔ 간편한 단체 이동 예약</li>
            <li>✔ 인원·날짜·탑승지만 선택하면 끝</li>
            <li>✔ 합리적인 가격 제안서 비교</li>
            <li>✔ 투명한 시간표 &amp; 출발 스케줄 제공</li>
          </ul>

          <p className="tc-booking__hint">
            선택이 완료되면, <br />
            여행사가 제안한 견적서를 확인할 수 있어요.
          </p>
        </div>

        {/* 가운데 - 날짜 선택 */}
        <div className="tc-booking__column tc-booking__column--center">
          <h3 className="tc-section-title">날짜를 선택해주세요.</h3>
          <p className="tc-section-caption">
            원하는 날짜를 여러 개 선택할 수 있어요.
          </p>

          <Calendar
            selectedDates={selectedDates}      // ["2025-11-07", ...]
            onChange={setSelectedDates}        // 배열 전체를 갱신
          />

          <p className="tc-calendar-selected">
            {selectedDates.length === 0
              ? "선택한 날짜가 없습니다."
              : `선택한 날짜: ${selectedDates.join(", ")}`}
          </p>
        </div>

        {/* 오른쪽 - 탑승지 & 인원 선택 */}
        <div className="tc-booking__column tc-booking__column--right">
          <h3 className="tc-section-title">탑승지 선택</h3>

          <div className="tc-input-group">
            <label className="tc-input-label">탑승지</label>
            <div
              className="tc-select"
              onClick={() => setPickupOpen((open) => !open)}
            >
              <span>{pickup}</span>
              <span className="tc-select__arrow">▼</span>
            </div>
            {isPickupOpen && (
              <div className="tc-select__dropdown">
                {PICKUP_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className="tc-select__option"
                    onClick={() => handleSelectPickup(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="tc-input-group">
            <label className="tc-input-label">인원 선택</label>
            <div className="tc-number-input">
              <button
                type="button"
                className="tc-number-input__btn"
                onClick={decrease}
              >
                −
              </button>
              <div className="tc-number-input__value">{people}</div>
              <button
                type="button"
                className="tc-number-input__btn"
                onClick={increase}
              >
                +
              </button>
            </div>
          </div>

          <button className="tc-btn tc-btn--primary tc-booking__submit"
          onClick={handleBooking}>
            선택하기
          </button>

          <button
            type="button"
            className="tc-booking__reset"
            onClick={handleReset}
          >
            선택 초기화
          </button>
        </div>
      </div>
    </section>
  );
}

function Calendar({ selectedDates, onChange }) {
  // 초기 뷰: 2025년 11월 (Figma 디자인 기준)
  const initial = new Date(2025, 10, 1); // month = 10 → 11월
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth()); // 0~11

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 날짜 키를 "YYYY-MM-DD" 형태로 만들기
  const makeKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  // 해당 월 정보
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0(일)~6(토)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate(); // 말일

  const prevMonth = () => {
    let year = viewYear;
    let month = viewMonth - 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    setViewYear(year);
    setViewMonth(month);
  };

  const nextMonth = () => {
    let year = viewYear;
    let month = viewMonth + 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    setViewYear(year);
    setViewMonth(month);
  };

  const handleSelectDay = (day) => {
    const key = makeKey(viewYear, viewMonth, day);
    const exists = selectedDates.includes(key);

    const next = exists
      ? selectedDates.filter((d) => d !== key) // 다시 클릭 → 해제
      : [...selectedDates, key];              // 처음 클릭 → 추가

    onChange(next);
  };

  // 6주(6줄) 고정 그리드
  const weeks = [];
  let currentDay = 1 - firstDay;

  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay < 1 || currentDay > daysInMonth) {
        days.push(null);
      } else {
        days.push(currentDay);
      }
      currentDay++;
    }
    weeks.push(days);
  }

  return (
    <div className="tc-calendar">
      <div className="tc-calendar__header">
        <button
          type="button"
          className="tc-calendar__nav-btn"
          onClick={prevMonth}
        >
          ◀
        </button>
        <span className="tc-calendar__month">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          className="tc-calendar__nav-btn"
          onClick={nextMonth}
        >
          ▶
        </button>
      </div>

      <div className="tc-calendar__grid">
        {daysOfWeek.map((d) => (
          <div key={d} className="tc-calendar__dow">
            {d}
          </div>
        ))}

        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (!day) {
              return <div key={`${wi}-${di}`} className="tc-calendar__cell" />;
            }

            const key = makeKey(viewYear, viewMonth, day);
            const isSelected = selectedDates.includes(key);

            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                className={
                  "tc-calendar__cell" +
                  (isSelected ? " tc-calendar__cell--selected" : "")
                }
                onClick={() => handleSelectDay(day)}
              >
                {day}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
