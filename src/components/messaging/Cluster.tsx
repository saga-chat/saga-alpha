import styled from "styled-components";
import * as React from "react";
import {
  Embellishment,
  Message,
  SagaEvent,
  Clustered,
  ChildMap,
} from "../../types/events";
import { idToEvent } from "../../types/utils/buildTree";
import BubbleAndControls from "./BubbleAndControls";
import { BubbleMode } from "./Bubble";
import { Id } from "../../types/entity";
import isSubstantiveMessage from "../../types/utils/isSubstantiveMessage";
import { DummyAppDataContext } from "../../types/dummy/dummyAppData";

const ClusterDiv = styled.div`
  display: block;
  padding: 0;
  margin: 5px;
  width: 100%;
  max-width: 700px;
`;

export const CreatorDiv = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
  font-size: 12px;
  padding-left: 40px;
`;

const PROPIC_SIZE = "25px";

export const Propic = styled.div<any>`
  display: inline-block;
  width: ${PROPIC_SIZE};
  height: ${PROPIC_SIZE};
  border-radius: 1000px;
  background: url(${({ uri }: any) => uri});
  background-size: cover;
  background-repeat: no-repeat;
`;

export const clusterSubstantives = (
  cluster: Id[],
  tree: idToEvent,
  childMap: ChildMap
) =>
  cluster
    .map((id: Id) => tree[id])
    .filter((evt: SagaEvent) => isSubstantiveMessage(evt, childMap));

const Cluster: React.FC<{
  ids: Id[];
  tree: idToEvent;
  onPush(id: Id): void;
  depth: number;
  childMap: ChildMap;
}> = ({ ids, tree, depth, onPush, childMap }) => {
  const { knownUsers } = React.useContext(DummyAppDataContext);
  const substantives = clusterSubstantives(ids, tree, childMap);
  if (substantives.length === 0) {
    return null;
  }
  const buffer = <div style={{ width: PROPIC_SIZE }} />;
  return (
    <ClusterDiv>
      <CreatorDiv>{knownUsers[tree[ids[0]].creator].display_name}</CreatorDiv>
      {substantives.map((evt: SagaEvent, j: number) => {
        const childEvents = childMap[evt.id];
        return (
          <div
            key={j}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              marginTop: "5px",
            }}
          >
            {j === 0 ? <Propic uri={knownUsers[evt.creator].avatar} /> : buffer}
            <BubbleAndControls
              message={evt as any}
              childEvents={childEvents}
              depth={depth}
              tree={tree}
              onPush={onPush}
              childMap={childMap}
              mode={
                ids.length === 1
                  ? BubbleMode.singleton
                  : j === 0
                  ? BubbleMode.top
                  : j === ids.length - 1
                  ? BubbleMode.bottom
                  : BubbleMode.middle
              }
            />
          </div>
        );
      })}
    </ClusterDiv>
  );
};

export default Cluster;
