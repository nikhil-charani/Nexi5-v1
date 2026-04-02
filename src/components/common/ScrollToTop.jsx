import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset window scroll (for landing page / global routes)
    window.scrollTo(0, 0);
    
    // Reset dashboard main content scroll (if it exists)
    const dashboardMain = document.querySelector('main.overflow-y-auto');
    if (dashboardMain) {
      dashboardMain.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
