import React, { useEffect } from 'react';
import '../styles/attraction-modal.css';
import location from '../assets/icons/location.png'
import time from '../assets/icons/time.png'

const AttractionModal = ({ isOpen, onClose, place }) => {
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

  const locationText = place?.place || '거북섬 동부 해안';
  const hoursText = place?.hours || '연중무휴 24시간';
  const special = place?.highlight || place?.discountBadge || null;
  const features = place?.features || ['포토 뷰', '일몰 뷰', '해변 카페'];

  return (
    <div className="attraction-modal-overlay" onClick={onClose}>
      <div className="attraction-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="attraction-modal-close-button" onClick={onClose}>
          &times;
        </button>

        {place && (
          <div className="attraction-modal-body">
            <div className="attraction-header">
              <h2 className="attraction-title">{place.title}</h2>
              {place.category && (
                <div className="attraction-pill">{place.category}</div>
              )}
            </div>

            <div className="attraction-image-wrap">
              <img
                src={place.imageMain}
                alt={place.title}
                className="attraction-main-image"
              />
            </div>

            <div className="attraction-rating-row">
              <span className="star">⭐</span>
              <span className="rating-score">{place.rating || 'N/A'}</span>
              <span className="rating-count">후기 {place.reviewCount || 0}개</span>
            </div>

            <p className="attraction-description">{place.description}</p>

            <div className="attraction-info-grid">
              <div className="attraction-info-card">
                <div className="attraction-info-card-title"><img src={location}/>위치</div>
                <div className="attraction-info-card-body">{locationText}</div>
              </div>

              <div className="attraction-info-card">
                <div className="attraction-info-card-title"><img src={time}/>운영 시간</div>
                <div className="attraction-info-card-body">{hoursText}</div>
              </div>
            </div>

            {special && (
              <div className="attraction-special">
                <div className="special-title">🎯 특별 혜택</div>
                <div className="special-body">{special}</div>
              </div>
            )}

            <div className="attraction-section">
              <h4 className="section-title">주요 특징</h4>
              <div className="feature-chips">
                {features.map((f) => (
                  <span key={f} className="feature-chip">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <hr className="attraction-divider" />

            <div className="review-form">
              <h4 className="section-title">후기 작성하기</h4>
              <div className="star-select">
                <button className="star-btn">★</button>
                <button className="star-btn">★</button>
                <button className="star-btn">★</button>
                <button className="star-btn">★</button>
                <button className="star-btn">★</button>
              </div>
              <textarea
                className="review-textarea"
                placeholder="이곳에 대한 솔직한 후기를 남겨주세요..."
              />
              <button className="review-submit">후기 등록하기</button>
            </div>

            <div className="no-reviews">아직 등록된 후기가 없습니다.<br />첫 번째 후기를 남겨주세요!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionModal;
