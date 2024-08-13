"use client";

import React from 'react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Modal from '@/components/ui/modal';
import { useRouter } from 'next/navigation';


interface ILoginOTPProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

const LoginModal: React.FC<ILoginOTPProps> = ({
    isOpen,
    onClose,
    loading
}) => {
    const router = useRouter();

    const handleLogin = () => {
        const apiUrl = process.env.NEXT_PUBLIC_APP_UPSTOX_API_URL + 'login/authorization/dialog';
        const clientId = process.env.NEXT_PUBLIC_APP_UPSTOX_API_KEY;
        const redirectUrl = "http://localhost:3000";
        const responseType = "code";
        window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=${responseType}`;
    }

    return (
        <Modal
            title="Login"
            description=""
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-col">
                <Button onClick={handleLogin}>Login Upstox</Button>
            </div>
        </Modal>
    )
}

export default LoginModal
