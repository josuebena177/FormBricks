import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import BaseLayoutAuthorized from "../../../../components/layout/BaseLayoutAuthorized";
import FullWidth from "../../../../components/layout/FullWidth";
import SecondNavBar from "../../../../components/layout/SecondNavBar";
import Loading from "../../../../components/Loading";
import ResultsResponses from "../../../../components/results/ResultsResponses";
import { useForm } from "../../../../lib/forms";
import { useFormMenuSteps } from "../../../../lib/navigation/formMenuSteps";
import { useFormResultsSecondNavigation } from "../../../../lib/navigation/formResultsSecondNavigation";

export default function ResultsResponsesPage() {
  const router = useRouter();
  const formId = router.query.id.toString();
  const { form, isLoadingForm } = useForm(router.query.id);
  const formMenuSteps = useFormMenuSteps(formId);
  const formResultsSecondNavigation = useFormResultsSecondNavigation(formId);

  if (isLoadingForm) {
    return <Loading />;
  }

  return (
    <BaseLayoutAuthorized
      title={`${form.name} - snoopForms`}
      breadcrumbs={[{ name: form.name, href: "#", current: true }]}
      steps={formMenuSteps}
      currentStep="results"
      limitHeightScreen={true}
    >
      <SecondNavBar
        navItems={formResultsSecondNavigation}
        currentItemId="responses"
      />

      <FullWidth>
        <ResultsResponses formId={formId} />
      </FullWidth>
    </BaseLayoutAuthorized>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
  }
  return { props: {} };
};
