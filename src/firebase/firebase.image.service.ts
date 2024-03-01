import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require('./../../src/web-enterprise-bc80b-firebase-adminsdk-2icdc-62888e86b0.json');
    if (!getApps().length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'web-enterprise-bc80b.appspot.com',
      });
    }
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
