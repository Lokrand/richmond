'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleRegister}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary">
                            Регистрация в пушистом сообществе 🐱
                        </DialogTitle>
                        <DialogDescription>
                            Создайте аккаунт, чтобы сохранять любимых котиков
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
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
                            value={regLogin}
                            onValueChange={setRegLogin}
                            isRequired
                            minLength={3}
                        />

                        <Input
                            label="Придумайте пароль"
                            placeholder="Минимум 6 символов"
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
                        />

                        <Input
                            label="Повторите пароль"
                            placeholder="Введите пароль ещё раз"
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
                    </div>

                    <DialogFooter className="gap-3">
                        <DialogClose asChild>
                            <Button
                                color="danger"
                                variant="light"
                                className="hover:bg-danger/10"
                            >
                                Отмена
                            </Button>
                        </DialogClose>
                        <Button
                            color="success"
                            type="submit"
                            isLoading={regIsLoading}
                            className="shadow-md hover:shadow-lg transition-shadow"
                        >
                            {regIsLoading ? 'Регистрируем...' : 'Зарегистрироваться 🐾'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterModal;
