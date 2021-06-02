import React, { useEffect, useState } from "react";
import Node from "./Node/Node";
import "./PathFinder.css";
import Search from "./search/Search";
import { Button, Menu, MenuItem } from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

let START_ID = [5, 7];
let GOAL_ID = [10, 12];
const WALLS = new Map();
const BOMBS = new Map();
const numRows = 15;
const numCols = 40;

function PathFinder() {
  const [nodeIDs, setNodeIDs] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [modifyNodes, setModifyNodes] = useState("Modify Nodes");
  const [strategy, setStrategy] = useState("Select");
  const [selectWall, setSelectWall] = useState(false);
  const [selectBomb, setSelectBomb] = useState(false);
  const [selectStart, setSelectStart] = useState(false);
  const [selectGoal, setSelectGoal] = useState(false);

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
        WALLS.set(`${i}-${j}`, false);
        BOMBS.set(`${i}-${j}`, false);
      }
      nodeIDs.push(row);
    }
    setNodeIDs(nodeIDs);
  }

  function changeStrategy(strategy, f) {
    f();
    setStrategy(strategy);
  }

  function onClickModifyNodes(f, modify, name) {
    f();
    if (!modify) {
      if (name === "start") {
        setSelectStart(true);
        setSelectGoal(false);
        setSelectWall(false);
        setSelectBomb(false);
      } else if (name === "goal") {
        setSelectStart(false);
        setSelectGoal(true);
        setSelectWall(false);
        setSelectBomb(false);
      } else if (name === "walls") {
        setSelectStart(false);
        setSelectGoal(false);
        setSelectWall(true);
        setSelectBomb(false);
      } else {
        setSelectStart(false);
        setSelectGoal(false);
        setSelectWall(false);
        setSelectBomb(true);
      }
    }
    console.log(selectBomb, selectWall);
  }

  function setNode(i, j) {
    if (
      !(
        (i === START_ID[0] && j === START_ID[1]) ||
        (i === GOAL_ID[0] && j === GOAL_ID[1])
      )
    ) {
      if (selectStart) {
        let elem = document.getElementById(`node-${i}-${j}`);
        elem.style.background = "red";
        elem = document.getElementById(`node-${START_ID[0]}-${START_ID[1]}`);
        elem.style.background = "white";
        START_ID = [i, j];
      }
      if (selectGoal) {
        let elem = document.getElementById(`node-${i}-${j}`);
        elem.style.background = "green";
        elem = document.getElementById(`node-${GOAL_ID[0]}-${GOAL_ID[1]}`);
        elem.style.background = "white";
        GOAL_ID = [i, j];
      }
      if (selectWall) {
        WALLS.set(`${i}-${j}`, !WALLS.get(`${i}-${j}`));
        let elem = document.getElementById(`node-${i}-${j}`);
        WALLS.get(`${i}-${j}`)
          ? (elem.style.backgroundColor = "#666666")
          : (elem.style.backgroundColor = "white");
      }
      if (selectBomb) {
        BOMBS.set(`${i}-${j}`, !BOMBS.get(`${i}-${j}`));
        let elem = document.getElementById(`node-${i}-${j}`);
        BOMBS.get(`${i}-${j}`)
          ? (elem.innerHTML = "B") &&
            (elem.style.textAlign = "center") &&
            (elem.style.fontWeight = "bold")
          : (elem.innerHTML = "") && (elem.style.backgroundColor = "white");
      }
    }
  }

  async function StartSearch() {
    let searchRes = Search(
      { row: START_ID[0], col: START_ID[1] },
      { row: GOAL_ID[0], col: GOAL_ID[1] },
      numRows,
      numCols,
      strategy,
      WALLS,
      BOMBS
    );
    searchRes ? await visualizeVisited(searchRes) : console.log();
  }

  async function visualizeVisited(searchRes) {
    setSearchResult(searchRes);
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (
          (i === START_ID[0] && j === START_ID[1]) ||
          (i === GOAL_ID[0] && j === GOAL_ID[1]) ||
          WALLS.get(`${i}-${j}`) === true
        ) {
          continue;
        }
        let elem = document.getElementById(`node-${i}-${j}`);
        elem.style.backgroundColor = "white";
      }
    }
    let v = searchResult.visitedNodes;

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
      <div className="buttons">
        {/* <div className="selectStrategy"> */}
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
                <MenuItem
                  onClick={() => {
                    changeStrategy("UCS", popupState.close);
                  }}
                >
                  UCS
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    changeStrategy("BFS", popupState.close);
                  }}
                >
                  BFS
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    changeStrategy("A* Search", popupState.close);
                  }}
                >
                  A* Search
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    changeStrategy("Greedy", popupState.close);
                  }}
                >
                  Greedy
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button
                variant="contained"
                // color="primary"
                {...bindTrigger(popupState)}
              >
                {modifyNodes}
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    onClickModifyNodes(popupState.close, selectStart, "start");
                    setModifyNodes("Modify Start Node");
                  }}
                >
                  Modify Start Node
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onClickModifyNodes(popupState.close, selectGoal, "goal");
                    setModifyNodes("Modify Goal Node");
                  }}
                >
                  Set Goal Node
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onClickModifyNodes(popupState.close, selectWall, "walls");
                    setModifyNodes("Modify Walls");
                  }}
                >
                  Modify Walls
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onClickModifyNodes(popupState.close, selectBomb, "bombs");
                    setModifyNodes("Modify Bombs");
                  }}
                >
                  Modify Bombs
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>

        {/* </div> */}
        <Button variant="contained" color="primary" onClick={StartSearch}>
          {" "}
          Search{" "}
        </Button>
      </div>
      <div className="grid">
        {nodeIDs.map((row) => (
          <div className="row">
            {row.map(({ rowID, colID }) => (
              <div
                onClick={() => setNode(rowID, colID)}
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
                  .addEventListener("click", setNode(rowID, colID))} */}
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
