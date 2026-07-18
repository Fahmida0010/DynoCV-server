import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assume PrismaService injected

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  // Get candidate attributes along with global library details
  async getAttributes(userId: string) {
    return this.prisma.userAttribute.findMany({
      where: { userId },
      include: { attribute: true },
    });
  }

  // Update with Optimistic Locking
  async updateAttributeValue(userId: string, data: { attributeId: string; value: string; version: number }) {
    const record = await this.prisma.userAttribute.findUnique({
      where: { userId_attributeId: { userId, attributeId: data.attributeId } }
    });

    if (!record) {
      return this.prisma.userAttribute.create({
        data: { userId, attributeId: data.attributeId, value: data.value, version: 1 }
      });
    }

    if (record.version !== data.version) {
      throw new ConflictException('Version mismatch! Another client updated this resource.');
    }

    return this.prisma.userAttribute.update({
      where: { id: record.id },
      data: {
        value: data.value,
        version: record.version + 1
      }
    });
  }

  async getProjects(userId: string) {
    return this.prisma.project.findMany({ where: { userId } });
  }

  async createProject(userId: string, dto: any) {
    return this.prisma.project.create({
      data: { ...dto, userId }
    });
  }

  async updateProject(id: string, data: any, version: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.version !== version) throw new ConflictException('Optimistic lock error.');

    return this.prisma.project.update({
      where: { id },
      data: { ...data, version: project.version + 1 }
    });
  }

  async getCvs(userId: string) {
    return this.prisma.cv.findMany({
      where: { userId, position: { isActive: true } }, // Automatic hide logic if position disabled
      include: { position: true }
    });
  }

  async generateCv(userId: string, positionId: string) {
    // 1. Fetch template criteria
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: { templates: { include: { attribute: true } } }
    });

    if (!position || !position.isActive) throw new NotFoundException('Position not accessible.');

    // 2. Fetch User Profile Data & Custom library match maps
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const filledAttributes = await this.prisma.userAttribute.findMany({ where: { userId } });

    // 3. Assemble compile snapshot
    const cvSnapshot = {
      me: profile,
      requirements: position.templates.map(t => {
        const userVal = filledAttributes.find(fa => fa.attributeId === t.attributeId);
        return {
          label: t.attribute.label,
          value: userVal ? userVal.value : 'Not provided'
        };
      })
    };

    return this.prisma.cv.upsert({
      where: { userId_positionId: { userId, positionId } },
      create: { userId, positionId, content: cvSnapshot },
      update: { content: cvSnapshot, version: { increment: 1 } }
    });
  }

  async getAvailablePositions() {
    return this.prisma.position.findMany({ where: { isActive: true } });
  }

  async getDiscussions() {
    return this.prisma.discussion.findMany({
      include: { position: true, user: { select: { email: true } } }
    });
  }
}