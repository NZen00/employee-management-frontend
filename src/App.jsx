// src/app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './shared/layouts/MainLayout';
import DepartmentsPage from './features/department/pages/DepartmentsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<div>Dashboard</div>} />
                    <Route path="departments" element={<DepartmentsPage />} />
                    <Route path="employees" element={<div>Employees Page</div>} />
                </Route>
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default App;