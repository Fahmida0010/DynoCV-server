import { Controller, Post, Body, Param, Delete, UseGuards, Req, Get } from '@nestjs/common';
import { CreateCommentDto } from './comments.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // ১. নতুন কমেন্ট বা রিপ্লাই তৈরি করা
  @Post()
  async createComment(@Req() req: any, @Body() dto: CreateCommentDto) {
    // এখানে আপনার Auth Guard থেকে ইউজার আইডি আসবে (আপাতত মক হিসেবে req.user.id ধরা হয়েছে)
    const userId = req.user?.id || "mock-user-id"; 
    return this.commentsService.create(userId, dto);
  }

  // ২. কোনো নির্দিষ্ট ডিসকাশনের সব কমেন্ট (রিপ্লাই ও লাইক কাউন্টসহ) গেট করা
  @Get('discussion/:discussionId')
  async getCommentsByDiscussion(@Param('discussionId') discussionId: string) {
    return this.commentsService.findAllByDiscussion(discussionId);
  }

  // ৩. কমেন্টে লাইক দেওয়া বা লাইক রিমুভ করা (Toggle Like)
  @Post(':id/like')
  async toggleLikeComment(@Param('id') commentId: string, @Req() req: any) {
    const userId = req.user?.id || "mock-user-id";
    return this.commentsService.toggleLike(userId, commentId);
  }

  // ৪. কমেন্ট ডিলিট করা
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}