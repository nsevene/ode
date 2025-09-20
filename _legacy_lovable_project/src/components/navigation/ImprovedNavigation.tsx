import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/todos', label: 'Todos' },
  { to: '/contact', label: 'Contact' },
];

const ImprovedNavigation = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              ODE
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'text-white bg-gray-900'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-700"
                >
                  Profile
                </Link>
                <Button onClick={logout} size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex justify-end p-2">
                  <Button variant="ghost" size="icon" onClick={closeMenu}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4 items-center mt-6">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-base font-medium w-full text-center ${
                          isActive
                            ? 'text-white bg-gray-900'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  <div className="border-t w-full pt-4 mt-4 flex flex-col items-center space-y-3">
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={closeMenu}
                          className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Profile
                        </Link>
                        <Button
                          onClick={() => {
                            logout();
                            closeMenu();
                          }}
                          className="w-full"
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/auth" onClick={closeMenu}>
                          Login
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default ImprovedNavigation;
