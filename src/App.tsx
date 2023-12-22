import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./components/Layout";
import Container from "./pages/Container";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import EmailAuth from "./pages/auth/EmailAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/Container/:id" element={<Container />} />
          <Route path="/Container/:id" element={<Container />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-auth/verify" element={<EmailAuth />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
