import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Questionnaire from './components/Questionnaire';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
    </Routes>
  );
}

export default App;