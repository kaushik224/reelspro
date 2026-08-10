import { Controller, Get, UseGuards } from '@nestjs/common';
import { ImagekitService } from './imagekit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/auth/imagekit-auth')
export class ImagekitController {
  constructor(private imagekitService: ImagekitService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUploadAuth() {
    try {
      const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
      const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

      if (!privateKey || !publicKey) {
        return {
          error: 'ImageKit credentials not configured',
          details: {
            hasPrivateKey: !!privateKey,
            hasPublicKey: !!publicKey,
          },
        };
      }

      return this.imagekitService.getUploadAuthParams();
    } catch (error) {
      return {
        error: 'Authentication for imagekit failed',
        details: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
