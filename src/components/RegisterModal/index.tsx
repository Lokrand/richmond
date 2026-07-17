'use client';

import React, { useEffect, useState } from 'react';
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
import { userApi } from '../../config';

interface RegisterModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSwitchToLogin: () => void;
}

const RegisterModal = ({ isOpen, onOpenChange, onSwitchToLogin }: RegisterModalProps) => {
    const [regLogin, setRegLogin] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regShowPassword, setRegShowPassword] = useState(false);
    const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);
    const [regIsLoading, setRegIsLoading] = useState(false);
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');

    useEffect(() => {
        setRegLogin('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegError('');
        setRegSuccess('');
    }, [isOpen]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegError('');
        setRegSuccess('');

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
            await userApi.apiV1UserNewPost({
                request: {
                    login: regLogin,
                    password: regPassword,
                },
            });

            setRegSuccess('Регистрация успешна! Теперь вы можете войти 🎉');
            setTimeout(() => {
                onOpenChange(false);
                onSwitchToLogin();
            }, 1500);
        } catch {
            setRegError('Ошибка при регистрации. Возможно, такой пользователь уже существует');
        } finally {
            setRegIsLoading(false);
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
                                    onClick={onSwitchToLogin}
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
    );
};

export default RegisterModal;
