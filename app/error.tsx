"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell not-found">
      <p className="not-found-code">TEST INTERRUPTED</p>
      <h1>The page hit a bad signal.</h1>
      <p>Your test results were not uploaded or stored.</p>
      <button className="button-primary" type="button" onClick={reset}>
        Try this page again
      </button>
    </div>
  );
}
