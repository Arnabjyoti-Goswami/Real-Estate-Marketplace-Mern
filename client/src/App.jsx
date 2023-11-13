import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { pages, Header } from './components/Header.jsx';

const App = () => {
  return (
  <BrowserRouter >
    <Header />
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