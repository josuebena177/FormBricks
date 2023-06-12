"use client";

import { formbricksEnabled } from "@/lib/formbricks";
import formbricks from "@formbricks/js";
import { useEffect } from "react";

/* if (typeof window !== "undefined" && formbricksEnabled) {
  formbricks.init({
    environmentId: process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID || "",
    apiHost: process.env.NEXT_PUBLIC_FORMBRICKS_API_HOST || "",
    logLevel: "debug",
  });
} */

export default function FormbricksClient({ session }) {
  useEffect(() => {
    if (formbricksEnabled && session.user && formbricks) {
      formbricks.init({
        environmentId: process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID || "",
        apiHost: process.env.NEXT_PUBLIC_FORMBRICKS_API_HOST || "",
      });
      formbricks.setUserId(session.user.id);
      formbricks.setEmail(session.user.email);
      if (session.user.plan) {
        formbricks.setAttribute("Plan", session.user.plan);
      }
    }
  }, [session]);
  return null;
}
