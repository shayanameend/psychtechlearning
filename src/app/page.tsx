"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { paths } from "~/routes/paths";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push(paths.auth.signIn());
  }, [router.push]);

  return (
    <>
      <section>
        <h2>Home Page</h2>
      </section>
    </>
  );
}
