import React, { useState } from 'react';
import { Course } from '../../types.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  Tag,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface PaymentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, addToast, refreshUserData } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ code: string; amount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [cardHolder, setCardHolder] = useState('Aman Sharma');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8910');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const basePrice = course.discountedPrice;
  const discountVal = discountApplied ? discountApplied.amount : 0;
  const finalAmount = Math.max(0, basePrice - discountVal);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError('');

    if (code === 'STUDY50') {
      setDiscountApplied({ code: 'STUDY50', amount: 50 });
      setCouponCode('STUDY50');
      addToast('Coupon STUDY50 applied! ₹50 extra off', 'success');
    } else if (code === 'SELECTION10') {
      const amt = Math.round(basePrice * 0.1);
      setDiscountApplied({ code: 'SELECTION10', amount: amt });
      setCouponCode('SELECTION10');
      addToast(`Coupon SELECTION10 applied! ₹${amt} off`, 'success');
    } else if (code === 'RAILWAY20') {
      const amt = Math.round(basePrice * 0.2);
      setDiscountApplied({ code: 'RAILWAY20', amount: amt });
      setCouponCode('RAILWAY20');
      addToast(`Coupon RAILWAY20 applied! ₹${amt} off`, 'success');
    } else {
      setCouponError('Invalid coupon code. Try STUDY50 or SELECTION10');
    }
  };

  const handleProcessPayment = async () => {
    if (!user) {
      addToast('Please login to complete payment', 'error');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create order on backend
      const createRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: course.id,
          amount: finalAmount,
          paymentMethod
        })
      });
      const createData = await createRes.json();

      if (!createRes.ok || !createData.order) {
        throw new Error(createData.message || 'Order creation failed');
      }

      // Simulate bank 2-second processing
      await new Promise((res) => setTimeout(res, 1800));

      // 2. Verify payment on backend to activate enrollment
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createData.order.id,
          paymentId: `pay_${Date.now()}`,
          signature: `sig_${Math.random().toString(36).substr(2, 9)}`
        })
      });
      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        await refreshUserData();
        addToast(`🎉 Payment successful! You are now enrolled in ${course.title}`, 'success');
        onSuccess(course.id);
        onClose();
      } else {
        throw new Error(verifyData.message || 'Payment verification failed');
      }
    } catch (err: any) {
      addToast(err.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header with security badges */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">StudyWay Secure Checkout</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted • Instant Course Activation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left: Payment Method Selection */}
          <div className="md:col-span-7 p-6 border-b md:border-b-0 md:border-r border-slate-800 space-y-5">
            {/* Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <span>Instant UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span>Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* UPI Details */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
                  <span className="font-semibold">Supported UPI Apps:</span>
                  <span className="text-amber-400 font-medium">GPay • PhonePe • Paytm • BHIM</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter UPI VPA ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okaxis or mobile@upi"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    A payment request will be sent to your UPI app for 1-click authorization.
                  </span>
                </div>

                {/* QR Code Demo Box */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-950" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Scan & Pay ₹{finalAmount}</p>
                    <p className="text-[11px] text-slate-400">Open any UPI app on phone to scan</p>
                  </div>
                </div>
              </div>
            )}

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400">RuPay, Visa, MasterCard, Maestro supported.</p>
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300">Choose Your Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Bank of Baroda', 'Axis Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2 rounded-xl border text-xs text-left font-medium transition-colors ${
                        selectedBank === bank
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary & Coupon */}
          <div className="md:col-span-5 p-6 bg-slate-900/40 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Order Summary</h4>
              <div className="flex gap-3 pb-4 border-b border-slate-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-12 object-cover rounded-lg ring-1 ring-slate-700 shrink-0"
                />
                <div className="text-xs">
                  <h5 className="font-bold text-white line-clamp-2">{course.title}</h5>
                  <p className="text-slate-400 text-[11px] mt-0.5">{course.validityMonths} Months Access • All Notes Included</p>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="pt-4 pb-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Have a Discount Coupon?</span>
                  <span className="text-[10px] text-amber-400">Try STUDY50</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}

                {/* Quick Coupon Chips */}
                {!discountApplied && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('STUDY50')}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" /> STUDY50 (-₹50)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('SELECTION10')}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" /> SELECTION10 (10% OFF)
                    </button>
                  </div>
                )}

                {discountApplied && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                    <span className="flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Coupon '{discountApplied.code}' Applied
                    </span>
                    <button
                      onClick={() => setDiscountApplied(null)}
                      className="text-slate-400 hover:text-white text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-3 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Batch Price:</span>
                  <span className="text-slate-200">₹{basePrice}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Discount:</span>
                    <span>-₹{discountApplied.amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST / Platform Fee:</span>
                  <span className="text-emerald-400 font-medium">FREE (₹0)</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Grand Total:</span>
                  <span className="text-lg text-amber-400">₹{finalAmount}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={processing}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing ₹{finalAmount} Securely...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{finalAmount} & Activate Batch</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-500">
                🔒 100% Secure Payment • Instant Course Access Guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
