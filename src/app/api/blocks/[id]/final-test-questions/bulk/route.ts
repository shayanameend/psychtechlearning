import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdateFinalTestQuestionsSchema } from "~/validators/block";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decodedUser = await verifyRequest({
      request,
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
    const {
      finalTestQuestions,
      deletedFinalTestQuestions,
      newFinalTestQuestions,
    } = BulkUpdateFinalTestQuestionsSchema.parse(body);

    if (deletedFinalTestQuestions.length > 0) {
      await prisma.finalTestQuestion.deleteMany({
        where: {
          id: {
            in: deletedFinalTestQuestions,
          },
        },
      });
    }

    if (newFinalTestQuestions.length > 0) {
      await prisma.finalTestQuestion.createMany({
        data: newFinalTestQuestions.map(
          ({ question, answers, correctAnswer }) => ({
            question,
            answers,
            correctAnswer,
            blockId: id,
          }),
        ),
      });
    }

    if (finalTestQuestions.length > 0) {
      await Promise.all(
        finalTestQuestions.map(
          ({ id: questionId, question, answers, correctAnswer }) =>
            prisma.finalTestQuestion.update({
              where: {
                id: questionId,
              },
              data: {
                question,
                answers,
                correctAnswer,
              },
            }),
        ),
      );
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Final test questions updated successfully!",
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
