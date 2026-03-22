"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface SModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}
export default function SModal({ isOpen, onClose, title = 'Confirm', children }: SModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    if (!isOpen || typeof document === "undefined") return null;


    return createPortal(
        <div
            id="S_MODAL"
            className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-2xl bg-slate-50 p-6 shadow-lg dark:bg-slate-950 sm:p-8 max-h-[calc(100vh-2rem)] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-xl font-semibold">{title}</h2>
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
