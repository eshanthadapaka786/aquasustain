import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { SupportTicket } from '@aquasustain/shared';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  ShieldCheck,
  User,
  X,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const FarmerSupport: React.FC = () => {
  const { supportTickets, farms, activeFarm, showToast, t } = useApp();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(supportTickets[0] || null);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New Ticket State
  const [ticketForm, setTicketForm] = useState({
    farmName: activeFarm?.name || (farms[0]?.name ?? 'Godavari Delta Aqua Greens'),
    subject: '',
    category: 'Water Quality Issue' as SupportTicket['category'],
    priority: 'High' as SupportTicket['priority'],
    description: '',
  });

  const categories: SupportTicket['category'][] = [
    'Water Quality Issue',
    'Feed & FCR Advice',
    'Disease & Abnormal Mortality',
    'Platform / Technical Issue',
    'Extension Officer Request',
  ];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    dataService.addTicketResponse(selectedTicket.id, replyMessage, 'Farmer');
    setReplyMessage('');
    // Refresh selected ticket
    const updated = dataService.getSupportTickets().find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
    showToast('Reply dispatched to fisheries officer', 'success');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      showToast('Please provide a subject and description', 'error');
      return;
    }

    try {
      const created = dataService.createSupportTicket(ticketForm);
      setSelectedTicket(created);
      setShowNewModal(false);
      showToast('Support ticket logged with Extension Officer', 'success');
      setTicketForm({
        farmName: activeFarm?.name || (farms[0]?.name ?? ''),
        subject: '',
        category: 'Water Quality Issue',
        priority: 'High',
        description: '',
      });
    } catch (err) {
      showToast('Failed to create ticket', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('supportTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with CIBA scientists, district fisheries extension officers, and technical advisors.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newTicket')}</span>
        </button>
      </div>

      {/* Ticket List and Chat Thread Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tickets List */}
        <div className="aqua-card p-4 space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-ocean-900 uppercase tracking-wider">
              {t('openTickets')}
            </span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {supportTickets.length} Total
            </span>
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto">
            {supportTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              let badge = 'bg-blue-100 text-blue-800';
              if (ticket.status === 'In Progress') badge = 'bg-amber-100 text-amber-800';
              if (ticket.status === 'Resolved') badge = 'bg-emerald-100 text-emerald-800';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-left space-y-1.5 ${
                    isSelected
                      ? 'bg-ocean-50/60 border-ocean-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {ticket.category}
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${badge}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-ocean-900 line-clamp-1">
                    {ticket.subject}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>{ticket.responses.length} messages</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (2 Cols): Active Discussion Thread */}
        <div className="lg:col-span-2 aqua-card p-5 flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <div className="flex flex-col h-full justify-between space-y-4">
              {/* Ticket Meta Header */}
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ocean-600 uppercase tracking-wide">
                    {selectedTicket.category} • Priority: {selectedTicket.priority}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                    Status: {selectedTicket.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ocean-900 font-heading mt-1">
                  {selectedTicket.subject}
                </h3>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Reported for {selectedTicket.farmName} by {selectedTicket.farmerName} ({selectedTicket.farmerPhone})
                </span>
              </div>

              {/* Message History */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] p-2">
                {selectedTicket.responses.map((resp) => {
                  const isOfficer = resp.senderRole !== 'Farmer';

                  return (
                    <div
                      key={resp.id}
                      className={`flex flex-col ${isOfficer ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                          isOfficer
                            ? 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200'
                            : 'bg-gradient-to-r from-ocean-700 to-ocean-800 text-white rounded-tr-xs'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-[11px]">
                          {isOfficer ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-mint" />
                          )}
                          <span>{resp.senderName}</span>
                          <span className={`text-[10px] font-normal ${isOfficer ? 'text-slate-500' : 'text-ocean-200'}`}>
                            • {resp.senderRole}
                          </span>
                        </div>
                        <p className="leading-relaxed">{resp.message}</p>
                        <span
                          className={`text-[9px] block text-right ${
                            isOfficer ? 'text-slate-400' : 'text-ocean-200'
                          }`}
                        >
                          {new Date(resp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type an update or question for the technical officer..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ocean-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-ocean-600"
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2.5 bg-ocean-700 hover:bg-ocean-800 text-white rounded-xl font-bold text-xs transition disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs font-semibold">Select a ticket from the left to view the thread</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">{t('newTicket')}</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Issue Category *</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. Ammonia spike in Pond 2 despite zeolite application"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Describe pond DOC, recent feeding observations, water test values..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ocean-700 hover:bg-ocean-800 text-white rounded-xl font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
