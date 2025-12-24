// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TurtleConnectMain from "./pages/MainAndBooking";
import FestivalPage from "./pages/FestivalAndAttractionPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

import UserMyPage from "./pages/user/UserMyPage";
import EstimatePage from "./pages/user/EstimatePage";
import QuoteDetailPage from "./pages/user/QuoteDetailPage";

import AgencyMypage from "./pages/agency/AgencyMypage";
import QuoteManage from "./pages/agency/QuoteManage";
import DispatchPlan from "./pages/agency/DispatchPlan";
import SentDispatch from "./pages/agency/SentDispatch";
import SentDispatchDetail from "./pages/agency/SentDispatchDetail";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소(/)로 오면 메인 페이지를 보여줌 */}
        <Route path="/" element={<TurtleConnectMain />} />
        <Route path="/festivals" element={<FestivalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* user pages: TRAVELER(또는 일반 사용자)만 접근 허용 */}
        <Route
          path="/mypage"
          element={
            <ProtectedRoute allowedRoles={["TRAVELER"]}>
              <UserMyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage/estimates"
          element={
            <ProtectedRoute allowedRoles={["TRAVELER"]}>
              <EstimatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage/quote-detail"
          element={
            <ProtectedRoute allowedRoles={["TRAVELER"]}>
              <QuoteDetailPage />
            </ProtectedRoute>
          }
        />

        {/* agency pages: AGENCY만 접근 허용 */}
        <Route
          path="/agency-mypage"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <AgencyMypage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency-mypage/quotes"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <QuoteManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency-mypage/dispatch"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <DispatchPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency-mypage/sent-dispatch"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <SentDispatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency-mypage/sent-dispatch/:routeId"
          element={
            <ProtectedRoute allowedRoles={["AGENCY"]}>
              <SentDispatchDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
