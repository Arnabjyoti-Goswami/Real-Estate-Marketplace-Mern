import { FaSearch as SearchIcon } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector(state => state.user);

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
        } )
        }
        </nav>
      </div>
    </header>
  );
}

export default Header;