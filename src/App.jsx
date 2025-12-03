// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TurtleConnectMain from "./pages/MainAndBooking";
import FestivalPage from "./pages/FestivalAndAttractionPage";
import UserMyPage from "./pages/user/UserMyPage";
import EstimatePage from "./pages/user/EstimatePage";
import QuoteDetailPage from "./pages/user/QuoteDetailPage";
import LoginPage from "./pages/Login"
import SignupPage from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소(/)로 오면 메인 페이지를 보여줌 */}
        <Route path="/" element={<TurtleConnectMain />} />
        <Route path="/festivals" element={<FestivalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* /mypage 로 오면 마이페이지를 보여줌 */}
        <Route path="/usermypage" element={<UserMyPage />} />
        <Route path="/estimates" element={<EstimatePage />} />
        <Route path="/quote-detail" element={<QuoteDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
