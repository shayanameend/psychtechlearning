import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { BulkUpdateSampleTestQuestionsSchema } from "~/validators/block";

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
      sampleTestQuestions,
      deletedSampleTestQuestions,
      newSampleTestQuestions,
    } = BulkUpdateSampleTestQuestionsSchema.parse(body);

    if (deletedSampleTestQuestions.length > 0) {
      await prisma.sampleTestQuestion.deleteMany({
        where: {
          id: {
            in: deletedSampleTestQuestions,
          },
        },
      });
    }

    if (newSampleTestQuestions.length > 0) {
      await prisma.sampleTestQuestion.createMany({
        data: newSampleTestQuestions.map(
          ({ question, answers, correctAnswer }) => ({
            question,
            answers,
            correctAnswer,
            blockId: id,
          }),
        ),
      });
    }

    if (sampleTestQuestions.length > 0) {
      await Promise.all(
        sampleTestQuestions.map(
          ({ id: questionId, question, answers, correctAnswer }) =>
            prisma.sampleTestQuestion.update({
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
          message: "Sample test questions updated successfully!",
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
