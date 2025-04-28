import './App.css';
import { Routes, Route, } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';


const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/signin'));
const SignUp = lazy(() => import('./pages/signup'));
const AdminSignIn = lazy(() => import('./pages/admin-signin'));
const DashboardLayoutBasic = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/admin-dashboard'));
const Add = lazy(() => import('./pages/admin-addfood'));
const AddFood = lazy(() => import('./pages/addfood'));
const AboutUs = lazy(() => import('./pages/about'));
const Viewusers = lazy(() => import('./pages/admin-viewusers'))
const AddExercise = lazy(() => import('./pages/admin-exercise'))
const ExerciseDashboard = lazy(() => import('./pages/admin-viewexercise'))
const FoodStatistics = lazy(() => import('./pages/foodstats'))
const ExerciseStatistics = lazy(() => import('./pages/exercisestats'))
const Exercise = lazy(() => import('./pages/addexercise'))
const Account = lazy(() => import('./pages/account'))
const AdminRecom = lazy(() => import('./pages/AdminRecom'))
const AdminViewRecom = lazy(() => import('./pages/AdminViewRecom'))
const Recommendations = lazy(() => import('./pages/Recommendations'))
function App() {
  return (
    <div className="App">
      <div className='App-body'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin-signin" element={<AdminSignIn />} />
            <Route path="/Dashboard" element={<DashboardLayoutBasic />} />
            <Route path="/admin-dashboard" element={<Admin />} />
            <Route path="/admin-addfood" element={<Add />} />
            <Route path="/addfood" element={<AddFood />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin-viewusers" element={<Viewusers />} />
            <Route path="/admin-exercise" element={<AddExercise />} />
            <Route path="/admin-viewexercise" element={<ExerciseDashboard />} />
            <Route path="/foodstats" element={<FoodStatistics />} />
            <Route path="/exercisestats" element={<ExerciseStatistics />} />
            <Route path="/addexercise" element={<Exercise />} />
            <Route path="/account" element={<Account />} />
            <Route path="/AdminRecom" element={<AdminRecom />} />
            <Route path="/AdminViewRecom" element={<AdminViewRecom />} />
            <Route path="/Recommendations" element={<Recommendations />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
