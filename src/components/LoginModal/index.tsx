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
import { toast } from 'sonner';
import { useLogin } from '../../hooks/useUser';

interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSwitchToRegister: () => void;
    onLoginSuccess: (userLogin: string) => void;
}

const LoginModal = ({
    isOpen, onOpenChange, onSwitchToRegister, onLoginSuccess,
}: LoginModalProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const loginMutation = useLogin();

    useEffect(() => {
        setLogin('');
        setPassword('');
        setShowPasswordReset(false);
    }, [isOpen]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await loginMutation.mutateAsync({ login, password });
            onLoginSuccess(login);
            onOpenChange(false);
            toast.success('Вы вошли в аккаунт', { description: `Рады видеть, ${login}!` });
            setLogin('');
            setPassword('');
        } catch {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleLogin}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary">
                            Вход в пушистое сообщество 🐱
                        </DialogTitle>
                        <DialogDescription>
                            Войдите, чтобы сохранять любимых котиков
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        {error && (
                            <p className="text-danger text-sm text-center">{error}</p>
                        )}
                        <Input
                            autoFocus
                            label="Логин"
                            placeholder="Введите ваш логин"
                            value={login}
                            onValueChange={setLogin}
                            isRequired
                        />

                        <Input
                            label="Пароль"
                            placeholder="Введите пароль"
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
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordReset(true)}
                                    className="text-sm text-primary/70 hover:text-primary transition-colors"
                                >
                                    Забыли пароль? 😿
                                </button>
                            </div>
                        )}
                        {showPasswordReset && (
                            <div className="flex justify-end">
                                <span className="text-sm text-foreground/50 italic cursor-help">
                                    Мы пока не умеем восстанавливать пароли, попробуйте вспомнить, мяу 😸
                                </span>
                            </div>
                        )}
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
                            isLoading={loginMutation.isPending}
                            className="shadow-md hover:shadow-lg transition-shadow"
                        >
                            {loginMutation.isPending ? 'Входим...' : 'Войти 🐾'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;
