/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CoreApp from './pages/CoreApp';
import GlobalDashboard from './pages/GlobalDashboard';
import VerifyShuffle from './pages/VerifyShuffle';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<CoreApp />} />
        <Route path="/global" element={<GlobalDashboard />} />
        <Route path="/verify" element={<VerifyShuffle />} />
      </Routes>
    </BrowserRouter>
  );
}
