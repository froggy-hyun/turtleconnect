import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/QuoteDetailPage.css";
import Header from "../../components/Header";
import logoTurtle from "../../assets/logo-turtle.png";

export default function QuoteDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 페이지에서 넘겨준 데이터 받기 (없으면 기본값)
  const { tripInfo } = location.state || { 
    tripInfo: { 
      title: "정보 없음", 
      date: "-", 
      people: 0, 
      pickup: "-",
      id: null
    } 
  };

  // 1. 상태 관리
  const [selectedId, setSelectedId] = useState(null); 
  const [pendingId, setPendingId] = useState(null);   
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // 목업 데이터
  const quotes = [
    {
      id: 1,
      agencyName: "거북섬 여행사",
      agencyBadge: "거",
      date: "2025. 12. 01. 출발",
      totalPrice: "20,000",
      perPerson: "10,000",
      priceRange: "20,000원 ~ 30,000원",
      time: "09:00",
      message: "안전한 여행을 위해 최선을 다하겠습니다.",
      bankInfo: {
        account: "기업은행 123-456-789012",
        holder: "거북섬 여행사",
        contact: "010-9876-5432",
        email: "info@turtle.com",
        manager: "김여행"
      }
    },
    {
      id: 2,
      agencyName: "터틀 트래블",
      agencyBadge: "터",
      date: "2025. 12. 01. 출발",
      totalPrice: "24,000",
      perPerson: "12,000",
      priceRange: "24,000원 ~ 34,000원",
      time: "09:30",
      message: "최고의 서비스를 제공하겠습니다.",
      bankInfo: {
        account: "국민은행 987-654-321098",
        holder: "터틀 트래블",
        contact: "010-1111-2222",
        email: "support@turtletravel.com",
        manager: "박터틀"
      }
    }
  ];

  // 마이페이지 확정 상태 동기화
  useEffect(() => {
    // 1. 로컬 스토리지에서 확정된 여행 목록 가져오기
    const confirmedTrips = JSON.parse(localStorage.getItem("confirmedTrips") || "[]");

    // 2. 현재 페이지의 여행(tripInfo.id)과 일치하는 확정 내역 찾기
    // tripInfo.id는 UserMyPage에서 넘어온 여행 고유 ID입니다.
    const matchedTrip = confirmedTrips.find(item => item.tripInfo.id === tripInfo.id);

    if (matchedTrip) {
      // 3. 확정 내역이 있다면, 해당 견적의 ID를 선택 상태로 설정
      // (QuoteCard가 자동으로 초록색이 됨)
      setSelectedId(matchedTrip.quoteInfo.id);
    } else {
      // 4. 확정 내역이 없다면 (마이페이지에서 취소했다면), 선택 해제
      setSelectedId(null);
    }
  }, [tripInfo]); // tripInfo가 로드될 때 실행

  // 2. 버튼 클릭 핸들러
  const handleSelectClick = (id) => {
    if (selectedId === id) return;

    // 2. 다른 견적이 이미 선택되어 있다면(확정 상태), 변경 불가 알림
    if (selectedId !== null) {
      alert("이미 확정된 견적이 있습니다.\n변경하시려면 마이페이지에서 기존 예약을 취소해주세요.");
      return;
    }

    setPendingId(id);    
    setIsModalOpen(true); 
  };

  // 3. 모달 확인 핸들러
  const handleConfirmSelect = () => {
    // 선택된 견적 데이터 찾기
    const finalQuote = quotes.find(q => q.id === pendingId);
    
    if (finalQuote) {
      // 로컬 스토리지에 저장할 데이터 객체 생성
      const confirmedTrip = {
        id: Date.now(), // 고유 ID 생성
        tripInfo: tripInfo, // 여행지 정보 (UserMyPage에서 넘어온 것)
        quoteInfo: finalQuote, // 선택한 여행사 견적 정보
        confirmedAt: new Date().toLocaleDateString() // 확정 날짜
      };

      // 기존 데이터 가져오기
      const existingTrips = JSON.parse(localStorage.getItem("confirmedTrips") || "[]");
      
      // 중복 저장 방지
      const filteredTrips = existingTrips.filter(t => t.tripInfo.id !== tripInfo.id);

      // 새 데이터 추가하여 저장
      localStorage.setItem("confirmedTrips", JSON.stringify([confirmedTrip, ...existingTrips]));
      
      console.log("저장 완료:", confirmedTrip);
    }

    setSelectedId(pendingId); 
    setIsModalOpen(false);    
    setPendingId(null);       
    
    alert("견적 선택이 완료되었습니다! 마이페이지로 이동합니다.");
    navigate("/usermypage");
  };

  return (
    <div className="qd-wrapper">
      <Header />
      
      <main className="qd-container">
        <div className="qd-back-link" onClick={() => navigate(-1)}>
          <span className="arrow">‹</span> 목록으로 돌아가기
        </div>

        <TripSummaryCard info={tripInfo} />

        <div className="qd-list-header">
          <h2>받은 견적서 ({quotes.length})</h2>
          <p>여행사별 견적을 비교하고 최적의 상품을 선택하세요</p>
        </div>

        <div className="qd-quote-list">
          {quotes.map((quote) => {
            // 현재 이 카드가 선택되었는지 확인
          const isCurrentSelected = selectedId === quote.id;
          // 다른 어떤 카드라도 선택된 상태인지 확인 (잠금 여부)
          // selectedId가 존재하는데, 그게 나(quote.id)는 아닐 때 -> 잠김
          const isLocked = (selectedId !== null) && (!isCurrentSelected);
            return (
            <QuoteCard 
              key={quote.id} 
              data={quote} 
              isSelected={selectedId === quote.id} 
              onSelect={() => handleSelectClick(quote.id)}
            />
            );
          })}
        </div>
      </main>

      {/* 모달 */}
      {isModalOpen && (
        <ConfirmationModal 
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmSelect}
        />
      )}
    </div>
  );
}

// --- 하위 컴포넌트들 ---

function ConfirmationModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">✨</div>
        <h3>이 견적으로 진행하시겠어요?</h3>
        <p>
          선택 시 해당 여행사에게 <strong>매칭 알림</strong>이 전송되며,<br/>
          입금 계좌 정보가 공개됩니다.
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>취소</button>
          <button className="btn-confirm" onClick={onConfirm}>확인 및 선택</button>
        </div>
      </div>
    </div>
  );
}

function TripSummaryCard({ info }) {
  return (
    <section className="trip-summary-card">
      <h1>{info.title} 출발 거북섬 여행</h1>
      
      <div className="ts-badges">
        <div className="ts-badge-item">
          <div className="ts-icon">📅</div>
          <div className="ts-text">
            <span className="label">여행 기간</span>
            <span className="value">{info.date}</span>
          </div>
        </div>
        <div className="ts-badge-item">
          <div className="ts-icon">👥</div>
          <div className="ts-text">
            <span className="label">인원</span>
            <span className="value">{info.people}명</span>
          </div>
        </div>
        <div className="ts-badge-item">
          <div className="ts-icon">📍</div>
          <div className="ts-text">
            <span className="label">픽업 장소</span>
            <span className="value">{info.pickup}</span>
          </div>
        </div>
      </div>
      <div className="ts-status-badge">견적 완료</div>
    </section>
  );
}

function QuoteCard({ data, isSelected, isLocked, onSelect }) {
  // 버튼 텍스트 결정 로직
  let buttonText = "이 견적 선택하기";
  if (isSelected) buttonText = "✔ 선택된 견적입니다";
  if (isLocked) buttonText = "이미 확정된 건이 있습니다";

  return (
    <div className={`quote-card ${isSelected ? "selected" : ""} ${isLocked ? "locked" : ""}`}>
      {isSelected && <div className="selected-label">✔ 선택됨</div>}

      <div className="qc-header">
        <div className="agency-avatar">{data.agencyBadge}</div>
        <div className="agency-info"><h3>{data.agencyName}</h3><p>{data.date}</p></div>
      </div>
      <div className="qc-price-box">
        <div className="price-item"><span className="label">총 금액</span><span className="value-main">{data.totalPrice}원</span></div>
        <div className="price-item"><span className="label">1인당 금액</span><span className="value-sub">{data.perPerson}원</span></div>
      </div>
      <div className="qc-details">
        <div className="detail-row"><span className="icon">💳</span><div className="text-group"><span className="label">가격 범위</span><span className="value">{data.priceRange}</span></div></div>
        <div className="detail-row"><span className="icon">🕒</span><div className="text-group"><span className="label">픽업 시간</span><span className="value">{data.time}</span></div></div>
        <div className="detail-row message"><span className="icon">💬</span><div className="text-group"><span className="label">여행사 메시지</span><div className="message-box">{data.message}</div></div></div>
      </div>
      {isSelected && (
        <div className="qc-bank-info">
          <h4>💳 입금 및 연락처 정보</h4>
          <p><strong>입금 계좌:</strong> {data.bankInfo.account}</p>
          <p><strong>예금주:</strong> {data.bankInfo.holder}</p>
          <p><strong>연락처:</strong> {data.bankInfo.contact}</p>
        </div>
      )}

      {/* 버튼: 선택되었거나(selected) 잠겼으면(locked) 클릭 방지 */}
      <button 
        className={`btn-select-quote ${isSelected ? "selected" : ""} ${isLocked ? "disabled" : ""}`} 
        onClick={onSelect}
        disabled={isSelected || isLocked} // 버튼 자체를 비활성화
      >
        {buttonText}
      </button>
    </div>
  );
}