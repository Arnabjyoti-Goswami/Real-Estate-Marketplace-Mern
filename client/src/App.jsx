import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';

import {
  Home,
  About,
  Profile,
  SignIn,
  SignUp,
  CreateListing,
  Listing,
  UpdateListing,
  ResetPassword,
  SearchListing,
} from './pages/index.js';

import PrivateRoute from './components/PrivateRoute.jsx';

const pages = [
  { 
    route: '/', 
    component: Home, 
  },
  { 
    route: '/about', 
    component: About, 
  },
  { 
    route: '/sign-in', 
    component: SignIn, 
  },
  { 
    route: '/sign-up', 
    component: SignUp, 
  },
  {
    route: '/listing/:id',
    component: Listing,
  },
  {
    route: '/reset-password',
    component: ResetPassword,
  },
  {
    route: '/search',
    component: SearchListing,
  }
];

const App = () => {
  return (
  <BrowserRouter >
    <Header />
    <Routes>
    {
    pages.map(item => (
      <Route path={item.route}
      key={item.route}
      element={<item.component />}
      />
    ))
    }
      <Route element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path='/create-listing' element={<CreateListing />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path='/update-listing/:id' element={<UpdateListing />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;