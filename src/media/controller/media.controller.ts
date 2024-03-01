import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from '../media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const data = Promise.all(
      files.map(async (file) => await this.mediaService.upload(file)),
    );
    return data;
  }

  // @Get('/:name')
  // @Public()
  // async createClient(@Res() res, @Param('name') name: string) {
  //   const buffer = await this.mediaService.download(name);
  //   res.writeHead(200, { 'Content-Type': 'image/png' });
  //   res.end(buffer[0]);
  // }
}
