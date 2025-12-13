// src/api/agencyApi.js
import api from "./axiosConfig";

/**
 * Agency 영역 API 래퍼
 * 모든 함수는 axios 인스턴스(api)를 사용하며, 프록시 설정을 유지합니다.
 */

// 견적 요청: 월별 날짜 목록
export function getMonthlyRequestDates({ year, month }) {
  return api.get("/api/agency/requests/dates", { params: { year, month } });
}

// 견적 요청: 특정 날짜의 요약
export function getDailySummary({ date }) {
  return api.get("/api/agency/requests/summary", { params: { date } });
}

// 견적 요청: 특정 날짜의 역(로케이션)별 현황
export function getRequestsByLocation({ date }) {
  return api.get("/api/agency/requests/by-location", { params: { date } });
}

// 배차 계획 전송
export function postRoutePlan(body) {
  return api.post("/api/agency/routes", body);
}

// 전송된 배차 계획 목록 조회
export function getSentRoutes(params = {}) {
  // 필요 시 페이지네이션/필터 파라미터 확장 가능
  return api.get("/api/agency/routes", { params });
}

// 배차 계획 상세 조회
export function getRouteDetail(routeId) {
  return api.get(`/api/agency/routes/${routeId}`);
}
