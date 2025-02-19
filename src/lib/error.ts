import { NextResponse } from "next/server";

import { ZodError } from "zod";

class ErrorResponse extends Error {
  public status: number;

  public constructor(status: number, message: string) {
    super(message);

    this.status = status;
  }
}

class BadResponse extends ErrorResponse {
  public constructor(message: string) {
    super(400, message);
  }
}

class UnauthorizedResponse extends ErrorResponse {
  public constructor(message: string) {
    super(401, message);
  }
}

class ForbiddenResponse extends ErrorResponse {
  public constructor(message: string) {
    super(403, message);
  }
}

class NotFoundResponse extends ErrorResponse {
  public constructor(message: string) {
    super(404, message);
  }
}

function handleErrors({ error }: { error: unknown }) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        data: {},
        info: { message: error.errors[0].message },
      },
      {
        status: 400,
      },
    );
  }

  if (error instanceof ErrorResponse) {
    switch (error.status) {
      case 400:
        return NextResponse.json(
          {
            data: {},
            info: { message: error.message },
          },
          {
            status: 400,
          },
        );

      case 401:
        return NextResponse.json(
          {
            data: {},
            info: { message: error.message },
          },
          {
            status: 401,
          },
        );

      case 403:
        return NextResponse.json(
          {
            data: {},
            info: { message: error.message },
          },
          {
            status: 403,
          },
        );

      case 404:
        return NextResponse.json(
          {
            data: {},
            info: { message: error.message },
          },
          {
            status: 404,
          },
        );
    }
  }

  console.error(error);

  if (error instanceof Error) {
    return NextResponse.json(
      {
        data: {},
        info: { message: error.message },
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(
    {
      data: {},
      info: { message: "Something went wrong!" },
    },
    {
      status: 500,
    },
  );
}

export {
  ErrorResponse,
  BadResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  handleErrors,
};
