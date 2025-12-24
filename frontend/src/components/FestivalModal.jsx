// src/components/FestivalModal.jsx
import React, { useEffect } from 'react';
import '../styles/festival-modal.css';
import period from '../assets/icons/period.png'
import location from '../assets/icons/location.png'
import participants from '../assets/icons/participants.png'

const FestivalModal = ({ isOpen, onClose, festival }) => {
  if (!isOpen) return null;

  // close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose && onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div className="festival-modal-overlay" onClick={onClose}>
      <div className="festival-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="festival-modal-close-button" onClick={onClose}>
          &times;
        </button>

        {festival && (
          <div className="festival-modal-body festival-modal-body--container">
            <h2 className="festival-modal-title">{festival.title}</h2>

            {/* 이미지 영역 */}
            <div className="festival-modal-image-wrap">
              <img
                src={festival.imageMain}
                alt={festival.title}
                className="festival-modal-main-image"
              />
            </div>

            {/* 소개 문단 */}
            <p className="festival-modal-description">{festival.description}</p>

            {/* 2x2 정보 카드 그리드 */}
            <div className="festival-modal-info-grid">
              <div className="festival-info-card">
                <div className="festival-info-card-title"><img src={period}/>축제 기간</div>
                <div className="festival-info-card-body">{festival.date}</div>
              </div>

              <div className="festival-info-card">
                <div className="festival-info-card-title"><img src={location}/>위치</div>
                <div className="festival-info-card-body">{festival.place}</div>
              </div>

              <div className="festival-info-card">
                <div className="festival-info-card-title"><img src={participants}/>예상 참여 인원</div>
                <div className="festival-info-card-body">약 50,000명</div>
              </div>

              <div className="festival-info-card festival-info-card--discount">
                <div className="festival-info-card-title">💰 할인 정보</div>
                <div className="festival-info-card-body">
                  {festival.discountBadge || '없음'}
                </div>
              </div>
            </div>

            {/* 특별 이벤트 박스 */}
            {festival.highlight && (
              <div className="festival-modal-special-event">
                <div className="festival-special-event-title">🎉 특별 이벤트</div>
                <div className="festival-special-event-body">{festival.highlight}</div>
              </div>
            )}

            {/* 주요 프로그램 */}
            <div className="festival-modal-section">
              <h4 className="festival-modal-section-title">주요 프로그램</h4>
              <div
                className="festival-modal-program-chips"
                style={{ gridTemplateColumns: `repeat(${festival.benefits.length}, 1fr)` }}
              >
                {festival.benefits.map((b) => (
                  <span key={b} className="festival-modal-chip">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalModal;