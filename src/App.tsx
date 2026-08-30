import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navigation/Navbar";
import { FooterSignature } from "./components/Navigation/FooterSignature";
import { StudioPage } from "./pages/StudioPage";
import { GuidePage } from "./pages/GuidePage";

function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full h-full min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<StudioPage />} />
          <Route path="/learn" element={<GuidePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FooterSignature />
      </div>
    </BrowserRouter>
  );
}

export default App;
