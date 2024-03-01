import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.image.service';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
