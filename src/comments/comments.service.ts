import { Injectable, NotFoundException } from '@nestjs/common'; 
import { CreateCommentDto } from './comments.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // নতুন কমেন্ট বা রিপ্লাই ক্রিয়েট করা
  async create(userId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        text: dto.text,
        discussionId: dto.discussionId,
        userId: userId,
        parentId: dto.parentId || null, 
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, role: true, photo: true }
        }
      }
    });
  }

  // একটি ডিসকাশনের সব কমেন্ট ও নেস্টেড রিপ্লাই তুলে আনা
  async findAllByDiscussion(discussionId: string) {
    return this.prisma.comment.findMany({
      where: {
        discussionId: discussionId,
        parentId: null, // শুধুমাত্র রুট/মেইন কমেন্টগুলো প্রথমে নিবে
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, role: true, photo: true }
        },
        _count: {
          select: { likes: true } // লাইক সংখ্যা কাউন্ট করবে
        },
        replies: { // মেইন কমেন্টের ভেতরের রিপ্লাইগুলো ইনক্লুড করবে
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, role: true, photo: true }
            },
            _count: {
              select: { likes: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' } // নতুন কমেন্ট সবার উপরে দেখাবে
    });
  }

  // লাইক এবং আনলাইক টগল ফাংশনালিটি
  async toggleLike(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    // আগে লাইক দেওয়া আছে কিনা চেক করা
    const existingLike = await this.prisma.commentLike.findUnique({
      where: {
        userId_commentId: { userId, commentId }
      }
    });

    if (existingLike) {
      // লাইক দেওয়া থাকলে আনলাইক (Delete) করে দিবে
      await this.prisma.commentLike.delete({ where: { id: existingLike.id } });
      return { liked: false };
    } else {
      // লাইক না দেওয়া থাকলে নতুন লাইক (Create) করবে
      await this.prisma.commentLike.create({ data: { userId, commentId } });
      return { liked: true };
    }
  }

  // কমেন্ট ডিলিট করা
  async delete(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}