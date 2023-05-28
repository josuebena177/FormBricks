import type { JsConfig, Survey } from "../../../types/js";
import type { Logic } from "../../../types/questions";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { createDisplay, markDisplayResponded } from "../lib/display";
import { IErrorHandler } from "../lib/errors";
import { Logger } from "../lib/logger";
import { createResponse, updateResponse } from "../lib/response";
import { cn } from "../lib/utils";
import Progress from "./Progress";
import QuestionConditional from "./QuestionConditional";
import ThankYouCard from "./ThankYouCard";

interface SurveyViewProps {
  config: JsConfig;
  survey: Survey;
  close: () => void;
  brandColor: string;
  errorHandler: IErrorHandler;
}

export default function SurveyView({ config, survey, close, brandColor, errorHandler }: SurveyViewProps) {
  const [activeQuestionId, setActiveQuestionId] = useState(survey.questions[0].id);
  const [progress, setProgress] = useState(0); // [0, 1]
  const [responseId, setResponseId] = useState<string | null>(null);
  const [displayId, setDisplayId] = useState<string | null>(null);
  const [loadingElement, setLoadingElement] = useState(false);

  useEffect(() => {
    initDisplay();
    async function initDisplay() {
      const createDisplayResult = await createDisplay(
        { surveyId: survey.id, personId: config.person.id },
        config
      );

      createDisplayResult.ok === true
        ? setDisplayId(createDisplayResult.value.id)
        : errorHandler(createDisplayResult.error);
    }
  }, [config, survey, errorHandler]);

  useEffect(() => {
    setProgress(calculateProgress());

    function calculateProgress() {
      const elementIdx = survey.questions.findIndex((e) => e.id === activeQuestionId);
      return elementIdx / survey.questions.length;
    }
  }, [activeQuestionId, survey]);

  function evaluateCondition(logic: Logic, answerValue: any): boolean {
    switch (logic.condition) {
      case "equals":
        return (
          (Array.isArray(answerValue) && answerValue.length === 1 && answerValue.includes(logic.value)) ||
          answerValue.toString() === logic.value
        );
      case "notEquals":
        return answerValue !== logic.value;
      case "lessThan":
        return answerValue < logic.value;
      case "lessEqual":
        return answerValue <= logic.value;
      case "greaterThan":
        return answerValue > logic.value;
      case "greaterEqual":
        return answerValue >= logic.value;
      case "includesAll":
        return (
          Array.isArray(answerValue) &&
          Array.isArray(logic.value) &&
          logic.value.every((v) => answerValue.includes(v))
        );
      case "includesOne":
        return (
          Array.isArray(answerValue) &&
          Array.isArray(logic.value) &&
          logic.value.some((v) => answerValue.includes(v))
        );
      case "submitted":
        if (typeof answerValue === "string") {
          return answerValue !== "dismissed" && answerValue !== "" && answerValue !== null;
        } else if (Array.isArray(answerValue)) {
          return answerValue.length > 0;
        } else if (typeof answerValue === "number") {
          return answerValue !== null;
        }
        return false;
      case "skipped":
        return (
          (Array.isArray(answerValue) && answerValue.length === 0) ||
          answerValue === "" ||
          answerValue === null ||
          answerValue === "dismissed"
        );
      default:
        return false;
    }
  }

  function getNextQuestion(answer: any): string {
    const questions = survey.questions;

    const currentQuestionIndex = questions.findIndex((q) => q.id === activeQuestionId);
    if (currentQuestionIndex === -1) throw new Error("Question not found");

    const answerValue = answer[activeQuestionId];
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.logic && currentQuestion.logic.length > 0) {
      for (let logic of currentQuestion.logic) {
        if (!logic.destination) continue;

        if (evaluateCondition(logic, answerValue)) {
          return logic.destination;
        }
      }
    }
    return questions[currentQuestionIndex + 1]?.id || "";
  }

  const submitResponse = async (data: { [x: string]: any }) => {
    setLoadingElement(true);
    const questionIdx = survey.questions.findIndex((e) => e.id === activeQuestionId);
    const nextQuestionId = getNextQuestion(data);

    const finished = nextQuestionId === "end" || questionIdx === survey.questions.length - 1;
    // build response
    const responseRequest = {
      surveyId: survey.id,
      personId: config.person.id,
      response: { finished, data },
    };
    if (!responseId) {
      const [response, _] = await Promise.all([
        createResponse(responseRequest, config),
        markDisplayResponded(displayId, config),
      ]);

      response.ok === true ? setResponseId(response.value.id) : errorHandler(response.error);
    } else {
      const result = await updateResponse(responseRequest, responseId, config);

      if (result.ok !== true) {
        errorHandler(result.error);
      } else if (responseRequest.response.finished) {
        Logger.getInstance().debug("Submitted response");
      }
    }
    setLoadingElement(false);

    if (!finished && nextQuestionId !== "end") {
      // setActiveQuestionId(survey.questions[questionIdx + 1].id);
      setActiveQuestionId(nextQuestionId);
    } else {
      setProgress(100);

      if (survey.thankYouCard.enabled) {
        setTimeout(() => {
          close();
        }, 2000);
      } else {
        close();
      }
    }
  };

  return (
    <div>
      <div
        className={cn(
          loadingElement ? "fb-animate-pulse fb-opacity-60" : "",
          "fb-text-slate-800 fb-font-sans fb-px-4 fb-py-6 sm:fb-p-6"
        )}>
        {progress === 100 && survey.thankYouCard.enabled ? (
          <ThankYouCard
            headline={survey.thankYouCard.headline}
            subheader={survey.thankYouCard.subheader}
            brandColor={config.settings?.brandColor}
          />
        ) : (
          survey.questions.map(
            (question, idx) =>
              activeQuestionId === question.id && (
                <QuestionConditional
                  key={question.id}
                  brandColor={brandColor}
                  lastQuestion={idx === survey.questions.length - 1}
                  onSubmit={submitResponse}
                  question={question}
                />
              )
          )
        )}
      </div>
      <Progress progress={progress} brandColor={brandColor} />
    </div>
  );
}
