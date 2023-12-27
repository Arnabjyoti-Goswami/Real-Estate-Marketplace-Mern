import { FaSearch as SearchIcon } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const Header = () => {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const navOptions = [
    { label: 'Home', route: '/'},
    { label: 'About', route: '/about'},
    { label: 'Sign in', route: '/sign-in'},
  ];

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const updateUrl = (searchTerm) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUrl(searchTerm);
  }

  const getSearchTermFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  };

  useEffect(() => {
    getSearchTermFromUrl();
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>
              Riyal
            </span>
            <span className='text-slate-700'>
              Estate
            </span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit}
        className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input 
          type="text" 
          placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          />
          <button type='submit'>
            <SearchIcon className='text-slate-600' />
          </button>
        </form>

        <nav className='flex gap-4'>
        {
        navOptions.map( (item, index) => {
          if (index === 2 && currentUser) {
            return (
              <Link key='2' to='/profile'>
                <img src={currentUser.avatar} 
                alt='Profile'
                className='rounded-full h-7 w-7 object-cover'
                />
              </Link>
            )
          }
          return ( 
            <NavLink to={item.route}
            key={`nav option #${index}`}
            className={ ({isActive}) => { 
            return `
              text-slate-500 text-[17px]
              hover:underline
              ${index !== navOptions.length - 1 ? 'hidden sm:inline' : ''}
              ${isActive ? 
                'text-bg-blue-gradient font-semibold' 
                : 
                ''}
            `} }
            >
              {item.label}
            </ NavLink>
          )
        } )
        }
        </nav>
      </div>
    </header>
  );
}

export default Header;