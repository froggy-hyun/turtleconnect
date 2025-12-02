// src/pages/user/EstimatePage.jsx
import { useNavigate } from "react-router-dom";
import "../../styles/EstimatePage.css"; // CSS 파일 분리
import logoTurtle from "../../assets/logo-turtle.png"; // 로고 경로 확인

export default function EstimatePage() {
  return (
    <div className="est-page-wrapper">
      <Header />
      <main className="est-content-container">
        <BackLink />
        <PageTitle />
        <EstimateGrid />
      </main>
    </div>
  );
}

// --- 하위 컴포넌트 ---

function Header() {
  const navigate = useNavigate();
  return (
    <header className="tc-header">
      <div className="tc-header__left" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
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
          <span className="active-text" onClick={() => navigate("/usermypage")} style={{cursor:'pointer'}}>마이페이지</span>
          <img src="https://placehold.co/40x40" alt="프로필" className="header-avatar"/>
        </div>
        <button className="btn-logout" onClick={() => navigate("/")}>로그아웃</button>
      </div>
    </header>
  );
}

function BackLink() {
  const navigate = useNavigate();
  return (
    <div className="back-link" onClick={() => navigate("/usermypage")}>
      <span className="arrow-icon">‹</span> 목록으로 돌아가기
    </div>
  );
}

function PageTitle() {
  return (
    <div className="page-title-section">
      <h1>내 견적 확인</h1>
      <p>신청하신 여행의 견적서를 확인하고 선택하세요</p>
    </div>
  );
}

function EstimateGrid() {
    const navigate = useNavigate();
  // 목업 데이터 (화면에 보이는 내용 그대로)
  const estimates = [
    {
      id: 1,
      title: "서울역",
      date: "12월 1일 - 12월 5일",
      people: 2,
      pickup: "서울역",
      status: "arrived", // 도착함
      badgeText: "견적 2개 도착",
      btnText: "견적 보러가기",
      img: "https://placehold.co/389x200"
    },
    {
      id: 2,
      title: "서울역",
      date: "11월 20일 - 11월 22일",
      people: 3,
      pickup: "강남역",
      status: "waiting", // 대기중
      badgeText: "매칭 대기중",
      btnText: "견적 대기중",
      img: "https://placehold.co/389x200"
    },
    {
      id: 3,
      title: "서울역",
      date: "11월 20일 - 11월 22일",
      people: 2,
      pickup: "신도림역",
      status: "waiting",
      badgeText: "매칭 대기중",
      btnText: "견적 대기중",
      img: "https://placehold.co/389x200"
    },
    {
      id: 4,
      title: "서울역",
      date: "11월 21일 - 11월 23일",
      people: 2,
      pickup: "강남역",
      status: "waiting",
      badgeText: "매칭 대기중",
      btnText: "견적 대기중",
      img: "https://placehold.co/389x200"
    }
  ];

  return (
    <div className="est-grid">
      {estimates.map((item) => (
        <div key={item.id} className="est-card">
          <div className="est-img-box">
            <img src={item.img} alt={item.title} />
            <span className="badge-location">거북섬</span>
          </div>
          
          <div className="est-body">
            <div className="est-title-row">
              <h3>{item.title}</h3>
              <button className="btn-delete" title="삭제">🗑️</button>
            </div>
            
            <div className="est-info">
              <p><span className="icon">📅</span> {item.date}</p>
              <p><span className="icon">👥</span> {item.people}명</p>
              <p><span className="icon">📍</span> 픽업: {item.pickup}</p>
            </div>

            {/* 상태 뱃지 (파란색 or 회색) */}
            <div className={`est-status-badge ${item.status}`}>
              {item.badgeText}
            </div>

            {/* 버튼 (활성화 or 비활성화) */}
            <button className={`est-action-btn ${item.status}`}
            onClick={() => {navigate("/quote-detail", { state: { tripInfo: item } });
              }}
            >
              {item.btnText} {item.status === 'arrived' && '>'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}