// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TurtleConnectMain from "./pages/MainAndBooking";
import FestivalPage from "./pages/FestivalAndAttractionPage";
import LoginPage from "./pages/Login"
import SignupPage from "./pages/Signup";
import AgencyMypage from "./pages/AgencyMypage";
import QuoteManage from "./pages/QuoteManage";
import DispatchPlan from "./pages/DispatchPlan";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TurtleConnectMain />} />
        <Route path="/festivals" element={<FestivalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/agency-mypage" element={<AgencyMypage />} />
        <Route path="/agency-mypage/quotes" element={<QuoteManage />} />
        <Route path="/agency-mypage/dispatch" element={<DispatchPlan />} />
      </Routes>
    </BrowserRouter>
  );
}
