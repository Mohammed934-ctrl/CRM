import { NextResponse } from "next/server";
import ConnectionDb from "@/lib/db";
import { Leads } from "@/models/leadschema";

export async function GET() {
  try {
    await ConnectionDb();

    const total = await Leads.countDocuments();

    const statusCounts = await Leads.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byStatus = {};
    statusCounts.forEach(({ _id, count }) => (byStatus[_id] = count));

    const currentYear = new Date().getFullYear();
    const byMonthRaw = await Leads.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const byMonth = months.map((month, i) => {
      const found = byMonthRaw.find((m) => m._id === i + 1);
      return { month, count: found ? found.count : 0 };
    });

    return NextResponse.json({
      total,
      new: byStatus["New"] || 0,
      contacted: byStatus["Contacted"] || 0,
      qualified: byStatus["Qualified"] || 0,
      converted: byStatus["Converted"] || 0,
      lost: byStatus["Lost"] || 0,
      conversionRate:
        total > 0
          ? parseFloat(((byStatus["Converted"] || 0) / total * 100).toFixed(1))
          : 0,
      byMonth,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}