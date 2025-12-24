import "../styles/Footer.css";

import logoSchool from "../assets/tuk.svg";
import logoSiheungText from "../assets/siheung.svg";
import siheungCharacters from "../assets/haero_toro.webp";

export default function Footer() {
  return (
    <footer className="tc-footer">
      <div className="footer-container">
        {/* 로고 영역 */}
        <div className="footer-logos">
          <img
            src={logoSchool}
            alt="학교 로고"
            className="footer-logo"
          />

          <span className="divider" />

          <img
            src={logoSiheungText}
            alt="시흥시 로고"
            className="footer-logo wide"
          />

          <img
            src={siheungCharacters}
            alt="시흥시 캐릭터"
            className="footer-logo character"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="footer-text">
          <p>경기도 시흥시 산기대학로 237 (정왕동)</p>
          <p className="brand">Turtle Connect</p>
          <p className="copyright">
            © 2025 Turtle Connect. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
