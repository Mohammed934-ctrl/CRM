"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import DeleteLeadButton from "@/components/Deletebuttonlead";

const FILTERS = ["All", "New", "Contacted", "Qualified", "Converted", "Lost"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name A-Z", value: "name_asc" },
  { label: "Name Z-A", value: "name_desc" },
];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AllLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sort,
        ...(search ? { search } : {}),
        ...(status !== "All" ? { status } : {}),
      });
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sort]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-xl font-semibold">All Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination ? `${pagination.total} total leads` : "Loading..."}
          </p>
        </div>
        <Link href="/leads/add" className="self-start sm:self-auto">
          <Button>
            <Plus className="size-4 mr-1.5" />
            Add Lead
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-md px-3 py-1.5 flex-1">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="text-xs">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap px-4 sm:px-5 py-2.5 border-b border-border">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                status === f
                  ? "bg-accent border-border text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Mobile card list (hidden on sm+) ── */}
        <div className="sm:hidden divide-y divide-border">
          {loading ? (
            <div className="px-4 py-16 text-center text-sm text-muted-foreground">
              Loading leads…
            </div>
          ) : leads.length === 0 ? (
            <div className="px-4 py-16 text-center text-sm text-muted-foreground">
              No leads found
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead._id}
                onClick={() => router.push(`/leads/${lead._id}`)}
                className="px-4 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                      {initials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="mt-2 ml-10.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                    <p className="text-xs text-muted-foreground font-mono">{lead.PhoneNumber}</p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-border hover:bg-accent transition-colors"
                      onClick={() => router.push(`/leads/${lead._id}/edit`)}
                    >
                      <Pencil className="size-3" />
                      Edit
                    </button>
                    <DeleteLeadButton
                      id={lead._id}
                      name={lead.name}
                      onSuccess={fetchLeads}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Desktop table (hidden on mobile) ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[20%]">
                  Name
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[20%]">
                  Email
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[15%]">
                  Company
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[14%]">
                  Phone
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[12%]">
                  Status
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[11%]">
                  Created
                </th>
                <th className="w-[8%]"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-sm text-muted-foreground"
                  >
                    Loading leads…
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-sm text-muted-foreground"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    onClick={() => router.push(`/leads/${lead._id}`)}
                    className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                          {initials(lead.name)}
                        </div>
                        <span className="font-medium text-foreground truncate">
                          {lead.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground truncate max-w-[160px]">
                      {lead.email}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground truncate">
                      {lead.company}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">
                      {lead.PhoneNumber}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div
                        className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-accent transition-colors"
                          onClick={() => router.push(`/leads/${lead._id}/edit`)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </button>

                        <DeleteLeadButton
                          id={lead._id}
                          name={lead.name}
                          onSuccess={fetchLeads}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-5 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} leads
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => setPage((p) => p - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from(
                { length: Math.min(pagination.totalPages, 5) },
                (_, i) => i + 1,
              ).map((p) => (
                <Button
                  key={p}
                  size="icon"
                  variant={p === pagination.page ? "default" : "outline"}
                  className="h-7 w-7 text-xs"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => setPage((p) => p + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
