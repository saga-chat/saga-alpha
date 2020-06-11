import { Room } from "../room";
import uniqid from "uniqid";
import makeChain from "./makeChain";
import makeMessage from "./makeMessage";
import makeParentAndChildren from "./makeParentAndChildren";
import correctBelowChain from "./correctBelowChain";

const dummyRoom: Room = {
  creator: "max",
  created: Date.now(),
  id: uniqid(),
  members: ["max", "you"],
  name: "Telescope emoji",
  events: correctBelowChain(
    [
      ...makeChain(
        "max",
        [
          "Welcome to saga!",
          "here's a quick tour of all the features",
          "saga was built on the **vision** that chat should work like a notebook",
          "you can read more about this vision at https://a9.io/glue-comic",
          "anyways,",
        ],
        null,
        null
      ),
      ...makeParentAndChildren(
        "max",
        "you can reply to stuff!",
        [makeMessage("max", "hello", null, null)],
        null,
        null
      ),
    ],
    null
  ),
  lastTyping: {},
};

// TODO: images, reactions, embellishment ranges
// membership events
// time separators
// member profile info (online status, avatar)
// typing status
// read status
export default dummyRoom;
