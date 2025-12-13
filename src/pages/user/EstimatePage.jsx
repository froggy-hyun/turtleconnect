import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getMyRequests, cancelTourRequest } from "../../api/tourApi"; // API 가져오기
import "../../styles/EstimatePage.css";
import waveParkImage from '../../assets/dummy/wave_park.jpg';

// 역 이름 매핑 (UserMyPage와 동일하게)
const LOCATION_ID_MAP = {
  1: "강남역",
  2: "서울역",
  3: "신도림역",
  4: "홍대입구역",
  5: "잠실역",
  6: "합정역",
  7: "수원역",
  8: "안산 중앙역",
  9: "부천종합운동장역",
  10: "인천대입구역"
};

export default function EstimatePage() {
  return (
    <div className="est-page-wrapper">
      <Header />
      <main className="est-content-container">
        <BackLink />
        <PageTitle />
        {/* 그리드 컴포넌트에 로직 포함 */}
        <EstimateGrid />
      </main>
      <Footer />
    </div>
  );
}

// --- 하위 컴포넌트 ---

function BackLink() {
  const navigate = useNavigate();
  return (
    <div className="back-link" onClick={() => navigate("/mypage")}>
      <span className="arrow-icon">‹</span> 마이페이지로 돌아가기
    </div>
  );
}

function PageTitle() {
  return (
    <div className="page-title-section">
      <h1>내 견적 전체보기</h1>
      <p>신청하신 모든 여행 견적 내역입니다.</p>
    </div>
  );
}

function EstimateGrid() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. 데이터 불러오기 (UserMyPage와 로직 동일)
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const response = await getMyRequests();
        
        let listData = [];
        if (Array.isArray(response)) listData = response;
        else if (response?.data && Array.isArray(response.data)) listData = response.data;
        else if (response?.result && Array.isArray(response.result)) listData = response.result;

        const formattedData = listData
          .filter((item) => item.status !== "CANCELED") // 취소된 건 제외
          .map((item) => {
            let dateDisplay = item.startDate;
            if (item.startDate && item.endDate && item.startDate !== item.endDate) {
              dateDisplay = `${item.startDate} ~ ${item.endDate}`;
            }

            const locId = item.locationId || item.location_id; 
            const locName = item.locationName || LOCATION_ID_MAP[locId] || "(탑승지)";
            const timeStr = item.pickupTime ? item.pickupTime.substring(11, 16) : "00:00 (미정)";
            const isWaiting = item.status === "WAITING";

            return {
              id: item.id,
              title: locName,
              date: dateDisplay || "날짜 미정",
              people: item.participantCount || 0,
              pickup: `${locName} ${timeStr}`,
              statusBadge: isWaiting ? "매칭 대기중" : "견적 도착",
              status: isWaiting ? "waiting" : "arrived", // CSS 클래스용
              btnText: isWaiting ? "견적 대기중" : "견적 보러가기",
              btnActive: !isWaiting,
              img: waveParkImage
            };
          })
          .sort((a, b) => b.id - a.id); // 최신순 정렬

        // 여행사 견적 보여줄 더미 카드 (예시 데이터)
        const dummyCard = {
          id: "dummy-1", // 실제 ID와 겹치지 않게 문자열 사용
          title: "김포공항 (예시)",
          date: "2025-12-25 (크리스마스)",
          people: 4,
          pickup: "김포공항 00:00 (미정)",
          statusBadge: "견적 도착", // 파란색 뱃지 테스트용
          status: "arrived",       // CSS 클래스 (파란색)
          btnText: "견적 보러가기",
          btnActive: true,
          img: waveParkImage
        };

        // 더미 카드를 맨 앞에 붙이고 + 실제 데이터를 뒤에 붙임
        setCards([dummyCard, ...formattedData]);

      } catch (error) {
        console.error("데이터 로딩 실패:", error);

        // 에러가 나도 더미 카드는 보여주기 위해 추가
        setCards([{
          id: "dummy-error",
          title: "에러 발생 시 예시",
          date: "날짜 미정",
          people: 0,
          pickup: "장소 미정",
          statusBadge: "매칭 대기중",
          status: "waiting",
          btnText: "견적 대기중",
          btnActive: false,
          img: waveParkImage
        }]);

      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  // 2. 삭제 핸들러 (UserMyPage와 동일)
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("정말 이 견적 요청을 삭제하시겠습니까?")) return;
    try {
      await cancelTourRequest(id);
      setCards((prevCards) => prevCards.filter((card) => card.id !== id));
      alert("삭제되었습니다.");
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="est-grid">
      {loading ? (
        <div style={{ width: "100%", textAlign: "center", padding: "40px" }}>로딩 중...</div>
      ) : cards.length === 0 ? (
        <div style={{ width: "100%", textAlign: "center", padding: "40px", color: "#888" }}>
          신청한 견적이 없습니다.
        </div>
      ) : (
        cards.map((item) => (
          <div key={item.id} className="est-card">
            <div className="est-img-box">
              <img src={item.img} alt={item.title} />
              <span className="badge-location">거북섬</span>
            </div>
            
            <div className="est-body">
              <div className="est-title-row">
                <h3>{item.title}</h3>
                {/* 삭제 버튼 */}
                <button 
                  className="btn-delete" 
                  onClick={(e) => handleDelete(e, item.id)}
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
              
              <div className="est-info">
                <p><span className="icon">📅</span> {item.date}</p>
                <p><span className="icon">👥</span> {item.people}명</p>
                <p><span className="icon">📍</span> {item.pickup}</p>
              </div>

              <div className={`est-status-badge ${item.status}`}>
                {item.statusBadge}
              </div>

              <button 
                className={`est-action-btn ${item.status}`}
                onClick={() => {
                  if (item.btnActive) {
                    navigate("/mypage/quote-detail", { state: { tripInfo: item } });
                  }
                }}
              >
                {item.btnText} {item.status === 'arrived' && '>'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}