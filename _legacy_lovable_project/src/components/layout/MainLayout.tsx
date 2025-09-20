import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import ImprovedNavigation from '../navigation/ImprovedNavigation';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ImprovedNavigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
