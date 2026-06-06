import { NextResponse } from "next/server";
import ConnectionDb from "@/lib/db.js";
import { Leads } from "@/models/leadschema.js";

export async function POST(request) {
  try {
    await ConnectionDb();
    const body = await request.json();
    const { name, email, PhoneNumber, company, notes, source } = body;
    if (!name || !email || !PhoneNumber || !company) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    const existingleads = await Leads.findOne({ email });
    if (existingleads) {
      return NextResponse.json(
        { success: false, error: "A lead with this email already exists" },
        { status: 409 },
      );
    }

    const lead = await Leads.create({
      name,
      email,
      PhoneNumber,
      company,
      notes: notes || "",
      source: source || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "leads created successfully",
        lead,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A lead with this email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create lead",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request) {
  try {
    await ConnectionDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sort = searchParams.get("sort") || "newest";

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };

    const query = {};
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },

        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await Leads.countDocuments(query);
    const leads = await Leads.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return NextResponse.json(
      {
        success: true,
        leads,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leads",
      },
      {
        status: 500,
      },
    );
  }
}
