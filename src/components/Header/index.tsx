/* eslint-disable jsx-a11y/anchor-is-valid */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
        let isMounted = true;
        auth.getAuthorizationHeader().then((header) => {
            if (isMounted) {
                setIsLoggedIn(!!header);
                setUserLogin(header ? auth.getUser() || '' : '');
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = () => {
        auth.logout();
        setIsLoggedIn(false);
        setUserLogin('');
        setIsMenuOpen(false);
        toast.success('Вы вышли из аккаунта');
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

    const isActiveLink = (href: string) => (
        pathname === href || (href !== '/' && pathname.startsWith(href))
    );

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/70 dark:bg-default-50 backdrop-blur-md border-b border-default-200 dark:border-default-100 shadow-sm">
                <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="sm:hidden rounded-lg p-2 text-foreground/70 transition-colors hover:bg-default-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Avatar className="size-9 shadow-md hover:scale-105 transition-transform">
                            <AvatarImage src="/rich.jpg" alt="Ричик" />
                            <AvatarFallback>Р</AvatarFallback>
                        </Avatar>
                        <Link
                            href="/"
                            className="font-bold text-foreground text-lg tracking-wide"
                        >
                            Пушистик дня 🐾
                        </Link>
                    </div>

                    <div className="hidden sm:flex items-center gap-6">
                        {links.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`relative transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                                    isActiveLink(href)
                                        ? 'text-primary font-semibold after:scale-x-100'
                                        : 'text-foreground hover:text-primary/80'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <span className="hidden lg:flex text-foreground/70">
                                    {`Привет, ${userLogin}!`}
                                </span>
                                <Button
                                    color="danger"
                                    variant="bordered"
                                    onClick={handleLogout}
                                    size="sm"
                                    className="hidden sm:flex"
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <Button
                                color="primary"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsLoginOpen(true)}
                                className="hidden sm:flex"
                            >
                                Войти
                            </Button>
                        )}
                    </div>
                </nav>

                {isMenuOpen && (
                    <div className="sm:hidden border-t border-default-200 dark:border-default-100 bg-white/70 dark:bg-default-50 backdrop-blur-md">
                        <div className="flex flex-col gap-1 px-4 py-4">
                            {links.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`w-full text-lg py-2 px-4 rounded-lg transition-all duration-300 ${
                                        isActiveLink(href)
                                            ? 'text-primary font-semibold bg-primary/10'
                                            : 'text-foreground hover:text-primary hover:bg-default-100'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            {isLoggedIn ? (
                                <>
                                    <div className="px-4 py-2 text-foreground/70 text-sm">
                                        Привет,
                                        {' '}
                                        {userLogin}
                                        !
                                    </div>
                                    <Button
                                        color="danger"
                                        variant="bordered"
                                        onClick={handleLogout}
                                        className="w-full"
                                    >
                                        Выйти
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    color="primary"
                                    variant="ghost"
                                    onClick={handleMobileLogin}
                                    className="w-full"
                                >
                                    Войти 🐾
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </header>

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
