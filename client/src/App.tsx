import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { checkAuth } from "./redux/authSlice";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import PreviewPage from "./pages/PreviewPage";
import Community from "./pages/Community";
import View from "./pages/View";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import Support from "./pages/Support";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const hideNavbar =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/") ||
    pathname === "/login" ||
    pathname === "/signup";

  return (
    <div className="relative min-h-screen">
      <div className="grain-overlay" />
      <Toaster />
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/community" element={<Community />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route
          path="/preview/:projectId/:versionId"
          element={<PreviewPage />}
        />
        <Route path="/view/:projectId" element={<View />} />
        <Route path="/payment-success" element={<Success />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </div>
  );
};

export default App;
