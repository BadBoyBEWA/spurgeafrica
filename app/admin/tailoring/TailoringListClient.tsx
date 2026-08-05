"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, Search, Eye, Filter, Calendar, User, Tag } from "lucide-react";
import { updateTailoringStatus } from "../actions";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  outfitType: string | null;
  styleReference: string | null;
  fabric: string | null;
  fit: string | null;
  status: string;
  priceQuote: number | null;
  createdAt: Date | string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Enquiries" },
  { value: "pending", label: "Pending", color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" },
  { value: "in_review", label: "Under Review", color: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  { value: "quoted", label: "Quoted", color: "bg-purple-400/10 text-purple-400 border-purple-400/20" },
  { value: "in_production", label: "In Production", color: "bg-indigo-400/10 text-indigo-400 border-indigo-400/20" },
  { value: "completed", label: "Completed", color: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-400/10 text-red-400 border-red-400/20" },
];

export function TailoringListClient({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    setIsUpdating(enquiryId);
    try {
      await updateTailoringStatus(enquiryId, newStatus);
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesStatus = filterStatus === "all" || enq.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      enq.name.toLowerCase().includes(searchLower) ||
      enq.email.toLowerCase().includes(searchLower) ||
      (enq.outfitType && enq.outfitType.toLowerCase().includes(searchLower)) ||
      (enq.fabric && enq.fabric.toLowerCase().includes(searchLower)) ||
      (enq.styleReference && enq.styleReference.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-gold" />
            <h1 className="font-display text-3xl font-bold text-cream">Custom Tailoring Enquiries</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Review bespoke order requests, customer body measurements, fabric preferences, and process orders.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-lg border border-white/10 bg-zinc-950/70 p-4">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => {
            const isActive = filterStatus === status.value;
            const count = status.value === "all"
              ? enquiries.length
              : enquiries.filter(e => e.status === status.value).length;

            return (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {status.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-gold/20 text-gold" : "bg-zinc-800 text-zinc-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search customer, outfit, fabric..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder-zinc-500 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-950">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Outfit & Fabric</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Fit</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Quote</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredEnquiries.map((enq) => {
                const statusMeta = STATUS_OPTIONS.find(s => s.value === enq.status) || {
                  label: enq.status,
                  color: "bg-zinc-800 text-zinc-300 border-zinc-700"
                };

                return (
                  <tr key={enq.id} className="transition hover:bg-zinc-900/60">
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        {new Date(enq.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="font-semibold text-cream">{enq.name}</div>
                      <div className="text-xs text-zinc-400">{enq.email}</div>
                      <div className="text-xs text-zinc-500">{enq.phone}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="font-medium text-gold">{enq.outfitType || enq.styleReference || "Custom Outfit"}</div>
                      <div className="text-xs text-zinc-400">Fabric: {enq.fabric || "Not specified"}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300 capitalize">
                      {enq.fit || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-cream">
                      {enq.priceQuote ? `$${enq.priceQuote.toFixed(2)}` : <span className="text-xs text-zinc-500 italic">Unquoted</span>}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <select
                        disabled={isUpdating === enq.id}
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${statusMeta.color}`}
                      >
                        <option value="pending" className="bg-zinc-900 text-cream">Pending</option>
                        <option value="in_review" className="bg-zinc-900 text-cream">Under Review</option>
                        <option value="quoted" className="bg-zinc-900 text-cream">Quoted</option>
                        <option value="in_production" className="bg-zinc-900 text-cream">In Production</option>
                        <option value="completed" className="bg-zinc-900 text-cream">Completed</option>
                        <option value="cancelled" className="bg-zinc-900 text-cream">Cancelled</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/tailoring/${enq.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-cream hover:border-gold hover:text-gold transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View & Process
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredEnquiries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    <Scissors className="mx-auto h-8 w-8 text-zinc-700 mb-2" />
                    <p className="text-sm font-medium text-zinc-400">No tailoring enquiries found.</p>
                    <p className="text-xs text-zinc-600 mt-1">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
