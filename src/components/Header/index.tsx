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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/auth';

const Header = () => {
    const pathname = usePathname();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
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

    useEffect(() => {
        setLogin('');
        setPassword('');
        setShowPasswordReset(false);
        setIsLoggedIn(auth.isAuthenticated());
        setUserLogin(auth.getUser() || '');
    }, [isLoginOpen]);

    const handleLogout = () => {
        auth.logout();
        setIsLoggedIn(false);
        setUserLogin('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await auth.login(login, password);
            setIsLoggedIn(true);
            setIsLoginOpen(false);
            setLogin('');
            setPassword('');
        } catch (err) {
            setError('Неверный логин или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                                    Привет, {userLogin}!
                                </span>
                            </NavbarItem>
                            <NavbarItem>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={handleLogout}
                                >
                                    Выйти
                                </Button>
                            </NavbarItem>
                        </>
                    ) : (
                        <NavbarItem className="hidden lg:flex">
                            <button
                                type="button"
                                onClick={() => setIsLoginOpen(true)}
                                className="text-foreground/70 hover:text-primary transition-colors"
                            >
                                Войти
                            </button>
                        </NavbarItem>
                    )}

                    <NavbarItem>
                        <Button
                            as={Link}
                            color="primary"
                            href="/cats"
                            variant="shadow"
                            className="w-fit font-medium shadow-md hover:shadow-lg transition-shadow"
                        >
                            Галерея
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <Modal
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                backdrop="blur"
                className="bg-white/90 dark:bg-default-50/90 backdrop-blur-md"
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleLogin}>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-2xl font-bold text-primary">
                                    Вход в пушистое сообщество 🐱
                                </h2>
                                <p className="text-sm text-foreground/60">
                                    Войдите, чтобы сохранять любимых котиков
                                </p>
                            </ModalHeader>

                            <ModalBody className="gap-4">
                                {error && (
                                    <p className="text-danger text-sm text-center">{error}</p>
                                )}
                                <Input
                                    autoFocus
                                    label="Логин"
                                    placeholder="Введите ваш логин"
                                    variant="bordered"
                                    value={login}
                                    onValueChange={setLogin}
                                    isRequired
                                    classNames={{
                                        label: 'text-foreground/70',
                                        input: 'text-foreground',
                                        inputWrapper: 'border-default-200 dark:border-default-100 hover:border-primary/50 transition-colors',
                                    }}
                                />

                                <Input
                                    label="Пароль"
                                    placeholder="Введите пароль"
                                    variant="bordered"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onValueChange={setPassword}
                                    isRequired
                                    endContent={(
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-foreground/40 hover:text-primary transition-colors" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-foreground/40 hover:text-primary transition-colors" />
                                            )}
                                        </button>
                                    )}
                                    classNames={{
                                        label: 'text-foreground/70',
                                        input: 'text-foreground',
                                        inputWrapper: 'border-default-200 dark:border-default-100 hover:border-primary/50 transition-colors',
                                    }}
                                />

                                {!showPasswordReset && (
                                    <div className="flex justify-end">
                                        <Link
                                            href="#"
                                            onClick={() => setShowPasswordReset(true)}
                                            className="text-sm text-primary/70 hover:text-primary transition-colors"
                                        >
                                            Забыли пароль? 😿
                                        </Link>
                                    </div>
                                )}
                                {showPasswordReset && (
                                    <div className="flex justify-end">
                                        <span className="text-sm text-foreground/50 italic cursor-help">
                                            Мы пока не умеем восстанавливать пароли, попробуйте вспомнить, мяу 😸
                                        </span>
                                    </div>
                                )}
                            </ModalBody>

                            <ModalFooter className="gap-3">
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                    className="hover:bg-danger/10"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    color="success"
                                    type="submit"
                                    isLoading={isLoading}
                                    className="shadow-md hover:shadow-lg transition-shadow"
                                >
                                    {isLoading ? 'Входим...' : 'Войти 🐾'}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default Header;
