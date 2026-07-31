/* eslint-disable jsx-a11y/anchor-is-valid */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Avatar,
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from '@heroui/react';
import { auth } from '../../lib/auth';
import usePageTitle from '../../hooks/usePageTitle';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';

const Header = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userLogin, setUserLogin] = useState('');

    const links = [
        { href: '/', label: 'Пушистик дня' },
        { href: '/cats', label: 'Галерея' },
        // { href: '/facts', label: 'Факты' },
        // { href: '/quiz', label: 'Викторина' },
        // { href: '/generator', label: 'Придумать имя' },
        // { href: '/calendar', label: 'Календарь' },
        { href: '/new-cat', label: 'Добавить пушистика' },
    ];

    usePageTitle();

    useEffect(() => {
        void auth.getAuthorizationHeader().then((header) => {
            setIsLoggedIn(!!header);
            setUserLogin(header ? auth.getUser() || '' : '');
        });
    }, []);

    const handleLogout = () => {
        auth.logout();
        setIsLoggedIn(false);
        setUserLogin('');
        setIsMenuOpen(false);
    };

    const switchToRegister = () => {
        setIsLoginOpen(false);
        setTimeout(() => setIsRegisterOpen(true), 100);
    };

    const switchToLogin = () => {
        setIsRegisterOpen(false);
        setTimeout(() => setIsLoginOpen(true), 100);
    };

    const handleMobileLogin = () => {
        setIsMenuOpen(false);
        setTimeout(() => setIsLoginOpen(true), 300);
    };

    const handleLoginSuccess = (login: string) => {
        setIsLoggedIn(true);
        setUserLogin(login);
    };

    return (
        <>
            <Navbar
                maxWidth="xl"
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                className="
                    sticky top-0 z-50
                    bg-white/70 dark:bg-default-50
                    backdrop-blur-md
                    border-b border-default-200 dark:border-default-100
                    shadow-sm
                "
            >
                <NavbarContent justify="start">
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                        className="sm:hidden"
                    />
                    <NavbarBrand className="flex items-center gap-3">
                        <Avatar
                            name="Ричик"
                            src="/rich.jpg"
                            size="md"
                            className="shadow-md hover:scale-105 transition-transform"
                        />
                        <Link
                            href="/"
                            className="font-bold text-inherit text-lg tracking-wide"
                        >
                            Пушистик дня 🐾
                        </Link>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-6" justify="center">
                    {links.map(({ href, label }) => {
                        const isActiveLink = pathname === href || (href !== '/' && pathname.startsWith(href));
                        return (
                            <NavbarItem key={href} isActive={isActiveLink}>
                                <Link
                                    href={href}
                                    className={`relative transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                                        isActiveLink
                                            ? 'text-primary font-semibold after:scale-x-100'
                                            : 'text-foreground hover:text-primary/80'
                                    }`}
                                >
                                    {label}
                                </Link>
                            </NavbarItem>
                        );
                    })}
                </NavbarContent>

                <NavbarContent justify="end" className="gap-3">
                    {isLoggedIn ? (
                        <>
                            <NavbarItem className="hidden lg:flex">
                                <span className="text-foreground/70">
                                    {`Привет, ${userLogin}!`}
                                </span>
                            </NavbarItem>
                            <NavbarItem>
                                <Button
                                    color="danger"
                                    variant="bordered"
                                    onPress={handleLogout}
                                    size="sm"
                                    className="hidden sm:flex"
                                >
                                    Выйти
                                </Button>
                            </NavbarItem>
                        </>
                    ) : (
                        <NavbarItem>
                            <Button
                                color="primary"
                                variant="ghost"
                                size="sm"
                                onPress={() => setIsLoginOpen(true)}
                                className="hidden sm:flex"
                            >
                                Войти
                            </Button>
                        </NavbarItem>
                    )}
                </NavbarContent>

                <NavbarMenu className="pt-6 gap-2">
                    {links.map(({ href, label }) => {
                        const isActiveLink = pathname === href || (href !== '/' && pathname.startsWith(href));
                        return (
                            <NavbarMenuItem key={href}>
                                <Link
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`w-full text-lg py-2 px-4 rounded-lg transition-all duration-300 ${
                                        isActiveLink
                                            ? 'text-primary font-semibold bg-primary/10'
                                            : 'text-foreground hover:text-primary hover:bg-default-100'
                                    }`}
                                >
                                    {label}
                                </Link>
                            </NavbarMenuItem>
                        );
                    })}

                    {isLoggedIn ? (
                        <>
                            <NavbarMenuItem>
                                <div className="px-4 py-2 text-foreground/70 text-sm">
                                    Привет,
                                    {' '}
                                    {userLogin}
                                    !
                                </div>
                            </NavbarMenuItem>
                            <NavbarMenuItem>
                                <Button
                                    color="danger"
                                    variant="bordered"
                                    onPress={handleLogout}
                                    className="w-full"
                                >
                                    Выйти
                                </Button>
                            </NavbarMenuItem>
                        </>
                    ) : (
                        <NavbarMenuItem>
                            <Button
                                color="primary"
                                variant="ghost"
                                onPress={handleMobileLogin}
                                className="w-full"
                            >
                                Войти 🐾
                            </Button>
                        </NavbarMenuItem>
                    )}
                </NavbarMenu>
            </Navbar>

            <LoginModal
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                onSwitchToRegister={switchToRegister}
                onLoginSuccess={handleLoginSuccess}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onOpenChange={setIsRegisterOpen}
                onSwitchToLogin={switchToLogin}
            />
        </>
    );
};

export default Header;
