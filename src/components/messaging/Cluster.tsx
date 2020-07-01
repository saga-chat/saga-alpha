import styled from "styled-components";
import * as React from "react";
import {
  Embellishment,
  Message,
  SagaEvent,
  Clustered,
} from "../../types/events";
import { idToEvent } from "../../types/utils/buildTree";
import BubbleAndControls from "./BubbleAndControls";
import { BubbleMode } from "./Bubble";
import { Id } from "../../types/entity";

const ClusterDiv = styled.div`
  display: inline-block;
  padding: 0;
  margin: 5px;
  width: 100%;
  max-width: 700px;
`;

const CreatorDiv = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  padding-left: 10px;
`;

export const clusterHasMessage = (cluster: Clustered, tree: idToEvent) =>
  cluster
    .map((id: Id) => tree[id])
    .some(({ kind }: SagaEvent) => kind === "message");

const Cluster: React.FC<{
  cluster: Clustered;
  tree: idToEvent;
  depth: number;
}> = ({ cluster, tree, depth }) => {
  return (
    <ClusterDiv>
      <CreatorDiv>{tree[cluster[0]].creator}</CreatorDiv>
      {cluster.map((id: Id, j: number) => {
        if (tree[id].kind === "message") {
          // to get embellishments, filter children
          const childEvents = tree[id].children || [];
          return (
            <BubbleAndControls
              key={j}
              message={tree[id] as any}
              childEvents={childEvents}
              depth={depth}
              tree={tree}
              mode={
                cluster.length === 1
                  ? BubbleMode.singleton
                  : j === 0
                  ? BubbleMode.top
                  : j === cluster.length - 1
                  ? BubbleMode.bottom
                  : BubbleMode.middle
              }
            />
          );
        }
      })}
    </ClusterDiv>
  );
};

export default Cluster;