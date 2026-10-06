import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Calendar, Plus, 
  Search, Filter, Printer, Download, CheckCircle2, 
  Clock, AlertCircle, RefreshCw, ArrowUpRight, 
  Receipt, ShoppingBag, UserCheck, ShieldCheck, X
} from 'lucide-react';
import { api } from '../../services/api';
import { SaleRecord, SalesSummary } from '../../types';

interface AdminSalesManagerProps {
  onNotification: (msg: string) => void;
}

export const AdminSalesManager: React.FC<AdminSalesManagerProps> = ({ onNotification }) => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>('all');

  // New Sale Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [saleForm, setSaleForm] = useState({
    type: 'consultation' as 'consultation' | 'xray' | 'physiotherapy' | 'other',
    patient_name: '',
    patient_phone: '',
    amount: '',
    payment_mode: 'Cash' as 'Cash' | 'UPI' | 'Card' | 'Online',
    payment_status: 'Paid' as 'Paid' | 'Pending',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<SaleRecord | null>(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const salesRes = await api.getAdminSales();
      if (salesRes.success && salesRes.data) {
        setSales(salesRes.data.sales);
        setSummary(salesRes.data.summary);
      }
    } catch (err) {
      console.error('Failed to load sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(saleForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('कृपया मान्य राशि दर्ज करें।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.addSale({
        type: saleForm.type,
        patient_name: saleForm.patient_name.trim() || 'Walk-in Customer',
        patient_phone: saleForm.patient_phone.trim(),
        amount: amountNum,
        payment_mode: saleForm.payment_mode,
        payment_status: saleForm.payment_status,
        notes: saleForm.notes.trim()
      });

      if (res.success && res.data) {
        onNotification(`बिक्री ₹${amountNum} सफलतापूर्वक दर्ज कर ली गई।`);
        setShowAddModal(false);
        setSaleForm({
          type: 'consultation',
          patient_name: '',
          patient_phone: '',
          amount: '',
          payment_mode: 'Cash',
          payment_status: 'Paid',
          notes: ''
        });
        fetchSalesData();
      } else {
        alert(res.error || 'बिक्री दर्ज करने में समस्या आई।');
      }
    } catch (err) {
      console.error(err);
      alert('बिक्री सेव नहीं हो सकी।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSales = sales.filter((s) => {
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    const matchesPayment = paymentModeFilter === 'all' || s.payment_mode === paymentModeFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      (s.patient_name && s.patient_name.toLowerCase().includes(q)) ||
      (s.patient_phone && s.patient_phone.includes(q)) ||
      (s.notes && s.notes.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q));
    return matchesType && matchesPayment && matchesSearch;
  });

  const totalCalculatedRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  const printReceipt = (sale: SaleRecord) => {
    const printWin = window.open('', '_blank', 'width=600,height=700');
    if (!printWin) return;
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Maa Janki Clinic - Payment Receipt</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; color: #1e293b; font-size: 13px; margin: 0; }
            .header { text-align: center; border-bottom: 2px dashed #94a3b8; padding-bottom: 12px; margin-bottom: 12px; }
            .clinic-name { font-size: 18px; font-weight: 800; color: #0f766e; }
            .receipt-title { font-size: 14px; font-weight: 700; margin: 4px 0; }
            .row { display: flex; justify-content: space-between; padding: 4px 0; }
            .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; padding: 8px 0; margin-top: 10px; }
            .footer { text-align: center; font-size: 11px; color: #64748b; margin-top: 20px; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">मां जानकी एक्स-रे एवं हड्डी रोग क्लिनिक</div>
            <div style="font-size: 11px; color: #475569;">पूजहां पटजिरवा चौक, बेतिया | Mob: 9525719654</div>
            <div class="receipt-title">भुगतान रसीद / Cash Receipt</div>
            <div style="font-size: 11px; color: #64748b;">Receipt ID: ${sale.id} | ${new Date(sale.created_at).toLocaleString('hi-IN')}</div>
          </div>
          <div class="row"><span>मरीज / ग्राहक:</span><strong>${sale.patient_name || 'Walk-in'}</strong></div>
          ${sale.patient_phone ? `<div class="row"><span>मोबाइल:</span><span>${sale.patient_phone}</span></div>` : ''}
          <div class="row"><span>सेवा का प्रकार:</span><span style="text-transform: capitalize;">${sale.type}</span></div>
          <div class="row"><span>भुगतान माध्यम:</span><span>${sale.payment_mode} (${sale.payment_status})</span></div>
          ${sale.notes ? `<div class="row"><span>विवरण:</span><span>${sale.notes}</span></div>` : ''}
          <div class="total-row">
            <span>कुल राशि (Total Paid):</span>
            <span style="color: #0f766e;">₹${sale.amount}</span>
          </div>
          <div class="footer">
            <div>त्वरित एवं सुरक्षित सेवा हेतु धन्यवाद। स्वस्थ रहें, सुरक्षित रहें।</div>
            <div style="margin-top: 4px; font-weight: bold;">Authorized Signatory - Maa Janki Clinic</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
  };

  return (
    <div className="space-y-6">
      {/* Top Total Sell Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sell Card */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-teal-700 to-teal-900 text-white p-5 rounded-2xl shadow-md space-y-1">
          <div className="flex items-center justify-between text-teal-200">
            <span className="text-xs font-bold uppercase tracking-wider">कुल बिक्री (Total Revenue)</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ₹{summary?.totalRevenue || totalCalculatedRevenue}
          </div>
          <div className="text-[11px] text-teal-100 flex items-center gap-1 pt-1">
            <span>कुल {sales.length} सफल बिलिंग</span>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">आज की बिक्री (Today)</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-800">
            ₹{summary?.todayRevenue || 0}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">आज का दैनिक कलेक्शन</div>
        </div>

        {/* Monthly Sales */}
        <div className="bg-white p-5 rounded-2xl border border-cyan-200 bg-cyan-50/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-cyan-700">
            <span className="text-xs font-bold uppercase tracking-wider">इस माह (This Month)</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-cyan-800">
            ₹{summary?.thisMonthRevenue || totalCalculatedRevenue}
          </div>
          <div className="text-[11px] text-cyan-600 font-medium">चालू माह का राजस्व</div>
        </div>

        {/* Consultation Fee Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-200 bg-indigo-50/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-bold uppercase tracking-wider">OPD परामर्श शुल्क</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-indigo-800">
            ₹{summary?.consultationRevenue || sales.filter(s => s.type === 'consultation').reduce((sum, s) => sum + s.amount, 0)}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium">₹100 प्रति मरीज परामर्श</div>
        </div>

        {/* Medicine Sales */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">दवा व फार्मेसी बिक्री</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-800">
            ₹{summary?.medicineRevenue || sales.filter(s => s.type === 'medicine').reduce((sum, s) => sum + s.amount, 0)}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">दवाइयां व ऑर्थो बेल्ट</div>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="मरीज का नाम, मोबाइल या ID खोजें..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">सभी प्रकार (All Types)</option>
            <option value="consultation">OPD Consultation (परामर्श)</option>
            <option value="medicine">Medicine (दवाइयां)</option>
            <option value="xray">X-Ray (एक्स-रे)</option>
            <option value="physiotherapy">Physiotherapy (थेरेपी)</option>
          </select>

          {/* Payment Mode Filter */}
          <select
            value={paymentModeFilter}
            onChange={(e) => setPaymentModeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">सभी भुगतान (All Modes)</option>
            <option value="Cash">नकद (Cash)</option>
            <option value="UPI">UPI (PhonePe / GPay)</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={fetchSalesData}
            title="रिफ्रेश करें"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नई बिक्री / बिल दर्ज करें</span>
          </button>
        </div>
      </div>

      {/* Sales Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-700" />
            <span>बिक्री बहीखाता (Sales Ledger) — {filteredSales.length} रिकॉर्ड</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            चयनित कुल राशि: <strong className="text-teal-700 font-black">₹{filteredSales.reduce((sum, s) => sum + s.amount, 0)}</strong>
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">बिक्री डेटा लोड हो रहा है...</div>
        ) : filteredSales.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">कोई बिक्री रिकॉर्ड नहीं मिला।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">तारीख व समय</th>
                  <th className="py-3 px-4">रसीद ID</th>
                  <th className="py-3 px-4">मरीज / ग्राहक</th>
                  <th className="py-3 px-4">प्रकार (Type)</th>
                  <th className="py-3 px-4">विवरण</th>
                  <th className="py-3 px-4">माध्यम</th>
                  <th className="py-3 px-4 text-right">राशि (Amount)</th>
                  <th className="py-3 px-4 text-center">रसीद</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      <div>{new Date(sale.created_at).toLocaleDateString('hi-IN')}</div>
                      <div className="text-[10px] text-slate-400">{new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-teal-700">
                      {sale.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sale.patient_name || 'Walk-in'}</div>
                      {sale.patient_phone && (
                        <div className="text-[10px] text-slate-500">{sale.patient_phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sale.type === 'consultation' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                          : sale.type === 'medicine'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {sale.type === 'consultation' ? 'OPD Fee' : sale.type === 'medicine' ? 'Medicine' : sale.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {sale.notes || (sale.items && sale.items.map(i => `${i.name} (${i.quantity})`).join(', ')) || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {sale.payment_mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-black text-slate-900 text-sm">₹{sale.amount}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => printReceipt(sale)}
                        title="रसीद प्रिंट करें"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Sale Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-300" />
                <h3 className="font-bold text-base">नई बिक्री / बिल दर्ज करें (New Sale Entry)</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Sale Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">बिक्री का प्रकार *</label>
                  <select
                    value={saleForm.type}
                    onChange={(e) => setSaleForm({ ...saleForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="consultation">OPD परामर्श शुल्क (₹100)</option>
                    <option value="xray">एक्स-रे जांच (X-Ray)</option>
                    <option value="physiotherapy">फिजियोथेरेपी (Therapy)</option>
                    <option value="other">अन्य सेवा (Other)</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">कुल राशि (Amount in ₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={saleForm.amount}
                    onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                    placeholder="e.g. 100, 350"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Patient Name & Mobile */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">मरीज का नाम</label>
                  <input
                    type="text"
                    value={saleForm.patient_name}
                    onChange={(e) => setSaleForm({ ...saleForm, patient_name: e.target.value })}
                    placeholder="मरीज या ग्राहक का नाम"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">मोबाइल नंबर</label>
                  <input
                    type="tel"
                    value={saleForm.patient_phone}
                    onChange={(e) => setSaleForm({ ...saleForm, patient_phone: e.target.value })}
                    placeholder="10 अंक मोबाइल"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">भुगतान माध्यम (Mode) *</label>
                  <select
                    value={saleForm.payment_mode}
                    onChange={(e) => setSaleForm({ ...saleForm, payment_mode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Cash">नकद (Cash)</option>
                    <option value="UPI">PhonePe / GooglePay (UPI)</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Online">Online Transfer</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">स्थिति (Status)</label>
                  <select
                    value={saleForm.payment_status}
                    onChange={(e) => setSaleForm({ ...saleForm, payment_status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Paid">प्राप्त हो गया (Paid)</option>
                    <option value="Pending">बाकी (Pending)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">टिप्पणी / दवा विवरण</label>
                <input
                  type="text"
                  value={saleForm.notes}
                  onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })}
                  placeholder="e.g. Shelcal 2 strip, LS Belt 1 pc"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  {isSubmitting ? 'दर्ज हो रहा है...' : 'बिक्री सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
