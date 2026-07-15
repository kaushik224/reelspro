import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    console.log('ImageKit Auth Debug:', {
      hasPrivateKey: !!privateKey,
      hasPublicKey: !!publicKey,
      privateKeyLength: privateKey?.length,
      publicKeyLength: publicKey?.length,
    });

    if (!privateKey || !publicKey) {
      return Response.json(
        {
          error: "ImageKit credentials not configured",
          details: {
            hasPrivateKey: !!privateKey,
            hasPublicKey: !!publicKey,
          },
        },
        { status: 500 }
      );
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return Response.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error('ImageKit Auth Error:', error);
    return Response.json(
      {
        error: "Authentication for imagekit failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
