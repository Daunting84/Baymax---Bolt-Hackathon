import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Journal } from "./pages/Journal";
import { Breathwork } from "./pages/Breathwork";
import { History } from "./pages/History";
import { MoodTracker } from "./pages/MoodTracker";

export const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
          <Route path="breathwork" element={<Breathwork />} />
          <Route path="history" element={<History />} />
          <Route path="mood-tracker" element={<MoodTracker />} />
        </Route>
      </Routes>
    </Router>
  );
};