import Entity, { Id, userid } from "./entity";
export type Clustered = Id[];
export type Clusters = Clustered[];

export type ChildMap = { [id: string]: Id[] };
export interface Evt extends Entity {
  seen_by: userid[];
  below: Id | null;
  parent: Id | null;
}

interface Markdown {
  kind: "markdown";
  contents: string;
}

interface Image {
  kind: "image";
  uri: string;
}
export interface Embellishment extends Entity {
  contentIndex: number | null;
}

export interface Range {
  start: number;
  end: number;
}

// renders as the content itself in "quote" form
export interface Highlight extends Embellishment {
  range: Range | null;
  kind: "highlight";
}

export interface Reaction extends Embellishment {
  kind: "reaction";
  emoji: string;
  range: Range | null;
}

export const SubstantiveContent = ["markdown", "image"];

export type MessageContent = Markdown | Image | Highlight | Reaction;
export interface Message extends Evt {
  kind: "message";
  isDeleted?: boolean;
  contents: MessageContent[];
}

interface Join {
  creator: string;
  kind: "join";
}

interface Leave {
  creator: string;
  kind: "leave";
}

interface Kick {
  creator: string;
  victim: string;
  kind: "kick";
}

type MembershipChange = Join | Leave | Kick;

interface MembershipChanged extends Evt {
  kind: "membership_change";
  contents: MembershipChange;
}

export type SagaEvent = Message | MembershipChanged;
