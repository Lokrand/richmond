'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Avatar,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';

const Header = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Пушистик дня' },
    { href: '/gallery', label: 'Галерея' },
    { href: '/gpt-cat', label: 'Хаос' },
  ];

  return (
    <Navbar
      maxWidth="xl"
      className="
        sticky top-0 z-50
        bg-white/70 dark:bg-default-50
        backdrop-blur-md
        border-b border-default-200 dark:border-default-100
        shadow-sm
      "
    >
      {/* Левая часть: бренд */}
      <NavbarBrand className="flex items-center gap-3">
        <Avatar
          name="Ричик"
          src="/rich.jpg"
          size="md"
          className="shadow-md hover:scale-105 transition-transform"
        />
        <p className="font-bold text-inherit text-lg tracking-wide">
          Пушистик дня 🐾
        </p>
      </NavbarBrand>

      {/* Центр: навигация */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {links.map(({ href, label }) => (
          <NavbarItem key={href} isActive={pathname === href}>
            <Link
              href={href}
              className={`relative transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                pathname === href
                  ? 'text-primary font-semibold after:scale-x-100'
                  : 'text-foreground hover:text-primary/80'
              }`}
            >
              {label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Правая часть: кнопки */}
      <NavbarContent justify="end" className="gap-3">
        <NavbarItem className="hidden lg:flex">
          <Link
            href="#"
            className="text-foreground/70 hover:text-primary transition-colors"
          >
            Войти
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="#"
            variant="shadow"
            className="w-[130px] font-medium text-white shadow-md hover:shadow-lg transition-shadow"
          >
            Регистрация
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
