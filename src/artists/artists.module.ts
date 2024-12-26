import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],

  controllers: [ArtistsController],
  providers: [ArtistsService]
})
export class ArtistsModule { }
