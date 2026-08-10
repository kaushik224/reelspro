import { Injectable } from '@nestjs/common';
import ImageKit from '@imagekit/nodejs';

@Injectable()
export class ImagekitService {
  private imagekit: any;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    } as any);
  }

  getUploadAuthParams() {
    try {
      const authenticationParameters = this.imagekit.getAuthenticationParameters();
      return {
        token: authenticationParameters.token,
        expire: authenticationParameters.expire,
        signature: authenticationParameters.signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      };
    } catch (error) {
      throw new Error('Authentication for imagekit failed');
    }
  }
}
