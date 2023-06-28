export const revalidate = 0;

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import ContentWrapper from "@/components/shared/ContentWrapper";
import { getServerSession } from "next-auth";
import ResponsesLimitReachedBanner from "../ResponsesLimitReachedBanner";
import SurveyResultsTabs from "../SurveyResultsTabs";
import SummaryList from "./SummaryList";
import SummaryMetadata from "./SummaryMetadata";

export default async function SummaryPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  return (
    <>
      <SurveyResultsTabs activeId="summary" environmentId={params.environmentId} surveyId={params.surveyId} />
      {/* @ts-expect-error Server Component */}
      <ResponsesLimitReachedBanner
        environmentId={params.environmentId}
        session={session}
        surveyId={params.surveyId}
      />
      <ContentWrapper>
        {/* @ts-expect-error Server Component */}
        <SummaryMetadata surveyId={params.surveyId} environmentId={params.environmentId} session={session} />
        {/* @ts-expect-error Server Component */}
        <SummaryList environmentId={params.environmentId} session={session} surveyId={params.surveyId} />
      </ContentWrapper>
    </>
  );
}
