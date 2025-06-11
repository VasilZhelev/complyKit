import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuestionnairePage from './pages/QuestionnairePage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questionnaire" element={<QuestionnairePage />} />
    </Routes>
  );
}

export default App;