// src/pages/FestivalPage.jsx
import { useState } from "react";
import "../styles/festival.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FestivalModal from "../components/FestivalModal";
import AttractionModal from "../components/AttractionModal";

import festivalImg from "../assets/dummy/festival.png";
import festival2Img from "../assets/dummy/festival2.png";
import waveparkImg from "../assets/dummy/wave_park.jpg";
import beachImg from "../assets/dummy/turtlebeach.png"
import traditionImg from "../assets/dummy/traditional.png"
import forestImg from "../assets/dummy/forest.png"

const HERO_PASS_BUTTON_LABEL = "패스 구매하기";

/**
 * 축제 탭 카드 데이터 (가로 2컬럼 레이아웃 2장, Figma 축제 화면 기준)
 */
const FESTIVALS = [
  {
    id: 1,
    title: "시흥 거북섬 썸머나잇 페스티벌",
    date: "2024년 8월 23일(금) - 2024년 8월 24일(토)",
    place: "거북섬 일대 해변공원",
    tagline: "거북섬의 시원한 바닷바람과 함께 즐기는 한여름 밤의 축제!",
    description:
      "거북섬의 시원한 바닷바람과 함께 즐기는 한여름 밤의 축제! 라이브 공연, 물빛 라이트쇼, 푸드트럭까지 다양한 즐길 거리가 마련된 대표 여름 야간 페스티벌입니다.",
    highlight: "인근 바다 전망과 함께 즐기는 여름 라이트쇼!",
    benefits: ["라이브 버스킹", "물빛 라이트쇼", "푸드트럭 페어"],
    discountBadge: "패스권 소지자 20% 할인",
    imageMain: festivalImg,
    imageOverlay: festivalImg,
  },
  {
    id: 2,
    title: "제17회 전국해양스포츠제전",
    date: "2025년 8월 30일(토) - 2025년 9월 2일(화)",
    place: "거북섬 해변공원 및 인근 경기장",
    tagline: "다양한 해양 스포츠가 어우러지는 전국 규모의 축제형 경기 대회",
    description:
      "제17회 전국해양스포츠제전은 카약, 요트, 수상스키 등 다양한 해양 스포츠 경기가 열리는 행사입니다. 지역 연계 체험 부스와 해양 안전 교육, 야외 공연이 함께 마련되어 있어 가족 단위 관람객도 즐길 수 있습니다. 개막식과 폐막식에서는 유명 가수의 공연과 함께 지역 특산물 마켓이 운영되며, 선수들의 화합을 엿볼 수 있는 다채로운 프로그램이 진행됩니다.",
    highlight: "카약·요트 등 실제 경기 관전과 해양 체험 부스가 동시에",
    benefits: ["카약/요트 경기 관전", "해양 체험 부스", "개·폐막식 공연"],
    discountBadge: "패스권 소지자 입장 우대",
    imageMain: festival2Img,
    imageOverlay: festival2Img,
  },
];

/**
 * 관광지 탭 카드 데이터 (2×2 그리드, Figma 관광지 페이지 45:2698 기준)
 */
const ATTRACTIONS = [
  {
    id: 1,
    title: "웨이브파크",
    category: "체험",
    discountBadge: "패스권 소지자 입장료 무료",
    rating: "4.8",
    reviewCount: "342",
    description:
      "세계 최대 규모의 인공 파도 시설을 갖춘 거북섬의 대표 액티비티 명소입니다. 초보부터 숙련자까지 레벨별 파도존과 전문 강습 프로그램도 마련되어 있습니다.",
    highlight: "여름 기간 서핑 강습 50% 할인",
    imageMain: waveparkImg,
    imageOverlay: waveparkImg,
  },
  {
    id: 2,
    title: "거북섬 해변",
    category: "자연경관",
    discountBadge: null,
    rating: "4.9",
    reviewCount: "528",
    description:
      "탁 트인 바다와 노을이 만들어내는 풍경이 아름다워 데이트 장소나 가족 나들이로 많이 찾는 곳입니다.",
    highlight: null,
    imageMain: beachImg,
    imageOverlay: beachImg,
  },
  {
    id: 3,
    title: "거북섬 전통 마을",
    category: "문화체험",
    discountBadge: "패스권 소지자 체험비 30% 할인",
    rating: "4.7",
    reviewCount: "215",
    description:
      "전통 한옥과 돌담길이 보존된 마을입니다. 전통 문화 체험 프로그램도 운영됩니다.",
    highlight: null,
    imageMain: traditionImg,
    imageOverlay: traditionImg,
  },
  {
    id: 4,
    title: "거북섬 자연 휴양림",
    category: "자연경관",
    discountBadge: null,
    rating: "4.6",
    reviewCount: "187",
    description:
      "울창한 숲과 맑은 계곡이 있는 힐링 명소입니다. 다양한 트레킹 코스가 마련되어 있습니다.",
    highlight: null,
    imageMain: forestImg,
    imageOverlay: forestImg,
  },
];

export default function FestivalPage() {
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isAttractionOpen, setIsAttractionOpen] = useState(false);

  const openFestivalModal = (festival) => {
    setSelectedFestival(festival);
    setIsModalOpen(true);
  };

  const closeFestivalModal = () => {
    setIsModalOpen(false);
    setSelectedFestival(null);
  };

  const closeAttractionModal = () => {
    setIsAttractionOpen(false);
    setSelectedPlace(null);
  };

  return (
    <div className="tc-root">
      <Header />
      <main className="tc-main tc-main--fullwidth">
        <FestivalHero />
        <FestivalContent
          onOpenFestival={openFestivalModal}
          onOpenAttraction={(place) => {
            setSelectedPlace(place);
            setIsAttractionOpen(true);
          }}
        />

        <FestivalModal
          isOpen={isModalOpen}
          onClose={closeFestivalModal}
          festival={selectedFestival}
        />

        <AttractionModal
          isOpen={isAttractionOpen}
          onClose={closeAttractionModal}
          place={selectedPlace}
        />
      </main>
      <Footer />
    </div>
  );
}

function FestivalHero() {
  return (
    <section className="tc-festival-hero">
      <div className="tc-festival-hero__inner">
        <div className="tc-festival-hero__text">
          <h1 className="tc-festival-hero__title">거북섬 패스</h1>
          <p className="tc-festival-hero__subtitle">
            축제부터 명소까지, 거북섬을 자유롭게!
          </p>
          <p className="tc-festival-hero__description">
            여행 비용은 줄이고 즐거움은 두 배로!
          </p>
        </div>
        <button className="tc-festival-hero__button">
          {HERO_PASS_BUTTON_LABEL}
        </button>
      </div>
    </section>
  );
}

function FestivalContent({ onOpenFestival, onOpenAttraction }) {
  const [activeTab, setActiveTab] = useState("festival"); // "festival" | "attraction"

  const isFestival = activeTab === "festival";

  const heading = isFestival ? "거북섬 축제" : "관광지";
  const subheading = isFestival
    ? "거북섬에서 열리는 다양한 축제를 경험해보세요"
    : "거북섬의 아름다운 명소를 둘러보세요";

  return (
    <section className="tc-festival">
      {/* 탭 */}
      <div className="tc-festival__tabs">
        <button
          type="button"
          className={
            "tc-festival__tab" +
            (isFestival ? " tc-festival__tab--active" : "")
          }
          onClick={() => setActiveTab("festival")}
        >
          축제
        </button>
        <button
          type="button"
          className={
            "tc-festival__tab" +
            (!isFestival ? " tc-festival__tab--active" : "")
          }
          onClick={() => setActiveTab("attraction")}
        >
          관광지
        </button>
      </div>

      {/* 제목 영역 */}
      <header className="tc-festival__header">
        <h2 className="tc-festival__heading">{heading}</h2>
        <p className="tc-festival__subheading">{subheading}</p>
      </header>

      {/* 리스트: 축제(2×1), 관광지(2×2) */}
      {isFestival ? (
        <div className="tc-festival__list tc-festival__list--festival">
          {FESTIVALS.map((f) => (
            <FestivalCard key={f.id} festival={f} onOpen={onOpenFestival} />
          ))}
        </div>
      ) : (
        <div className="tc-festival__list tc-festival__list--attraction">
          {ATTRACTIONS.map((a) => (
            <AttractionCard key={a.id} place={a} onOpen={onOpenAttraction} />
          ))}
        </div>
      )}
    </section>
  );
}

/** 축제 카드 (가로 2단, 기존 디자인) */
function FestivalCard({ festival, onOpen }) {
  return (
    <article className="tc-festival-card">
      <div className="tc-festival-card__image-wrap">
        <img
          src={festival.imageMain}
          alt={festival.title}
          className="tc-festival-card__image tc-festival-card__image--base"
        />
        {festival.imageOverlay && (
          <img
            src={festival.imageOverlay}
            alt=""
            className="tc-festival-card__image tc-festival-card__image--overlay"
          />
        )}
        {festival.discountBadge && (
          <div className="tc-festival-card__badge">
            {festival.discountBadge}
          </div>
        )}
      </div>

      <div className="tc-festival-card__body">
        <h3 className="tc-festival-card__title">{festival.title}</h3>
        <p className="tc-festival-card__tagline">{festival.tagline}</p>

        <div className="tc-festival-card__meta">
          <div className="tc-festival-card__meta-row">
            <span className="tc-festival-card__meta-label">행사 일정</span>
            <span className="tc-festival-card__meta-value">
              {festival.date}
            </span>
          </div>
          <div className="tc-festival-card__meta-row">
            <span className="tc-festival-card__meta-label">장소</span>
            <span className="tc-festival-card__meta-value">
              {festival.place}
            </span>
          </div>
        </div>

        <div className="tc-festival-card__highlight">
          {festival.highlight}
        </div>

        <div className="tc-festival-card__program">
          <h4 className="tc-festival-card__program-title">주요 프로그램</h4>
          <div className="tc-festival-card__program-chips">
            {festival.benefits.map((b) => (
              <span key={b} className="tc-festival-card__chip">
                {b}
              </span>
            ))}
          </div>
        </div>

        <button
          className="tc-festival-card__button"
          onClick={() => onOpen && onOpen(festival)}
        >
          이 축제 정보 보러가기
        </button>
      </div>
    </article>
  );
}

/** 관광지 카드 (2×2 그리드, Figma 관광지 페이지 레이아웃) */
function AttractionCard({ place, onOpen }) {
  return (
    <article
      className="tc-festival-card tc-attraction-card"
      // force single-column layout for attraction cards so image sits above text
      style={{ gridTemplateColumns: "1fr" }}
    >
      <div className="tc-festival-card__image-wrap">
        <img
          src={place.imageMain}
          alt={place.title}
          className="tc-festival-card__image tc-festival-card__image--base"
        />
        {place.imageOverlay && (
          <img
            src={place.imageOverlay}
            alt=""
            className="tc-festival-card__image tc-festival-card__image--overlay"
          />
        )}

        {/* 상단 왼쪽 카테고리 태그 */}
        <div className="tc-attraction-card__pill tc-attraction-card__pill--category">
          {place.category}
        </div>

        {/* 상단 오른쪽 할인 배지 (있는 경우만) */}
        {place.discountBadge && (
          <div className="tc-attraction-card__pill tc-attraction-card__pill--discount">
            {place.discountBadge}
          </div>
        )}

        {/* 하단 좌측 평점/리뷰 */}
        <div className="tc-attraction-card__rating">
          <span className="tc-attraction-card__rating-score">
            {place.rating}
          </span>
          <span className="tc-attraction-card__rating-count">
            ({place.reviewCount})
          </span>
        </div>
      </div>

      <div className="tc-festival-card__body">
        <h3 className="tc-festival-card__title">{place.title}</h3>

        <p className="tc-festival-card__tagline">{place.description}</p>

        {place.highlight && (
          <div className="tc-attraction-card__highlight">
            {place.highlight}
          </div>
        )}

        <div className="tc-attraction-card__footer">
          <span className="tc-attraction-card__reviews">
            후기 {place.reviewCount}개
          </span>
          <button
            className="tc-attraction-card__more"
            onClick={() => onOpen && onOpen(place)}
          >
            상세보기 →
          </button>
        </div>
      </div>
    </article>
  );
}
