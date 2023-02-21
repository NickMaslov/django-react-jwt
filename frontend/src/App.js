import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Header from './components/Header';

function App() {
    return (
        <div className='App'>
            <Router>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route
                            element={
                                <PrivateRoute>
                                    <HomePage />
                                </PrivateRoute>
                            }
                            path='/'
                        />
                        <Route element={<Login />} path='/login' />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
