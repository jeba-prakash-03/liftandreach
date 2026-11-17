import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const legacyRedirectMap: Record<string, string> = {
  '/about.php': '/about',
  '/contact.php': '/contact',
  '/gallery.php': '/products',
  '/index.php': '/',
  '/scissor lift.php': '/products/scissor-lift',
  '/scissor lift hydraulic pit mounted floor mounted.php': '/products/scissor-lift/scissor-lift-hydraulic/pit-mounted-floor-mounted',
  '/scissor lift TOWABLE (Multi Scissor)-Electric.php': '/products/scissor-lift/towable-multi-scissor',
  '/goods lift.php': '/products/goods-lift',
  '/goods lift standalone.php': '/products/goods-lift/single-and-double-column-standalone-structure',
  '/goods lift wall.php': '/products/goods-lift/single-and-double-column-wall-mounted',
  '/aerial access platform.php': '/products/aerial-access-platform',
  '/aerial access platform truck mounted.php': '/products/aerial-access-platform/aerial-truck-mounted',
  '/aerial access platform towable.php': '/products/aerial-access-platform/aerial-towable',
  '/stacker.php': '/products/stacker',
  '/pallet truck.php': '/products/pallet-truck',
  '/ZERO LIFT.php': '/products/zero-lift',
  '/zero lift.php': '/products/zero-lift',
  '/HYDRAULIC BARREL LIFTER & TILTER.php': '/products/hydraulic-barrel-lifter-tilter',
  '/hydraulic barrel lifter tilter.php': '/products/hydraulic-barrel-lifter-tilter',
  '/HYDRAULIC FLOOR CRANE - LIGHT DUTY.php': '/products/hydraulic-floor-crane-light-duty',
  '/hydraulic floor crane.php': '/products/hydraulic-floor-crane-light-duty',
  '/DOCK LEVELER.php': '/products/dock-leveler',
  '/dock leveler.php': '/products/dock-leveler',
  '/aircraft jacks.php': '/products/aircraft-jacks',
  '/hollow.php': '/products/hollow-and-solid-ram-hydraulic-jack'
};

export const LegacyUrlRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Decode URI path in case of spaces like %20
    const decodedPath = decodeURIComponent(location.pathname);
    if (legacyRedirectMap[decodedPath]) {
      navigate(legacyRedirectMap[decodedPath], { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
};
