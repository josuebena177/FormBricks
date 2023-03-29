import { Response, DisplayCreateRequest } from "@formbricks/types/js";

export const createDisplay = async (
  displayCreateRequest: DisplayCreateRequest,
  config
): Promise<Response> => {
  const res = await fetch(`${config.apiHost}/api/v1/client/environments/${config.environmentId}/displays`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(displayCreateRequest),
  });
  if (!res.ok) {
    console.error(res.text);
    throw new Error("Could not create display");
  }
  return await res.json();
};

export const markDisplayResponded = async (displayId, config): Promise<void> => {
  const res = await fetch(
    `${config.apiHost}/api/v1/client/environments/${config.environmentId}/displays/${displayId}/responded`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    throw new Error("Could not update display");
  }
  return;
};
