import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Videos";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const rawVideos = await Video.find({}).sort({ createdAt: -1 }).lean();

    // Normalize response for backward compatibility with legacy documents containing vidoeUrl
    const videosData = (rawVideos || []).map((video: Record<string, unknown>) => ({
      ...video,
      videoUrl: (video.videoUrl || video.vidoeUrl || "") as string,
    }));

    return NextResponse.json(videosData, { status: 200 });
  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Not authorized to post video please login.",
        },
        { status: 401 }
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

    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Upload video error:", error);
    return NextResponse.json(
      { error: "Failed to upload videos" },
      { status: 500 }
    );
  }
}
