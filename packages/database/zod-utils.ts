import z from "zod";

export const ZEventProperties = z.record(z.string());
export { ZEventClassNoCodeConfig } from "@formbricks/types/v1/eventClasses";

export { ZResponseData } from "@formbricks/types/v1/responses";
export const ZResponseMeta = z.record(z.union([z.string(), z.number()]));

export { ZSurveyQuestions, ZSurveyThankYouCard } from "@formbricks/types/v1/surveys";

export { ZUserNotificationSettings } from "@formbricks/types/v1/users";
