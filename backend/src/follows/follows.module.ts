import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsController, UserFollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { Follow, FollowSchema } from './schemas/follow.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }])],
  controllers: [FollowsController, UserFollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
