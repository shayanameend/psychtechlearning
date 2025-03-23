import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { verifyRequest } from "~/lib/auth";
import { BadResponse, UnauthorizedResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { UpdateCourseSchema } from "~/validators/course";

export async function GET(
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

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        courseOrder: true,
        courseTitle: true,
        courseDescription: true,
        guideLink: true,
        guideDescription: true,
        audioLink: true,
        audioDescription: true,
        flashcardsDescription: true,
        sampleTestDescription: true,
        finalTestDescription: true,
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
        courseUserNotes: {
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

    if (!course) {
      throw new BadResponse("Course Not Found!");
    }

    return NextResponse.json(
      {
        data: { course },
        info: {
          message: "Course Fetched Successfully!",
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
      courseOrder,
      courseTitle,
      courseDescription,
      guideLink,
      guideDescription,
      audioLink,
      audioDescription,
      flashcardsDescription,
      sampleTestDescription,
      finalTestDescription,
    } = UpdateCourseSchema.parse(body);

    const course = await prisma.course.update({
      where: {
        id,
      },
      data: {
        courseOrder,
        courseTitle,
        courseDescription,
        guideLink,
        guideDescription,
        audioLink,
        audioDescription,
        flashcardsDescription,
        sampleTestDescription,
        finalTestDescription,
      },
      select: {
        id: true,
        courseTitle: true,
        courseDescription: true,
        guideLink: true,
        guideDescription: true,
        audioLink: true,
        audioDescription: true,
        flashcardsDescription: true,
        sampleTestDescription: true,
        finalTestDescription: true,
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

    if (!course) {
      throw new BadResponse("Course Not Found!");
    }

    return NextResponse.json(
      {
        data: { course },
        info: {
          message: "Course Updated Successfully!",
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

export async function DELETE(
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

    const course = await prisma.course.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!course) {
      throw new BadResponse("Course Not Found!");
    }

    return NextResponse.json(
      {
        data: {},
        info: {
          message: "Course Deleted Successfully!",
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
