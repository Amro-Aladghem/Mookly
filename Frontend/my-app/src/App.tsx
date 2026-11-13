import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { CreateInterviewView } from '@/views/CreateInterviewView';
import { CreateUserView } from '@/views/CreateUserView';
import { HistoryView } from '@/views/HistoryView';
import { HomeView } from '@/views/HomeView';
import { InterviewView } from '@/views/InterviewView';
import { ProfileView } from '@/views/ProfileView';
import { ResultsView } from '@/views/ResultsView';

function AppShell() {
  const { userId, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <LoadingState label="جارٍ تحميل حسابك…" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <main className="flex-1">
          <CreateUserView />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <AppHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/create-interview" element={<CreateInterviewView />} />
          <Route path="/history" element={<HistoryView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/interview/:chatSignature" element={<InterviewView />} />
          <Route path="/results/:mockInterviewId" element={<ResultsView />} />
          <Route path="*" element={<HomeView />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppShell />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;