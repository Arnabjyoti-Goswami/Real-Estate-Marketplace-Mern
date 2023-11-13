import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {
  Home,
  About,
  Profile,
  SignIn,
  SignUp,
} from './pages/';

const App = () => {
  const pages = [
    { route: '/', component: Home },
    { route: '/about', component: About },
    { route: '/sign-in', component: SignIn },
    { route: '/sign-up', component: SignUp },
    { route: '/profile', component: Profile },
  ];

  return (
  <BrowserRouter >
    <Routes>
    {
    pages.map(item => (
      <Route path={item.route}
      key={item.route}
      element={<item.component/>}
      />
    ))
    }
    </Routes>
  </BrowserRouter>
  );
}

export default App;