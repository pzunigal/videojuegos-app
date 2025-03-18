import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameList from "./components/GameList";
import GameDetail from "./components/GameDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/game/:id" element={<GameDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
