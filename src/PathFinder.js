import React, { useEffect, useState } from "react";
import Node from "./Node/Node";
import "./PathFinder.css";
import Search from "./search/Search";

const START_ID = [1, 1];
const GOAL_ID = [10, 12];
const numRows = 20;
const numCols = 20;

function PathFinder() {
  const [nodeIDs, setNodeIDs] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    gridInit();
    console.log("working");
    console.log(searchResult);
  }, [searchResult]);

  function gridInit() {
    let nodeIDs = [];
    nodeIDs = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push({ rowID: i, colID: j });
      }
      nodeIDs.push(row);
    }
    setNodeIDs(nodeIDs);
  }

  async function visualizeVisited() {
    let v = searchResult.visitedNodes;
    for (let i = 0; i < v.length; i++) {
      if (
        (v[i].row == START_ID[0] && v[i].col == START_ID[1]) ||
        (v[i].row == GOAL_ID[0] && v[i].col == GOAL_ID[1])
      ) {
        continue;
      }
      let elem = document.getElementById(`node-${v[i].row}-${v[i].col}`);
      elem.style.backgroundColor = "#4d79ff";
      await sleep(20);
    }
    let p = searchResult.path;
    for (let i = 0; i < p.length; i++) {
      if (
        (p[i].row == START_ID[0] && p[i].col == START_ID[1]) ||
        (p[i].row == GOAL_ID[0] && p[i].col == GOAL_ID[1])
      ) {
        continue;
      }
      let elem = document.getElementById(`node-${p[i].row}-${p[i].col}`);
      elem.style.backgroundColor = "#ffcc66";
      await sleep(30);
    }
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // console.table(nodeIDs);
  return (
    <div className="container">
      <button onClick={() => visualizeVisited()}> visualizeVisited </button>
      <button
        onClick={() =>
          setSearchResult(
            Search(
              { row: START_ID[0], col: START_ID[1] },
              { row: GOAL_ID[0], col: GOAL_ID[1] },
              numRows,
              numCols
            )
          )
        }
      >
        {" "}
        Search{" "}
      </button>
      <div className="grid">
        {nodeIDs.map((row) => (
          <div className="row">
            {row.map(({ rowID, colID }) => (
              <div
                id={`node-${rowID}-${colID}`}
                className={`cell ${
                  (rowID === START_ID[0] &&
                    colID === START_ID[1] &&
                    "start_node") ||
                  (rowID === GOAL_ID[0] && colID === GOAL_ID[1] && "goal_node")
                }`}
              >
                <Node row={rowID} col={colID} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PathFinder;
