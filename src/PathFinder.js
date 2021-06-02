import React, { useEffect, useState } from "react";
import Node from "./Node/Node";
import "./PathFinder.css";
import Search from "./search/Search";
import { Button, Menu, MenuItem } from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

const START_ID = [5, 7];
const GOAL_ID = [10, 12];
const WALLS = new Map();
WALLS.set("5-8", true);
WALLS.set("5-6", true);
WALLS.set("2-7", true);
WALLS.set("6-7", true);
const numRows = 20;
const numCols = 20;

function PathFinder() {
  const [nodeIDs, setNodeIDs] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [strategy, setStrategy] = useState("Select");

  useEffect(() => {
    gridInit();
    console.log("working");
    // console.log(searchResult);
  }, []);

  function gridInit() {
    let nodeIDs = [];
    nodeIDs = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push({ rowID: i, colID: j });
        // WALLS.set(`${i}-${j}`, false);
      }
      nodeIDs.push(row);
    }
    setNodeIDs(nodeIDs);
  }

  function setWall(i, j) {
    WALLS.set(`${i}-${j}`, !WALLS.get(`${i}-${j}`));
    let elem = document.getElementById(`node-${i}-${j}`);
    WALLS.get(`${i}-${j}`)
      ? (elem.style.backgroundColor = "#666666")
      : (elem.style.backgroundColor = "white");
  }

  async function StartSearch() {
    let searchRes = Search(
      { row: START_ID[0], col: START_ID[1] },
      { row: GOAL_ID[0], col: GOAL_ID[1] },
      numRows,
      numCols,
      WALLS
    );
    searchRes ? await visualizeVisited(searchRes) : console.log();
    searchRes ? setSearchResult(searchRes) : console.log();
  }

  async function visualizeVisited(searchRes) {
    setSearchResult(searchRes);
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (
          (i === START_ID[0] && j === START_ID[1]) ||
          (i === GOAL_ID[0] && j === GOAL_ID[1]) ||
          WALLS.get(`${i}-${j}`) !== undefined
        ) {
          continue;
        }
        let elem = document.getElementById(`node-${i}-${j}`);
        elem.style.backgroundColor = "white";
      }
    }
    console.log(searchRes);
    let v = searchRes.visitedNodes;

    for (let i = 0; i < v.length; i++) {
      if (
        (v[i].row === START_ID[0] && v[i].col === START_ID[1]) ||
        (v[i].row === GOAL_ID[0] && v[i].col === GOAL_ID[1])
      ) {
        continue;
      }
      let elem = document.getElementById(`node-${v[i].row}-${v[i].col}`);
      elem.style.backgroundColor = "#4d79ff";
      await sleep(20);
    }
    let p = searchRes.path;
    for (let i = 0; i < p.length; i++) {
      if (
        (p[i].row === START_ID[0] && p[i].col === START_ID[1]) ||
        (p[i].row === GOAL_ID[0] && p[i].col === GOAL_ID[1])
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
  return (
    <div className="container">
      <button onClick={() => visualizeVisited()}> visualizeVisited </button>
      <button onClick={StartSearch}> Search </button>
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <Button
              variant="contained"
              // color="primary"
              {...bindTrigger(popupState)}
            >
              {strategy}
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>UCS</MenuItem>
              <MenuItem onClick={popupState.close}>BFS</MenuItem>
              <MenuItem onClick={popupState.close}>A* Search</MenuItem>
              <MenuItem onClick={popupState.close}>Greedy</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      <div className="grid">
        {nodeIDs.map((row) => (
          <div className="row">
            {row.map(({ rowID, colID }) => (
              <div
                onClick={() => setWall(rowID, colID)}
                id={`node-${rowID}-${colID}`}
                className={`cell ${
                  (rowID === START_ID[0] &&
                    colID === START_ID[1] &&
                    "start_node") ||
                  (rowID === GOAL_ID[0] &&
                    colID === GOAL_ID[1] &&
                    "goal_node") ||
                  (WALLS.get(`${rowID}-${colID}`) === true && "wall_node")
                }`}
              >
                {/* {document
                  .getElementById(`node-${rowID}-${colID}`)
                  .addEventListener("click", setWall(rowID, colID))} */}
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
