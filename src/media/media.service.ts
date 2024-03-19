import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.image.service';
import { withTimestamp } from 'src/utils/withTimestamp';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class MediaService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async upload(file: any): Promise<string> {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();
    const fileName = withTimestamp(file.originalname);
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', async () => {
        //make public
        await fileUpload.makePublic();
        const signedUrl = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-01-2500',
        });

        resolve(signedUrl[0]);
      });
      stream.end(file.buffer);
    });
  }

  async download(name: string): Promise<Readable> {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket('web-enterprise-bc80b.appspot.com');
    const file = bucket.file(name);

    const downloadStream = file.createReadStream();

    return new Promise<Readable>((resolve, reject) => {
      downloadStream.on('error', (error) => {
        reject(error);
      });

      resolve(downloadStream);
    });
  }
}
