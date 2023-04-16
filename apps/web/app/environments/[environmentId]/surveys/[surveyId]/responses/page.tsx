import ContentWrapper from "@/components/shared/ContentWrapper";
import SurveyResultsTabs from "../SurveyResultsTabs";
import ResponseTimeline from "./ResponseTimeline";
import ResponsesLimitReachedBanner from "../ResponsesLimitReachedBanner";

export default function ResponsesPage({ params }) {
  return (
    <>
      <SurveyResultsTabs
        activeId="responses"
        environmentId={params.environmentId}
        surveyId={params.surveyId}
      />
      <ResponsesLimitReachedBanner environmentId={params.environmentId} surveyId={params.surveyId} />
      <ContentWrapper>
        <ResponseTimeline environmentId={params.environmentId} surveyId={params.surveyId} />
      </ContentWrapper>
    </>
  );
}
