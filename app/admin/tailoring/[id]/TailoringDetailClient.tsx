"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  History,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Save,
  Scissors,
  User,
  Image as ImageIcon
} from "lucide-react";
import { updateTailoringProcessing } from "../../actions";

interface AuditEntry {
  id: string;
  adminEmail: string | null;
  action: string;
  details: string | null;
  createdAt: Date | string;
}

interface EnquiryDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  outfitType: string | null;
  styleReference: string | null;
  fabric: string | null;
  fit: string | null;
  gender: string | null;
  address: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  preferredDeliveryDate: string | null;
  measurements: string | null;
  images: string | null;
  budget: string | null;
  occasion: string | null;
  notes: string | null;
  priceQuote: number | null;
  adminNotes: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export function TailoringDetailClient({
  enquiry,
  auditLogs,
}: {
  enquiry: EnquiryDetail;
  auditLogs: AuditEntry[];
}) {
  const [status, setStatus] = useState(enquiry.status);
  const [priceQuote, setPriceQuote] = useState<string>(
    enquiry.priceQuote !== null && enquiry.priceQuote !== undefined ? String(enquiry.priceQuote) : ""
  );
  const [adminNotes, setAdminNotes] = useState(enquiry.adminNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Parse measurements JSON if valid
  let parsedMeasurements: Record<string, string> = {};
  if (enquiry.measurements) {
    try {
      parsedMeasurements = JSON.parse(enquiry.measurements);
    } catch (e) {
      console.error("Failed to parse measurements JSON", e);
    }
  }

  // Parse images JSON if valid
  let parsedImages: string[] = [];
  if (enquiry.images) {
    try {
      parsedImages = JSON.parse(enquiry.images);
    } catch (e) {
      console.error("Failed to parse images JSON", e);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const quoteVal = priceQuote.trim() !== "" ? parseFloat(priceQuote) : null;
      await updateTailoringProcessing(enquiry.id, {
        status,
        priceQuote: isNaN(quoteVal as number) ? null : quoteVal,
        adminNotes: adminNotes.trim() || null,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update enquiry.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tailoring"
            className="flex items-center justify-center rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-400 hover:border-gold hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-cream">
                Tailoring Enquiry #{enquiry.id.slice(-6)}
              </h1>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  status === "completed"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : status === "in_production"
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : status === "quoted"
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : status === "in_review"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : status === "cancelled"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}
              >
                {status.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Received on {new Date(enquiry.createdAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Specifications & Measurements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Delivery Card */}
          <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-cream flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <User className="h-5 w-5 text-gold" />
              Customer & Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500 block text-xs">Customer Name</span>
                <span className="font-semibold text-cream">{enquiry.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">Email Address</span>
                <a href={`mailto:${enquiry.email}`} className="text-gold hover:underline flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5" />
                  {enquiry.email}
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">Phone Number</span>
                <a href={`tel:${enquiry.phone}`} className="text-cream hover:text-gold flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-zinc-400" />
                  {enquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">Gender</span>
                <span className="text-cream capitalize">{enquiry.gender || "Not specified"}</span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-white/5">
                <span className="text-zinc-500 block text-xs mb-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                  Delivery Location
                </span>
                <p className="text-cream font-medium">
                  {[enquiry.address, enquiry.state, enquiry.country, enquiry.postalCode].filter(Boolean).join(", ") || "No address provided"}
                </p>
                {enquiry.preferredDeliveryDate && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Preferred Delivery Date: <span className="text-gold font-medium">{enquiry.preferredDeliveryDate}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Garment Specifications Card */}
          <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-cream flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Scissors className="h-5 w-5 text-gold" />
              Garment Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-zinc-900/60 p-3 rounded border border-white/5">
                <span className="text-zinc-500 block text-xs">Outfit Type</span>
                <span className="font-semibold text-gold text-base">
                  {enquiry.outfitType || enquiry.styleReference || "Custom"}
                </span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded border border-white/5">
                <span className="text-zinc-500 block text-xs">Fabric Choice</span>
                <span className="font-semibold text-cream text-base">{enquiry.fabric || "None"}</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded border border-white/5">
                <span className="text-zinc-500 block text-xs">Fit Preference</span>
                <span className="font-semibold text-cream text-base capitalize">{enquiry.fit || "Standard"}</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded border border-white/5">
                <span className="text-zinc-500 block text-xs">Occasion</span>
                <span className="font-semibold text-cream capitalize">{enquiry.occasion || "General"}</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded border border-white/5">
                <span className="text-zinc-500 block text-xs">Payment Choice</span>
                <span className="font-semibold text-cream">{enquiry.budget || "Not set"}</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded border border-white/5">
                <span className="text-zinc-500 block text-xs">Current Quote</span>
                <span className="font-bold text-gold text-base">
                  {enquiry.priceQuote ? `$${enquiry.priceQuote.toFixed(2)}` : "Pending Quote"}
                </span>
              </div>
            </div>

            {enquiry.notes && (
              <div className="mt-4 p-4 rounded bg-zinc-900/40 border border-white/5">
                <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">
                  Customer Special Notes
                </span>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{enquiry.notes}</p>
              </div>
            )}
          </div>

          {/* Body Measurements Card */}
          <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h2 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Ruler className="h-5 w-5 text-gold" />
                Customer Body Measurements
              </h2>
              <span className="text-xs text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-white/5">
                {Object.keys(parsedMeasurements).length} recorded fields
              </span>
            </div>

            {Object.keys(parsedMeasurements).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.entries(parsedMeasurements).map(([key, val]) => (
                  <div key={key} className="p-3 bg-zinc-900/80 rounded border border-white/5">
                    <span className="text-[11px] font-medium text-zinc-400 capitalize block truncate">
                      {key}
                    </span>
                    <span className="text-lg font-bold text-gold mt-0.5 block">
                      {val} <span className="text-xs font-normal text-zinc-500">in</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic py-4 text-center">
                No specific body measurements were provided with this enquiry.
              </p>
            )}
          </div>

          {/* Inspiration Images */}
          {parsedImages.length > 0 && (
            <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-cream flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <ImageIcon className="h-5 w-5 text-gold" />
                Inspiration Image References ({parsedImages.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {parsedImages.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="group relative aspect-square rounded-md overflow-hidden border border-white/10 cursor-pointer bg-zinc-900"
                  >
                    <img src={imgUrl} alt={`Reference ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-medium text-white">
                      Click to zoom
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Admin Processing Panel & Audit History */}
        <div className="space-y-6">
          {/* Processing Card */}
          <form onSubmit={handleSave} className="rounded-lg border border-gold/30 bg-zinc-950 p-6 shadow-lg space-y-5">
            <h2 className="text-lg font-semibold text-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <Scissors className="h-5 w-5" />
              Process Tailoring Order
            </h2>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in_review">Under Review</option>
                <option value="quoted">Quoted</option>
                <option value="in_production">In Production</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Price Quote */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Price Quote ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 350.00"
                  value={priceQuote}
                  onChange={(e) => setPriceQuote(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-zinc-900 py-2.5 pl-9 pr-3 text-sm text-cream focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Internal Admin Notes
              </label>
              <textarea
                rows={4}
                placeholder="Add private notes for tailors, progress updates, fabric status..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-zinc-900 p-3 text-sm text-cream placeholder-zinc-500 focus:border-gold focus:outline-none"
              />
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-3 rounded border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
                Successfully updated enquiry & saved to audit log.
              </div>
            )}

            {saveError && (
              <div className="text-xs font-semibold text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                {saveError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-gold py-2.5 text-sm font-semibold text-night hover:bg-[#e1b968] transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving changes..." : "Save Processing Details"}
            </button>
          </form>

          {/* Audit Log Timeline Card */}
          <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-cream flex items-center gap-2 border-b border-white/10 pb-3">
              <History className="h-5 w-5 text-gold" />
              Enquiry Audit History
            </h2>

            {auditLogs.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border-l-2 border-gold/40 pl-3 py-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="font-semibold text-cream">{log.adminEmail || "Admin"}</span>
                      <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="text-zinc-300 font-medium">{log.details || log.action}</p>
                    <p className="text-[10px] text-zinc-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">No previous audit logs recorded for this enquiry.</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-lg border border-white/20">
            <img src={selectedImage} alt="Inspiration preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
