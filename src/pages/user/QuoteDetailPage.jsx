import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/QuoteDetailPage.css";
import Header from "../../components/Header";
import api from "../../api/axiosConfig";

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

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  /// 마이페이지 확정 상태 동기화 및 견적 조회
  useEffect(() => {
    // ID가 없으면 아무것도 안 함
    if (!tripInfo.id && !tripInfo.tourRequestId) return;

    // 1. 견적 데이터 가져오기 (API 호출)
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        // tripInfo.id 혹은 tourRequestId 사용
        const requestId = tripInfo.id || tripInfo.tourRequestId;
        const res = await api.get(`/api/user/quotes/${requestId}`);
        
        // API 응답 구조 확인 (res.data.quotes가 맞는지)
        setQuotes(res.data.data?.quotes || []);
      } catch (e) {
        console.error("견적 조회 실패", e);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();

    // 2. 이미 확정된 건인지 확인 (로컬 스토리지)
    const confirmedTrips = JSON.parse(localStorage.getItem("confirmedTrips") || "[]");
    const matchedTrip = confirmedTrips.find(item =>
    item.tripInfo.tourRequestId === tripInfo.tourRequestId
    );


    if (matchedTrip) {
      setSelectedId(matchedTrip.quoteInfo.routeMatchId);
    } else {
      setSelectedId(null);
    }

  }, [tripInfo]); // tripInfo가 바뀔 때마다 실행


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
    const rawQuote = quotes.find(q => q.routeMatchId === pendingId); // 변수명 변경 (finalQuote -> rawQuote)
    
   if (rawQuote) {
    // [추가] API에 없는 데이터(은행, 담당자)를 여기서 더미로 채워넣음
    const quoteWithDummyData = {
      ...rawQuote,
      bankInfo: {
          account: rawQuote.accountNo || "3333-12-000000 (카카오뱅크)",
          holder: rawQuote.accountHolder || "홍길동 (투어매니저)",
          contact: rawQuote.agencyContact || "010-1234-5678",
          email: "tour_manager@test.com",
          manager: rawQuote.managerName || "김담당"
      }
    };

    const confirmedTrip = {
      id: Date.now(),
      tripInfo: tripInfo, 
      quoteInfo: quoteWithDummyData, // [변경] 더미 데이터가 포함된 객체 저장
      confirmedAt: new Date().toLocaleDateString(),
      depositStatus: "미완료" // [추가] 입금 상태 필드 추가
    };

    // [추가] 중복 방지 로직 강화 (기존에 같은 요청ID가 있으면 삭제 후 재저장)
    const existingTrips = JSON.parse(localStorage.getItem("confirmedTrips") || "[]");
    const currentReqId = tripInfo.id || tripInfo.tourRequestId;
    const filteredTrips = existingTrips.filter(t => {
        const tReqId = t.tripInfo.id || t.tripInfo.tourRequestId;
        return String(tReqId) !== String(currentReqId);
    });
      // 새 데이터 추가하여 저장
      localStorage.setItem("confirmedTrips", JSON.stringify([confirmedTrip, ...existingTrips]));
      
      console.log("저장 완료:", confirmedTrip);
    }

    setSelectedId(pendingId); 
    setIsModalOpen(false);    
    setPendingId(null);       
    
    alert("견적 선택이 완료되었습니다! 마이페이지로 이동합니다.");
    navigate("/mypage");
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
          {loading && <p>견적을 불러오는 중입니다...</p>}

          {!loading && quotes.length === 0 && (
            <p>아직 도착한 견적이 없습니다.</p>
          )}
          
          {!loading && quotes.map((quote) => {
            const isCurrentSelected = selectedId === quote.routeMatchId;

            const mappedQuote = {
            id: quote.routeMatchId,
            agencyName: quote.agencyName,
            agencyBadge: quote.agencyName?.[0] ?? "여",
            date: `${tripInfo.date} 출발`,
            totalPrice: quote.totalCost ? quote.totalCost.toLocaleString() : "0",
            perPerson: quote.pricePerPerson ? quote.pricePerPerson.toLocaleString() : "0",
            priceRange: "-",
            time: quote.pickupTime?.slice(11, 16),
            message: quote.description || "고객님의 편안한 여행을 위해 최선을 다하겠습니다.",
            bankInfo: isCurrentSelected ? {
                account: quote.accountNo || "3333-12-000000 (카카오뱅크)",
                holder: quote.accountHolder || "홍길동 (투어매니저)",
                contact: quote.agencyContact || "010-1234-5678"
            } : null
          };

          return (
            <QuoteCard
              key={mappedQuote.id}
              data={mappedQuote}
              isSelected={selectedId === mappedQuote.id}
              isLocked={selectedId !== null && selectedId !== mappedQuote.id}
              onSelect={() => handleSelectClick(mappedQuote.id)}
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
        <div className="detail-row"><span className="icon">🕒</span><div className="text-group"><span className="label">픽업 시간</span><span className="value">{data.time}</span></div></div>
        <div className="detail-row message"><span className="icon">💬</span><div className="text-group"><span className="label">여행사 메시지</span><div className="message-box">{data.message}</div></div></div>
      </div>
      {isSelected && data.bankInfo && (
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