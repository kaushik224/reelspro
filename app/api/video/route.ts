import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Videos";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videosData = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videosData || videosData.length === 0) {
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(videosData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (session) {
      return NextResponse.json(
        {
          error: "Not authorized to post video please login.",
        },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const body: IVideo = await request.json();
    if (
      !body.description ||
      !body.thumbnailUrl ||
      !body.title ||
      !body.videoUrl
    ) {
      return NextResponse.json(
        { error: "Missing required Feilds" },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: body?.transformation ?? {
        height: 1920,
        width: 1080,
        quality: 100,
      },
    };

    const newVideo = Video.create(videoData);

    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload videos" },
      { status: 500 }
    );
  }
}
