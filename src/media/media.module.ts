import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './controller/media.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
  imports: [FirebaseModule],
})
export class MediaModule {}
