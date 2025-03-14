"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, ArrowRightIcon, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

interface Week {
  id: string;
  weekOrder: number;
  weekTitle: string;
  weekDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoadingState = () => (
  <section className="flex-1 flex flex-col items-center justify-center">
    <div className="text-center p-10">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-gray-600">Loading weeks...</p>
    </div>
  </section>
);

const ErrorState = ({ message }: { message: string }) => (
  <section className="flex-1 flex justify-center items-center">
    <div className="text-center p-10 rounded-lg bg-red-50 shadow-sm max-w-md">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Error Loading Content
      </h3>
      <p className="text-red-600">{message}</p>
      <div className="mt-4">
        <Button
          onClick={() => window.location.reload()}
          variant="destructive"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    </div>
  </section>
);

const EmptyState = () => (
  <section className="flex-1 flex justify-center items-center">
    <div className="text-center p-10 rounded-lg bg-gray-50 shadow-sm">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">
        No weeks available, Please check back later!
      </p>
    </div>
  </section>
);

export default function WeeksPage() {
  const { token } = useUserContext();

  const {
    data: weeksQueryResult,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["weeks"],
    queryFn: async () => {
      const response = await axios.get(paths.api.weeks.root(), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data as { data: { weeks: Week[] } };
    },
  });

  const [content, setContent] = useState<Week[]>([]);

  useEffect(() => {
    setContent(weeksQueryResult?.data.weeks ?? []);
  }, [weeksQueryResult?.data.weeks]);

  return (
    <section
      className={cn(
        "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)] flex flex-col lg:flex-row",
      )}
    >
      <main className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-6")}>
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            message={(error as Error)?.message || "Failed to load weeks"}
          />
        ) : content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.map((week, index) => {
              const total = content.length;
              const on = index + 1;

              const urlSearchParams = new URLSearchParams();
              urlSearchParams.append("total", total.toString());
              urlSearchParams.append("on", on.toString());

              const queryString = urlSearchParams.toString();

              const url = `${paths.app.weeks.id.root({ id: week.id })}${queryString ? `?${queryString}` : ""}`;

              return (
                <Link
                  key={week.id}
                  href={url}
                  className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">
                        Week {week.weekOrder}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <ArrowRightIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {week.weekTitle}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {week.weekDescription}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Updated {new Date(week.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </section>
  );
}
