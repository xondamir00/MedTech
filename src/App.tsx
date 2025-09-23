
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe(); 
  }, [fetchMe]);
  return (
  
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>

  );
}

export default App;