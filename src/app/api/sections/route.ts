import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { CreateSectionSchema, UpdateSectionSchema } from "~/validators/section";

export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const sections = await prisma.section.findMany({
      orderBy: {
        sectionOrder: "asc",
      },
      select: {
        id: true,
        sectionOrder: true,
        sectionTitle: true,
        sectionDescription: true,
        guideLabel: true,
        guideLink: true,
        flashcardsLabel: true,
        sampleTestLabel: true,
        finalTestLabel: true,
        flashcards: {
          select: {
            id: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sampleTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        finalTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sectionUserNotes: {
          where: {
            userId: decodedUser.id,
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: { sections },
        info: {
          message: "Sections Fetched Successfully!",
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

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const {
      sectionTitle,
      sectionDescription,
      guideLabel,
      guideLink,
      flashcardsLabel,
      flashcards,
      sampleTestLabel,
      sampleTestQuestions,
      finalTestLabel,
      finalTestQuestions,
    } = CreateSectionSchema.parse(body);

    const section = await prisma.section.create({
      data: {
        sectionTitle,
        sectionDescription,
        guideLabel,
        guideLink,
        flashcardsLabel,
        flashcards: {
          createMany: {
            data: flashcards,
          },
        },
        sampleTestLabel,
        sampleTestQuestions: {
          createMany: {
            data: sampleTestQuestions,
          },
        },
        finalTestLabel,
        finalTestQuestions: {
          createMany: {
            data: finalTestQuestions,
          },
        },
      },
      select: {
        id: true,
        sectionTitle: true,
        sectionDescription: true,
        guideLabel: true,
        guideLink: true,
        flashcardsLabel: true,
        sampleTestLabel: true,
        finalTestLabel: true,
        flashcards: {
          select: {
            id: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sampleTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        finalTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: { section },
        info: {
          message: "Section Created Successfully!",
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleErrors({ error });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const {
      id,
      sectionTitle,
      sectionDescription,
      guideLabel,
      guideLink,
      flashcardsLabel,
      sampleTestLabel,
      finalTestLabel,
      createFlashcards,
      createSampleTestQuestions,
      createFinalTestQuestions,
      deleteFlashcards,
      deleteSampleTestQuestions,
      deleteFinalTestQuestions,
      updateFlashcards,
      updateSampleTestQuestions,
      updateFinalTestQuestions,
    } = UpdateSectionSchema.parse(body);

    const section = await prisma.section.update({
      where: {
        id,
      },
      data: {
        sectionTitle,
        sectionDescription,
        guideLabel,
        guideLink,
        flashcardsLabel,
        flashcards: {
          createMany: {
            data: createFlashcards,
          },
          deleteMany: {
            id: {
              in: deleteFlashcards,
            },
          },
          updateMany: {
            where: {
              id: {
                in: updateFlashcards.map((flashcard) => flashcard.id),
              },
            },
            data: updateFlashcards,
          },
        },
        sampleTestLabel,
        sampleTestQuestions: {
          createMany: {
            data: createSampleTestQuestions,
          },
          deleteMany: {
            id: {
              in: deleteSampleTestQuestions,
            },
          },
          updateMany: {
            where: {
              id: {
                in: updateSampleTestQuestions.map((question) => question.id),
              },
            },
            data: updateSampleTestQuestions,
          },
        },
        finalTestLabel,
        finalTestQuestions: {
          createMany: {
            data: createFinalTestQuestions,
          },
          deleteMany: {
            id: {
              in: deleteFinalTestQuestions,
            },
          },
          updateMany: {
            where: {
              id: {
                in: updateFinalTestQuestions.map((question) => question.id),
              },
            },
            data: updateFinalTestQuestions,
          },
        },
      },
      select: {
        id: true,
        sectionTitle: true,
        sectionDescription: true,
        guideLabel: true,
        guideLink: true,
        flashcardsLabel: true,
        sampleTestLabel: true,
        finalTestLabel: true,
        flashcards: {
          select: {
            id: true,
            question: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sampleTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        finalTestQuestions: {
          select: {
            id: true,
            question: true,
            answers: true,
            correctAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!section) {
      throw new BadResponse("Section Not Found!");
    }

    return NextResponse.json(
      {
        data: { section },
        info: {
          message: "Section Updated Successfully!",
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

export async function DELETE(request: NextRequest) {
  try {
    const decodedUser = await verifyRequest({
      request,
      isVerified: true,
    });

    if (!decodedUser) {
      throw new UnauthorizedResponse("Unauthorized!");
    }

    const body = await request.json();
    const { id } = body;

    const section = await prisma.section.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!section) {
      throw new BadResponse("Section Not Found!");
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Section Deleted Successfully!",
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
