import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Create from "./pages/Create";
import Landing from "./pages/Landing";
import NotFound from "./Components/NotFound/Notfound";
function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/videogames/:id" element={<Detail />} />
      </Routes>
    </div>
  );
}

export default App;