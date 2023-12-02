import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';

import {
  Home,
  About,
  Profile,
  SignIn,
  SignUp,
} from './pages/';

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
    </Routes>
  </BrowserRouter>
  );
}

export default App;