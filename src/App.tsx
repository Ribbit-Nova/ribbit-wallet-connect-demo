import { lazy } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Header/Header';

const Ribbit = lazy(() => import('./pages/Ribbit/Ribbit'));
const About = lazy(() => import('./pages/About/About'));

function App() {
  return (
    <>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Ribbit />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
