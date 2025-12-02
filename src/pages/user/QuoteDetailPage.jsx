import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/QuoteDetailPage.css";
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
      pickup: "-" 
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
        contact: "010-9876-5432"
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
        contact: "010-1111-2222"
      }
    }
  ];

  // 2. 버튼 클릭 핸들러
  const handleSelectClick = (id) => {
    if (selectedId === id) return;
    setPendingId(id);    
    setIsModalOpen(true); 
  };

  // 3. 모달 확인 핸들러
  const handleConfirmSelect = () => {
    setSelectedId(pendingId); 
    setIsModalOpen(false);    
    setPendingId(null);       
    console.log(`여행사(ID: ${pendingId})에게 선택 알림 전송 완료!`);
  };

  return (
    <div className="qd-wrapper">
      <Header navigate={navigate} />
      
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
          {quotes.map((quote) => (
            <QuoteCard 
              key={quote.id} 
              data={quote} 
              isSelected={selectedId === quote.id} 
              onSelect={() => handleSelectClick(quote.id)}
            />
          ))}
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

function Header({ navigate }) {
  return (
    <header className="tc-header">
      <div className="tc-header__left" onClick={() => navigate("/")} style={{cursor:'pointer'}}>
        <img src={logoTurtle} alt="로고" className="tc-header__logo-icon" />
        <div className="tc-header__logo-text">
          <div className="tc-header__logo-title">거북섬 커넥트</div>
          <div className="tc-header__logo-sub">Turtle Connect</div>
        </div>
      </div>
      <nav className="tc-header__nav">
        <button onClick={() => navigate("/")}>홈</button>
        <button>축제 & 관광지</button>
      </nav>
      <div className="tc-header__right">
        <div className="user-status">
          <span className="active-text">마이페이지</span>
          <img src="https://placehold.co/40x40" alt="프로필" className="header-avatar"/>
        </div>
        <button className="btn-logout" onClick={() => navigate("/")}>로그아웃</button>
      </div>
    </header>
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

function QuoteCard({ data, isSelected, onSelect }) {
  return (
    <div className={`quote-card ${isSelected ? "selected" : ""}`}>
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
      <button className={`btn-select-quote ${isSelected ? "selected" : ""}`} onClick={onSelect}>
        {isSelected ? "✔ 선택된 견적입니다" : "이 견적 선택하기"}
      </button>
    </div>
  );
}