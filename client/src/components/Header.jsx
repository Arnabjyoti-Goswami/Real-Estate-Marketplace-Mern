import { FaSearch as SearchIcon } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';

import {
  Home,
  About,
  Profile,
  SignIn,
  SignUp,
} from '../pages/';

const pages = [
  { 
    route: '/', 
    component: Home, 
    label: 'Home' 
  },
  { 
    route: '/about', 
    component: About, 
    label: 'About' 
  },
  { 
    route: '/sign-in', 
    component: SignIn, 
    label: 'Sign In' 
  },
  { 
    route: '/sign-up', 
    component: SignUp, 
    label: 'Sign Up' 
  },
  { 
    route: '/profile', 
    component: Profile, 
    label: 'Profile' 
  },
];

const Header = () => {
  const navOptions = [
    { label: 'Home', route: '/'},
    { label: 'About', route: '/about'},
    { label: 'Sign in', route: '/sign-in'},
  ];

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

        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input 
          type="text" 
          placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
          <SearchIcon className='text-slate-600' />
        </form>

        <nav className='flex gap-4'>
        {
        pages.map( (item, index) => (
          <NavLink to={item.route}
          key={`nav option #${index}`}
          className={ ({isActive}) => { return `
          text-slate-500 hover:underline
          ${index !== navOptions.length - 1 ? 'hidden sm:inline' : ''}
          ${isActive ? 
            'text-bg-blue-gradient' 
            : 
            ''}
          `} }
          >
            {item.label}
          </ NavLink>
          )
        )
        }
        </nav>
      </div>
    </header>
  );
}

export {
  pages,
  Header,
};