import ConnectionDb from "@/lib/db";
import { Leads } from "@/models/leadschema";
import Link from "next/link";
import RecentLeads from "@/components/RecentLeads";
import StatsCard from "@/components/StatusCards";
import { Plus } from "lucide-react";


async function GetStats() {
  await ConnectionDb();
  const total = await Leads.countDocuments();
  const StatsCounts = await Leads.aggregate([
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  const bystatus = {};
  StatsCounts.forEach(({ _id, count }) => (bystatus[_id] = count));
  return {
    total,
    qualified: bystatus["Qualified"] || 0,
    converted: bystatus["Converted"] || 0,
    lost: bystatus["Lost"] || 0,
  };
}
async function getRecentLeads() {
  await ConnectionDb();
  const leads = await Leads.find().sort({ createdAt: -1 }).limit(7).lean();
  return JSON.parse(JSON.stringify(leads));
}

export default async function DashboardPage() {
  const [stats, leads] = await Promise.all([GetStats(), getRecentLeads()]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, here's what's happening
          </p>
        </div>
        <Link
          href="/leads/add"
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </Link>
      </div>
      <StatsCard stats={stats} />
      <RecentLeads leads={leads} />
    </div>
  );
}
