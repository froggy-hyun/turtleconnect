// src/components/Header.jsx
import { useLocation, useNavigate } from "react-router-dom";
import logoTurtle from "../assets/logo-turtle.png";
import ellipseAvatar from "../assets/Ellipse.png";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isFestival = location.pathname.startsWith("/festivals");
  // 마이페이지 관련 경로들: /agency-mypage 및 /dispatch-plan일 때도 활성화
  const isMyPage =
    location.pathname.startsWith("/usermypage") ||
    location.pathname.startsWith("/agency-mypage") ||
    location.pathname.startsWith("/dispatch-plan") ||
    location.pathname.startsWith("/sentplans");
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="tc-header">
      <div className="tc-header__left">
        <img
          src={logoTurtle}
          alt="터틀커넥트 로고"
          className="tc-header__logo-icon"
        />
        <div className="tc-header__logo-text">
          <div className="tc-header__logo-title">거북섬 커넥트</div>
          <div className="tc-header__logo-sub">Turtle Connect</div>
        </div>
      </div>

      <nav className="tc-header__nav">
        <button
          className={
            "tc-header__nav-item" +
            (isHome ? " tc-header__nav-item--active" : "")
          }
          onClick={() => navigate("/")}
        >
          홈
        </button>
        <button
          className={
            "tc-header__nav-item" +
            (isFestival ? " tc-header__nav-item--active" : "")
          }
          onClick={() => navigate("/festivals")}
        >
          축제 &amp; 관광지
        </button>
      </nav>

      <div className={"tc-header__right" + (isLoggedIn ? " tc-header__right--logged" : "") }>
        {!isLoggedIn ? (
          <>
            <button className="tc-btn tc-btn--outline" onClick={() => navigate("/login")}>로그인</button>
            <button className="tc-btn tc-btn--primary" onClick={() => navigate("/signup")}>회원가입</button>
          </>
        ) : (
          <>
            <button 
              className={"tc-btn tc-btn--mypage" + (isMyPage ? " tc-header__nav-item--active" : "")}
              onClick={() => navigate("/usermypage")}
            >
                마이페이지
            </button>

            <img
              src={localStorage.getItem("profile_image") || ellipseAvatar}
              alt="프로필"
              className="tc-header__avatar"
              onClick={() => navigate("/usermypage")}
            />

            <button
              className="tc-btn tc-btn--outline"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              로그아웃
            </button>
          </>
        )}

      {/* <div className={"tc-header__right" + (isLoggedIn ? " tc-header__right--logged" : "") }>
        {!isLoggedIn ? (
          <>
            <button className="tc-btn tc-btn--outline" onClick={() => navigate("/login")}>로그인</button>
            <button className="tc-btn tc-btn--primary" onClick={() => navigate("/signup")}>회원가입</button>
          </>
        ) : (
          <>
            <button
              className={"tc-btn tc-btn--mypage" + (isMyPage ? " tc-header__nav-item--active" : "")}
              onClick={() => navigate("/agency-mypage")}
            >
              마이페이지
            </button>

            <img
              src={localStorage.getItem("profile_image") || ellipseAvatar}
              alt="프로필"
              className="tc-header__avatar"
              onClick={() => navigate("/agency-mypage")}
            />

            <button
              className="tc-btn tc-btn--outline"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              로그아웃
            </button>
          </>
        )} */}
      </div>
    </header>
  );
}
