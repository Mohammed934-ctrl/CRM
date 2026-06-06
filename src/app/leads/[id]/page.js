import ConnectionDb from "@/lib/db";
import { Leads } from "@/models/leadschema";
import StatusBadge from "@/components/StatusBadge";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteLeadButton from "@/components/Deletebuttonlead";
async function getlead(id) {
  await ConnectionDb();
  try {
    const lead = await Leads.findById(id).lean();
    if (!lead) return null;
    return JSON.parse(JSON.stringify(lead));
  } catch {
    return null;
  }
}

function initials(name) {
  return name
    .split("")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function LeadDetailPage({ params }) {
  const { id } = await params;
  const lead = await getlead(id);
  if (!lead) return notFound();

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <Link
        href="/leads"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Leads
      </Link>
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary text-base font-bold flex items-center justify-center shrink-0">
            {initials(lead.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground">
              {lead.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {lead.company}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={lead.status} />
            <Link href={`/leads/${lead._id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
            </Link>
            <DeleteLeadButton id={lead._id} name={lead.name} />
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h2 className="text-sm font-semibold">Contact Information</h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex items-center gap-2 w-36 shrink-0">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </span>
            </div>
            <span className="text-sm text-foreground">{lead.email}</span>
          </div>

          <div className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex items-center gap-2 w-36 shrink-0">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Phone
              </span>
            </div>
            <span className="text-sm text-foreground font-mono">
              {lead.PhoneNumber}
            </span>
          </div>

          <div className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex items-center gap-2 w-36 shrink-0">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Company
              </span>
            </div>
            <span className="text-sm text-foreground">{lead.company}</span>
          </div>

          <div className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex items-center gap-2 w-36 shrink-0">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Source
              </span>
            </div>
            <span className="text-sm text-foreground">
              {lead.source || <span className="text-muted-foreground">—</span>}
            </span>
          </div>

          <div className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex items-center gap-2 w-36 shrink-0">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Created
              </span>
            </div>
            <span className="text-sm text-foreground">
              {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {lead.notes && (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h2 className="text-sm font-semibold">Notes</h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lead.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
