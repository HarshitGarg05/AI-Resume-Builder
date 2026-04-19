import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Resume from "@/models/Resume";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resumes = await Resume.find({ userEmail: session.user.email }).sort({ updatedAt: -1 });
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("GET /api/resumes error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, resumeData, id } = await req.json();

    await dbConnect();

    if (id) {
      // Update existing
      const updated = await Resume.findOneAndUpdate(
        { _id: id, userEmail: session.user.email },
        { title, resumeData },
        { new: true }
      );
      if (!updated) {
           return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
      }
      return NextResponse.json(updated);
    } else {
      // Create new
      const created = await Resume.create({
        userEmail: session.user.email,
        title: title || "Untitled Resume",
        resumeData,
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("POST /api/resumes error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
