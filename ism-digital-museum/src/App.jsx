import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Nav from './components/Nav';
import { useAuth } from './lib/auth';
import Home from './pages/Home';
import Login from './pages/Login';
import Exhibits from './pages/Exhibits';
import ExhibitDetail from './pages/ExhibitDetail';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import TeacherDetail from './pages/TeacherDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import History from './pages/History';
import Creators from './pages/Creators';
import Admin from './pages/Admin';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="container section"><p>Ачаалж байна…</p></main>;
  return user ? children : <Navigate to="/login" replace />;
}

function NotFound() {
  return (
    <main className="container section">
      <h1 className="h2">Хуудас олдсонгүй</h1>
      <Link to="/" className="link">Нүүр хуудас руу буцах</Link>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exhibits" element={<Exhibits />} />
        <Route path="/exhibits/:id" element={<ExhibitDetail />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/:id" element={<TeacherDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin" element={<Protected><Admin /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}