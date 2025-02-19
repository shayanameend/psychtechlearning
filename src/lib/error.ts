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
        statusText: "Bad Request",
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
            statusText: "Bad Request",
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
            statusText: "Unauthorized",
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
            statusText: "Forbidden",
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
            statusText: "Not Found",
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
        statusText: "Internal Server Error",
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
      statusText: "Internal Server Error",
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
