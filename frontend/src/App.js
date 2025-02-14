import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import ShopContextProvider from './Context/ShopContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContent from './AppContent';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <ShopContextProvider>
            <AppContent />
          </ShopContextProvider>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
