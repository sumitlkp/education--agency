import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShoppingBag, CheckCircle2, Clock, Download, ArrowRight } from 'lucide-react';

interface OrdersPageProps {
  navigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ navigate }) => {
  const { orders, courses } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
            <ShoppingBag className="w-4 h-4" />
            Billing & Invoices
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Purchase History & Invoices
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            All your StudyWay India course enrollments and payment transaction receipts.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 max-w-lg mx-auto">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No transactions found</h3>
          <p className="text-xs text-slate-400 mb-6">When you enroll in a batch, your invoice will appear here.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
          >
            Explore Batches
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Course Batch</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((order) => {
                  const course = courses.find((c) => c.id === order.courseId);
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-medium text-amber-400">{order.id}</td>
                      <td className="p-4 font-semibold text-white max-w-xs truncate">
                        {course?.title || order.courseId}
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4 uppercase font-mono text-[11px]">
                        {order.paymentMethod || 'UPI'}
                      </td>
                      <td className="p-4 font-bold text-white text-sm">₹{order.amount}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => window.print()}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 inline-flex items-center gap-1 text-[11px]"
                        >
                          <Download className="w-3 h-3" /> PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
