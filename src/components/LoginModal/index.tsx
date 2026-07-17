'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../../lib/auth';

interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSwitchToRegister: () => void;
    onLoginSuccess: (userLogin: string) => void;
}

const LoginModal = ({ isOpen, onOpenChange, onSwitchToRegister, onLoginSuccess }: LoginModalProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLogin('');
        setPassword('');
        setShowPasswordReset(false);
    }, [isOpen]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await auth.login(login, password);
            onLoginSuccess(auth.getUser() || '');
            onOpenChange(false);
            setLogin('');
            setPassword('');
        } catch {
            setError('Неверный логин или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
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
                                        onClick={onSwitchToRegister}
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
    );
};

export default LoginModal;
