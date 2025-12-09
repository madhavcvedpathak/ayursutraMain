import { useState } from 'react';
import { X, ShieldCheck, CreditCard, Lock } from 'lucide-react';

interface PaymentModalProps {
    amount: number;
    description: string;
    onSuccess: (txnId: string) => void;
    onClose: () => void;
}

export const PaymentModal = ({ amount, description, onSuccess, onClose }: PaymentModalProps) => {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'card' | 'otp' | 'success'>('card');

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        // Simulate network delay
        setTimeout(() => {
            setProcessing(false);
            setStep('otp');
        }, 1500);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setStep('success');
            // Auto close after success
            setTimeout(() => {
                onSuccess(`TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="bg-[#2b3a42] p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-green-400" />
                        <span className="font-medium tracking-wide">Secure Payment</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Order Summary */}
                    <div className="mb-6 flex justify-between items-end border-b pb-4">
                        <div>
                            <div className="text-xs text-brand-muted uppercase tracking-wider">Total Payable</div>
                            <div className="text-3xl font-bold text-brand-deep">₹{amount.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-brand-muted">{description}</div>
                            <div className="text-xs text-green-600 font-medium">Test Mode</div>
                        </div>
                    </div>

                    {step === 'card' && (
                        <form onSubmit={handlePay} className="space-y-4 animate-slide-up">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">CVV</label>
                                    <input type="password" placeholder="123" maxLength={3} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center" required />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-brand-deep text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {processing ? (
                                    <>Processing...</>
                                ) : (
                                    <>PAY ₹{amount.toLocaleString()}</>
                                )}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-slide-up text-center">
                            <div className="mb-4">
                                <div className="text-sm text-gray-600">Enter OTP sent to your mobile</div>
                                <div className="text-xs text-blue-600 font-medium">+91 XXXXX XXXXX</div>
                            </div>
                            <input
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                className="w-2/3 mx-auto block p-3 text-center text-2xl tracking-[0.5em] font-bold rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-70"
                            >
                                {processing ? 'Verifying...' : 'Verify & Pay'}
                            </button>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8 animate-scale-in">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={40} className="text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-brand-deep">Payment Successful!</h3>
                            <p className="text-gray-500 mt-2">Redirecting to confirmation...</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase">
                        <Lock size={10} /> 256-Bit SSL Encrypted
                    </div>
                </div>
            </div>
        </div>
    );
};
