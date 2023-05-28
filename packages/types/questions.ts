export interface Choice {
  id: string;
  label: string;
}

export type Question =
  | OpenTextQuestion
  | MultipleChoiceSingleQuestion
  | MultipleChoiceMultiQuestion
  | NPSQuestion
  | CTAQuestion
  | RatingQuestion;

export interface IQuestion<T extends Logic> {
  id: string;
  type: string;
  headline: string;
  subheader?: string;
  required: boolean;
  buttonLabel?: string;
  logic?: T[];
}

export interface OpenTextQuestion extends IQuestion<OpenTextLogic> {
  type: "openText";
  placeholder?: string;
}

export interface MultipleChoiceSingleQuestion extends IQuestion<MultipleChoiceSingleLogic> {
  type: "multipleChoiceSingle";
  choices: Choice[];
}

export interface MultipleChoiceMultiQuestion extends IQuestion<MultipleChoiceMultiLogic> {
  type: "multipleChoiceMulti";
  choices: Choice[];
}

export interface NPSQuestion extends IQuestion<NPSLogic> {
  type: "nps";
  lowerLabel: string;
  upperLabel: string;
}

export interface CTAQuestion extends IQuestion<CTALogic> {
  type: "cta";
  html?: string;
  buttonUrl?: string;
  buttonExternal: boolean;
  dismissButtonLabel?: string;
}

export interface RatingQuestion extends IQuestion<RatingLogic> {
  type: "rating";
  scale: "number" | "smiley" | "star";
  range: 5 | 3 | 4 | 7 | 10;
  lowerLabel: string;
  upperLabel: string;
}

export type LogicCondition =
  | "submitted"
  | "skipped"
  | "equals"
  | "notEquals"
  | "lessThan"
  | "lessEqual"
  | "greaterThan"
  | "greaterEqual"
  | "includesAll"
  | "includesOne";

export interface LogicBase {
  condition: LogicCondition | undefined;
  value: number | string | string[] | undefined;
  destination: string | "end" | undefined;
}

export interface OpenTextLogic extends LogicBase {
  condition: "submitted" | "skipped" | undefined;
  value: undefined;
}
export interface MultipleChoiceSingleLogic extends LogicBase {
  condition: "submitted" | "skipped" | "equals" | "notEquals" | undefined;
  value: string;
}
export interface MultipleChoiceMultiLogic extends LogicBase {
  condition: "submitted" | "skipped" | "includesAll" | "includesOne" | undefined;
  value: string[];
}
export interface NPSLogic extends LogicBase {
  condition:
    | "submitted"
    | "skipped"
    | "lessThan"
    | "lessEqual"
    | "greaterThan"
    | "greaterEqual"
    | "equals"
    | "notEquals"
    | undefined;
  value: number;
}
export interface CTALogic extends LogicBase {
  condition: "submitted" | "skipped" | undefined;
  value: undefined;
}
export interface RatingLogic extends LogicBase {
  condition:
    | "submitted"
    | "skipped"
    | "lessThan"
    | "lessEqual"
    | "greaterThan"
    | "greaterEqual"
    | "equals"
    | "notEquals"
    | undefined;
  value: number;
}
export type Logic =
  | OpenTextLogic
  | MultipleChoiceSingleLogic
  | MultipleChoiceMultiLogic
  | NPSLogic
  | CTALogic
  | RatingLogic;
