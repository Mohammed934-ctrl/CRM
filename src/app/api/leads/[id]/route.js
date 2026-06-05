import { NextResponse } from "next/server";
import ConnectionDb from "@/lib/db.js";
import { Leads } from "@/models/leadschema.js";

export async function GET(_, { params }) {
  try {
    await ConnectionDb();
    const { id } = await params;

    const lead = await Leads.findById(id);
    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(
      {
        success: true,
        lead,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get leads" },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await ConnectionDb();
    const { id } = await params;
    const body = await request.json();

    const updateData = {};
    if (body.name)        updateData.name = body.name;
    if (body.email)       updateData.email = body.email;
    if (body.PhoneNumber) updateData.PhoneNumber = body.PhoneNumber;
    if (body.company)     updateData.company = body.company;
    if (body.status)      updateData.status = body.status;
    if (body.source)      updateData.source = body.source;
    if (body.notes !== undefined) updateData.notes = body.notes;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updatedLead = await Leads.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead updated successfully",
        lead: updatedLead,
      },
      { status: 200 }
    );

  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A lead with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await ConnectionDb();
    const { id } = await params;

    const lead = await Leads.findByIdAndDelete(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deleted lead  successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "failed to delete lead",
      },
      {
        status: 500,
      },
    );
  }
}
