"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge"

const FILTERS = ["All", "New", "Qualified"];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function RecentLeads({ leads }) {
  const router = useRouter();
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="bg-card border border-border shadow-sm  rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-5 py-3.5 border-b border-border">
        <h2 className="text-sm font-semibold flex-1 min-w-max"> Recent Leads</h2>
        <div className="flex items-center gap-2 ">
          {FILTERS.map((fl) => (
            <button
              key={fl}
              onClick={() => setFilter(fl)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                filter === fl
                  ? "bg-accent border-border text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {fl}
            </button>
          ))}
        </div>

        <Link
          href="/leads"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No leads found
          </div>
        ) : (
          filtered.map((data) => (
            <div
              key={data._id}
              onClick={() => router.push(`/leads/${data._id}`)}
              className="px-4 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                    {initials(data.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{data.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{data.email}</p>
                  </div>
                </div>
                <StatusBadge status={data.status} />
              </div>
              <div className="mt-1.5 ml-9.5 text-xs text-muted-foreground truncate">
                {data.company}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="text-sm w-full">
          <thead>
            <tr className="border-b border-border bg-muted/45">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-[25%]">
                Name
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-[25%]">
                Email
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-[18%]">
                Company
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-[15%]">
                Status
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-[12%]">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No leads found
                </td>
              </tr>
            ) : (
             filtered.map((data) => (
                <tr
                  key={data._id}
                  onClick={() => router.push(`/leads/${data._id}`)}
                  className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                        {initials(data.name)}
                      </div>
                      <span className="font-medium text-foreground truncate">
                        {data.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground truncate">
                    {data.email}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground truncate">
                    {data.company}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={data.status} />
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">
                    {new Date(data.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
