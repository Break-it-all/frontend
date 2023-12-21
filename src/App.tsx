import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./components/Layout";
import Container from "./pages/Container";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/Container/:id" element={<Container />} />
          <Route path="/Container/:id" element={<Container />} />
          <Route path="/Auth/Login" element={<Login />} />
          <Route path="/Auth/Register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
