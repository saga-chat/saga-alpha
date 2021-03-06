import Bubble, { BubbleMode } from "../components/messaging/Bubble";
import * as React from "react";
import { action } from "@storybook/addon-actions";
import dummyRoom from "../data/dummy/dummyRoom";
import Frame from "../components/framing/Frame";
import dummyAppData, { DummyAppDataContext } from "../data/dummy/dummyAppData";
export const FrameStory = () => (
  <DummyAppDataContext.Provider value={dummyAppData}>
    <Frame />
  </DummyAppDataContext.Provider>
);

export default {
  title: "Frame",
  component: Frame,
};
