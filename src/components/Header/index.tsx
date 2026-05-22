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
import { userApi } from '@/config';

const Header = () => {
    const pathname = usePathname();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userLogin, setUserLogin] = useState('');

    // Поля для регистрации
    const [regLogin, setRegLogin] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regShowPassword, setRegShowPassword] = useState(false);
    const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);
    const [regIsLoading, setRegIsLoading] = useState(false);
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');

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

    useEffect(() => {
        setRegLogin('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegError('');
        setRegSuccess('');
    }, [isRegisterOpen]);

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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegError('');
        setRegSuccess('');

        // Валидация
        if (!regLogin.trim() || !regPassword.trim()) {
            setRegError('Заполните все поля');
            return;
        }

        if (regLogin.length < 3) {
            setRegError('Логин должен быть не менее 3 символов');
            return;
        }

        if (regPassword.length < 6) {
            setRegError('Пароль должен быть не менее 6 символов');
            return;
        }

        if (regPassword !== regConfirmPassword) {
            setRegError('Пароли не совпадают');
            return;
        }

        setRegIsLoading(true);

        try {
            // Здесь вызов API для регистрации
            // await auth.register(regLogin, regPassword);
            await userApi.apiV1UserNewPost({
                request: {
                    login: regLogin,
                    password: regPassword,
                },
            });

            // Имитация успешной регистрации
            // await new Promise(resolve => setTimeout(resolve, 1000));
            
            setRegSuccess('Регистрация успешна! Теперь вы можете войти 🎉');
            setTimeout(() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
            }, 1500);
        } catch (err) {
            setRegError('Ошибка при регистрации. Возможно, такой пользователь уже существует');
        } finally {
            setRegIsLoading(false);
        }
    };

    const switchToRegister = () => {
        setIsLoginOpen(false);
        setTimeout(() => setIsRegisterOpen(true), 100);
    };

    const switchToLogin = () => {
        setIsRegisterOpen(false);
        setTimeout(() => setIsLoginOpen(true), 100);
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
                                    {`Привет, ${userLogin}!`}
                                </span>
                            </NavbarItem>
                            <NavbarItem>
                                <Button
                                    color="danger"
                                    variant="bordered"
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
                </NavbarContent>
            </Navbar>

            {/* Модальное окно входа */}
            <Modal
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                backdrop="blur"
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
                                    <div className="flex justify-between items-center">
                                        <button
                                            type="button"
                                            onClick={switchToRegister}
                                            className="text-sm text-primary/70 hover:text-primary transition-colors"
                                        >
                                            Нет аккаунта? Зарегистрироваться 🐾
                                        </button>
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

            {/* Модальное окно регистрации */}
            <Modal
                isOpen={isRegisterOpen}
                onOpenChange={setIsRegisterOpen}
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleRegister}>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-2xl font-bold text-primary">
                                    Регистрация в пушистом сообществе 🐱
                                </h2>
                                <p className="text-sm text-foreground/60">
                                    Создайте аккаунт, чтобы сохранять любимых котиков
                                </p>
                            </ModalHeader>

                            <ModalBody className="gap-4">
                                {regError && (
                                    <p className="text-danger text-sm text-center">{regError}</p>
                                )}
                                {regSuccess && (
                                    <p className="text-success text-sm text-center font-medium">{regSuccess}</p>
                                )}
                                
                                <Input
                                    autoFocus
                                    label="Придумайте логин"
                                    placeholder="Минимум 3 символа"
                                    variant="bordered"
                                    value={regLogin}
                                    onValueChange={setRegLogin}
                                    isRequired
                                    minLength={3}
                                    classNames={{
                                        label: 'text-foreground/70',
                                        input: 'text-foreground',
                                        inputWrapper: 'border-default-200 dark:border-default-100 hover:border-primary/50 transition-colors',
                                    }}
                                />

                                <Input
                                    label="Придумайте пароль"
                                    placeholder="Минимум 6 символов"
                                    variant="bordered"
                                    type={regShowPassword ? 'text' : 'password'}
                                    value={regPassword}
                                    onValueChange={setRegPassword}
                                    isRequired
                                    minLength={6}
                                    endContent={(
                                        <button
                                            type="button"
                                            onClick={() => setRegShowPassword(!regShowPassword)}
                                            className="focus:outline-none"
                                        >
                                            {regShowPassword ? (
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

                                <Input
                                    label="Повторите пароль"
                                    placeholder="Введите пароль ещё раз"
                                    variant="bordered"
                                    type={regShowConfirmPassword ? 'text' : 'password'}
                                    value={regConfirmPassword}
                                    onValueChange={setRegConfirmPassword}
                                    isRequired
                                    endContent={(
                                        <button
                                            type="button"
                                            onClick={() => setRegShowConfirmPassword(!regShowConfirmPassword)}
                                            className="focus:outline-none"
                                        >
                                            {regShowConfirmPassword ? (
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

                                <div className="flex justify-start">
                                    <button
                                        type="button"
                                        onClick={switchToLogin}
                                        className="text-sm text-primary/70 hover:text-primary transition-colors"
                                    >
                                        Уже есть аккаунт? Войти 🐾
                                    </button>
                                </div>
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
                                    isLoading={regIsLoading}
                                    className="shadow-md hover:shadow-lg transition-shadow"
                                >
                                    {regIsLoading ? 'Регистрируем...' : 'Зарегистрироваться 🐾'}
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