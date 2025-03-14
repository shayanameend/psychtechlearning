"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useRouter } from "next/navigation";
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

export default function WeeksPage() {
  const router = useRouter();

  const { token } = useUserContext();

  const { data: weeksQueryResult, isSuccess: weeksQueryIsSuccess } = useQuery({
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

  if (!weeksQueryIsSuccess) {
    return null;
  }

  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)] flex flex-col lg:flex-row",
        )}
      >
        <main className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-6")}>
          {content.length > 0 ? (
            <ul>
              {content.map((week, index) => {
                const total = content.length;
                const on = index + 1;

                const urlSearchParams = new URLSearchParams();
                urlSearchParams.append("total", total.toString());
                urlSearchParams.append("on", on.toString());

                const queryString = urlSearchParams.toString();

                const url = `${paths.app.weeks.id.root({ id: week.id })}${queryString ? `?${queryString}` : ""}`;

                return (
                  <li key={week.id}>
                    <Link href={url}>
                      <h2>{week.weekTitle}</h2>
                      <p>{week.weekDescription}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <section className={cn("flex-1 flex justify-center items-center")}>
              <p className={cn("text-gray-600 text-sm")}>
                No weeks available, Please check back later!
              </p>
            </section>
          )}
        </main>
      </section>
    </>
  );
}
