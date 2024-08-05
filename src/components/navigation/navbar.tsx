'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ConnectWalletButton from '../web3/connectWalletButton';

export default function AppNavBar() {
  const router = useRouter();

  const navigateHome = () => {
    router.push('/');
  };

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit cursor-pointer" onClick={navigateHome}>
          MONACO PROTOCOL
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center"></NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ConnectWalletButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
