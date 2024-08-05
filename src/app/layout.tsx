import React, { ReactNode } from 'react';

import AppNavBar from '@/components/navigation/navbar';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AppNavBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
