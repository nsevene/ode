import { NavLink, Outlet } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Calendar,
  Heart,
  MapPin,
  CreditCard,
  Bell,
} from 'lucide-react';

const sidebarNavItems = [
  {
    to: '/profile/details',
    label: 'Profile Details',
    icon: User,
  },
  {
    to: '/profile/orders',
    label: 'Order History',
    icon: ShoppingBag,
  },
  {
    to: '/profile/bookings',
    label: 'Booking History',
    icon: Calendar,
  },
  {
    to: '/profile/favorites',
    label: 'Favorites',
    icon: Heart,
  },
  {
    to: '/profile/addresses',
    label: 'Addresses',
    icon: MapPin,
  },
  {
    to: '/profile/payments',
    label: 'Payment Methods',
    icon: CreditCard,
  },
  {
    to: '/profile/notifications',
    label: 'Notifications',
    icon: Bell,
  },
];

const ProfileSidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="space-y-1">
        {sidebarNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/profile'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const ProfileLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <ProfileSidebar />
        <div className="flex-grow mt-8 md:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
