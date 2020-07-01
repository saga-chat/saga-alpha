import styled from "styled-components";
import * as React from "react";
import { Embellishment, Clustered } from "../../types/events";
import { BubbleProps } from "./Bubble";
import Bubble from "./Bubble";
import SideButtons, { SideButtonsData } from "./SideButtons";
import MoreReplies from "./MoreReplies";
import Cluster, { clusterSubstantives } from "./Cluster";
import { idToEvent } from "../../types/utils/buildTree";
import isSubstantiveMessage from "../../types/utils/isSubstantiveMessage";

const BubbleControlsDiv = styled.div<any>`
  margin-top: 5px;
  position: relative;
  width: 100%;
`;

const filterEmbellishmentsByContentIdx = (
  embellishments: Embellishment[],
  index: number
) => embellishments.filter(({ contentIndex }) => contentIndex === index);

type BubbleAndControlsProps = BubbleProps & { tree: idToEvent };
const BubbleAndControls: React.FC<BubbleAndControlsProps> = ({
  message,
  mode,
  childEvents,
  depth,
  tree,
}) => {
  const [showControls, setShowControls] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  if (!isSubstantiveMessage(message)) {
    return <pre>message has no substance!</pre>;
  }
  // TODO: partition child events into more... and shown
  return (
    <div>
      <BubbleControlsDiv
        onMouseOver={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onMouseDown={() => setSelected(1)}
        onMouseUp={() => setSelected(null)}
      >
        <Bubble
          message={message}
          mode={mode}
          childEvents={childEvents}
          depth={depth}
        />
        <SideButtons
          show={showControls}
          selected={selected}
          onReplyClick={console.log}
        />
      </BubbleControlsDiv>
      {childEvents.length > 0 && <MoreReplies childEvents={childEvents} />}
      <div style={{ paddingLeft: "1em" }}>
        {childEvents.map((cluster: Clustered, i: number) =>
          clusterSubstantives(cluster, tree).length > 0 ? (
            <Cluster key={i} cluster={cluster} tree={tree} depth={depth + 1} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default BubbleAndControls;
