import styled from "styled-components";
import * as React from "react";
import {
  Embellishment,
  Clustered,
  Message,
  Clusters,
  ChildMap,
  SagaEvent,
} from "../../data/types/events";
import { BubbleProps } from "./Bubble";
import Bubble from "./Bubble";
import SideButtons, { SideButtonsData } from "./SideButtons";
import MoreReplies from "./MoreReplies";
import Cluster from "./Cluster";
import { IdToEvent } from "../../data/utils/buildTree";
import { reduceRight, takeRight, difference } from "lodash";
import { Id } from "../../data/types/entity";
import clusterIDs from "../../data/utils/clusterIDs";
import { clusterSubstantives } from "./TreeView";

import CircleIcon from "@material-ui/icons/FiberManualRecord";
import OutlinedCircleIcon from "@material-ui/icons/FiberManualRecordOutlined";
import { IconButton, colors } from "@material-ui/core";
import isUnread from "../../data/utils/isUnread";
import { DummyAppDataContext } from "../../data/dummy/dummyAppData";
import { purple_primary } from "../../colors";
import {
  AppStateDispatcher,
  AppState,
  setReplyingTo,
  pushParent,
  sendReaction,
} from "../../data/reducers/appState";

export const MAX_PREVIEW_ELEMS = 5;
export const MAX_DEPTH = 2;

const BubbleControlsDiv = styled.div<any>`
  margin-left: 5px;
  position: relative;
  width: 100%;
  border-radius: 5px;
  :hover {
    /* background-color: rgba(0, 0, 200, 0.05); */
  }
`;

const filterEmbellishmentsByContentIdx = (
  embellishments: Embellishment[],
  index: number
) => embellishments.filter(({ contentIndex }) => contentIndex === index);

type BubbleAndControlsProps = BubbleProps & {
  appState: AppState;
  dispatch: AppStateDispatcher;
};
const BubbleAndControls: React.FC<BubbleAndControlsProps> = ({
  message,
  mode,
  childEvents,
  depth,
  appState,
  dispatch,
}) => {
  const [showControls, setShowControls] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const substantiveChildren = clusterSubstantives(
    childEvents,
    appState.idToEvent,
    appState.childMap
  );
  const lastNSubstantives =
    depth >= MAX_DEPTH ? [] : takeRight(substantiveChildren, MAX_PREVIEW_ELEMS);
  const truncated = difference(childEvents, lastNSubstantives);
  const clustering =
    lastNSubstantives.length > 0
      ? clusterIDs(
          appState.idToEvent,
          lastNSubstantives[lastNSubstantives.length - 1],
          lastNSubstantives
        )
      : [];
  const unread = isUnread(message, appState.myID);
  return (
    <div style={{ display: "inline-block", flexGrow: 1 }}>
      <BubbleControlsDiv
        onMouseOver={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        // onMouseDown={() => setSelected(1)}
        // onMouseUp={() => setSelected(null)}
      >
        <Bubble
          message={message}
          mode={mode}
          childEvents={childEvents}
          depth={depth}
        />
        <div
          style={{
            visibility: unread || showControls ? "visible" : "hidden",
            display: "inline-block",
            verticalAlign: "top",
          }}
        >
          <IconButton edge="end" size="small">
            {unread ? (
              <CircleIcon htmlColor={purple_primary} />
            ) : (
              <OutlinedCircleIcon htmlColor={purple_primary} />
            )}
          </IconButton>
        </div>
        <SideButtons
          show={showControls}
          selected={selected}
          onReplyClick={() => dispatch(setReplyingTo(message.id))}
          onEmojiPick={(emoji: string) =>
            dispatch(sendReaction(emoji, message.id))
          }
          isMe={appState.myID === message.creator}
        />
      </BubbleControlsDiv>
      {truncated.length > 0 && (
        <MoreReplies
          tree={appState.idToEvent}
          childEvents={truncated}
          onClick={() => dispatch(pushParent(message.id))}
        />
      )}
      <div style={{ paddingLeft: "1em" }}>
        {clustering.map((cluster: Clustered, i: number) => (
          <Cluster
            key={i}
            ids={cluster}
            depth={depth + 1}
            appState={appState}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default BubbleAndControls;
