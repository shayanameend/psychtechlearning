import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdateWeeksSchema } from "~/validators/block";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decodedUser = await verifyRequest({
      request,
      role: "ADMIN",
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const { id } = await params;

    if (!id) {
      throw new BadResponse("ID is required!");
    }

    const body = await request.json();
    const { weeks, deletedWeeks, newWeeks } = BulkUpdateWeeksSchema.parse(body);

    if (deletedWeeks.length > 0) {
      await prisma.week.deleteMany({
        where: {
          id: {
            in: deletedWeeks,
          },
        },
      });
    }

    if (newWeeks.length > 0) {
      await prisma.week.createMany({
        data: newWeeks.map(({ weekNumber, title }) => ({
          blockId: id,
          weekNumber,
          title,
        })),
      });
    }

    if (weeks.length > 0) {
      await Promise.all(
        weeks.map(({ id: weekId, weekNumber, title }) =>
          prisma.week.update({
            where: {
              id: weekId,
            },
            data: {
              weekNumber,
              title,
            },
          }),
        ),
      );
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Weeks updated successfully!",
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}
