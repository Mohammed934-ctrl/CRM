import { NextResponse } from "next/server";
import ConnectionDb from "@/lib/db.js";
import { Leads } from "@/models/leadschema.js";

export async function DELETE(request, { params }) {
  try {

     await ConnectionDb()
    const { id } = await params;

    const lead = await Leads.findByIdAndDelete(id);

     if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      )
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
