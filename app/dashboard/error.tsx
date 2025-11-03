"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Captured error:", error);
  }, [error]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fafafa",
      }}
    >
      <Result
        status="500"
        title="Something went wrong"
        subTitle={error.message || "An unexpected error occurred."}
        extra={
          <Button type="primary" onClick={() => reset()}>
            Try Again
          </Button>
        }
      />
    </div>
  );
}
