import { NavbarComponent } from '@/components/Navbar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (

    <div>
      <NavbarComponent />
      {children}
    </div>
  )
}

export default layout