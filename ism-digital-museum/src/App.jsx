import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import CommandPalette from './components/CommandPalette';
import { useAuth } from './lib/useAuth';
import { useTitle } from './lib/useTitle';
import { isSupabaseConfigured } from './lib/supabase';
import Home from './pages/Home';

// Every page except Home is loaded on demand, keeping the first download small.
const Login = lazy(() => import('./pages/Login'));
const Exhibits = lazy(() => import('./pages/Exhibits'));
const ExhibitDetail = lazy(() => import('./pages/ExhibitDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Teachers = lazy(() => import('./pages/Teachers'));
const TeacherDetail = lazy(() => import('./pages/TeacherDetail'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const History = lazy(() => import('./pages/History'));
const Creators = lazy(() => import('./pages/Creators'));
const Admin = lazy(() => import('./pages/Admin'));
const Insights = lazy(() => import('./pages/Insights'));
const Kiosk = lazy(() => import('./pages/Kiosk'));
const Placards = lazy(() => import('./pages/Placards'));
const About = lazy(() => import('./pages/About'));

const Loading = () => <main className="container section"><p>Ачаалж байна…</p></main>;

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" replace />;
}

function NotFound() {
  useTitle('Хуудас олдсонгүй');
  return (
    <main className="container section">
      <h1 className="h2">Хуудас олдсонгүй</h1>
      <Link to="/" className="link">Нүүр хуудас руу буцах</Link>
    </main>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const bare = pathname === '/kiosk'; // exhibition screen: no navigation chrome

  return (
    <>
      {!bare && <Nav />}
      {!isSupabaseConfigured && (
        <p role="alert" className="config-alert">
          Supabase тохируулаагүй байна: .env файлд VITE_SUPABASE_URL болон VITE_SUPABASE_ANON_KEY-г оруулаад npm run dev-г дахин ажиллуулна уу.
        </p>
      )}
      <CommandPalette />
      <Suspense fallback={<Loading />}>
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
          <Route path="/insights" element={<Insights />} />
          <Route path="/kiosk" element={<Kiosk />} />
          <Route path="/placards" element={<Placards />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/admin" element={<Protected><Admin /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
