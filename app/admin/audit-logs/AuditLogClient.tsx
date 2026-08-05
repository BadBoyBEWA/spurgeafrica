"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Filter,
  History,
  Search,
  User,
  ShieldCheck,
  Calendar,
  ExternalLink
} from "lucide-react";

interface AuditLogItem {
  id: string;
  adminEmail: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  createdAt: Date | string;
}

export function AuditLogClient({ logs }: { logs: AuditLogItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");

  // Extract unique entity types & actions for dropdown filters
  const entityTypes = Array.from(new Set(logs.map((l) => l.entityType))).filter(Boolean);
  const actions = Array.from(new Set(logs.map((l) => l.action))).filter(Boolean);

  const filteredLogs = logs.filter((log) => {
    const matchesEntity = selectedEntityType === "all" || log.entityType === selectedEntityType;
    const matchesAction = selectedAction === "all" || log.action === selectedAction;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (log.adminEmail && log.adminEmail.toLowerCase().includes(term)) ||
      log.action.toLowerCase().includes(term) ||
      log.entityType.toLowerCase().includes(term) ||
      log.entityId.toLowerCase().includes(term) ||
      (log.details && log.details.toLowerCase().includes(term));

    return matchesEntity && matchesAction && matchesSearch;
  });

  const getActionBadge = (action: string) => {
    if (action.startsWith("TAILORING")) {
      return "bg-gold/10 text-gold border-gold/30";
    }
    if (action.startsWith("ORDER")) {
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
    if (action.startsWith("PRODUCT")) {
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    }
    if (action.startsWith("MESSAGE")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  const getEntityLink = (entityType: string, entityId: string) => {
    if (entityType === "TailoringEnquiry") return `/admin/tailoring/${entityId}`;
    if (entityType === "Order") return `/admin/orders/${entityId}`;
    if (entityType === "Product") return `/admin/products`;
    if (entityType === "ContactMessage") return `/admin/messages`;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-gold" />
          <h1 className="font-display text-3xl font-bold text-cream">Admin Audit Logs</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Track and audit administrative activities, custom tailoring processing, order status changes, and record updates.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border border-white/10 bg-zinc-950/70 p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search email, action, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder-zinc-500 focus:border-gold focus:outline-none"
          />
        </div>

        {/* Filter by Entity */}
        <div>
          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-900/80 py-2 px-3 text-sm text-cream focus:border-gold focus:outline-none cursor-pointer"
          >
            <option value="all">All Entity Types</option>
            {entityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Action */}
        <div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-900/80 py-2 px-3 text-sm text-cream focus:border-gold focus:outline-none cursor-pointer"
          >
            <option value="all">All Actions</option>
            {actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-950">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Timestamp</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Admin User</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Action</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Target Entity</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Details / Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredLogs.map((log) => {
                const link = getEntityLink(log.entityType, log.entityId);
                return (
                  <tr key={log.id} className="transition hover:bg-zinc-900/60">
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        {new Date(log.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex items-center gap-1.5 text-cream font-medium">
                        <User className="h-3.5 w-3.5 text-gold" />
                        {log.adminEmail || "System"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                      {link ? (
                        <Link href={link} className="inline-flex items-center gap-1 text-gold hover:underline">
                          <span className="font-mono text-xs">{log.entityType}</span>
                          <span className="text-zinc-500">#{log.entityId.slice(-6)}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-zinc-400">
                          {log.entityType} #{log.entityId.slice(-6)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300 max-w-md">
                      <div className="truncate" title={log.details || ""}>
                        {log.details || "—"}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <History className="mx-auto h-8 w-8 text-zinc-700 mb-2" />
                    <p className="text-sm font-medium text-zinc-400">No audit logs found.</p>
                    <p className="text-xs text-zinc-600 mt-1">Actions performed in the admin panel will be logged here.</p>
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
