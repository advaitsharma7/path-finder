// import React from "react";
import PriorityQueue from "../PriorityQueue.js";
import sscanf from "sscanf";

function Search(start_node, goal_node, GRID_ROWS, GRID_COLS) {
  let results = {
    path: [],
    path_cost: 0,
    frontier_count: 0,
    expanded_count: 0,
    visitedNodes: [],
  };
  debugger;
  let strategy = "ucs";
  if (strategy === "bfs") {
    let frontier = new PriorityQueue();
    let frontier_dir = new Map();
    //   let frontier_path_cost = new Map();
    let explored = new Map();
    let parent = new Map();
    frontier.add(nodeToString(start_node));
    frontier_dir.set(nodeToString(start_node), "start");
    //   frontier_path_cost.set(nodeToString( start_node), 0);
    parent.set(parentNodeToString(start_node, "start"), undefined);
    results.frontier_count += 1;
    if (start_node.row === goal_node.row && start_node.col === goal_node.col) {
      // results.frontier_count += 1;
      results.path.push(start_node);
      return results;
    }
    while (!frontier.isEmpty()) {
      // console.log(results.expanded_count, results.frontier_count);
      let node = stringToNode(frontier.pop());
      let nodeDir = frontier_dir.get(nodeToString(node));
      // console.log(node);
      explored.set(nodeToString(node), node);
      results.visitedNodes.push(node);
      results.expanded_count += 1;
      for (let i = 0; i < successors(node, GRID_ROWS, GRID_COLS).length; i++) {
        let successor = successors(node, GRID_ROWS, GRID_COLS)[i][0];
        let successorDir = successors(node, GRID_ROWS, GRID_COLS)[i][1];
        parent.set(
          parentNodeToString(successor, successorDir),
          parentNodeToString(node, nodeDir)
        );
        if (
          frontier.get(nodeToString(successor)) === -1 &&
          explored.get(nodeToString(successor)) === undefined
        ) {
          if (
            successor.row === goal_node.row &&
            successor.col === goal_node.col
          ) {
            // return results;
            let path_list = [];
            path_list.push(successor);
            let temp = parent.get(parentNodeToString(successor, successorDir));
            while (temp !== undefined) {
              path_list.push(stringToNode(temp));
              temp = parent.get(temp);
            }
            path_list.reverse();
            results.path = path_list;
            return results;
          } else {
            frontier.add(nodeToString(successor));
            frontier_dir.set(nodeToString(successor), successorDir);
            results.frontier_count += 1;
          }
        }
      }
    }
  }
  if (strategy === "ucs") {
    let frontier = new PriorityQueue();
    let frontier_dir = new Map();
    let frontier_path_cost = new Map();
    let explored = new Map();
    let parent = new Map();
    frontier.add(nodeToString(start_node));
    frontier_dir.set(nodeToString(start_node), "start");
    frontier_path_cost.set(nodeToString(start_node), 0);
    parent.set(parentNodeToString(start_node, "start"), undefined);
    results.frontier_count += 1;
    while (!frontier.isEmpty()) {
      let node = stringToNode(frontier.pop());
      let nodeDir = frontier_dir.get(nodeToString(node));
      // console.log(node);
      explored.set(nodeToString(node), node);
      results.visitedNodes.push(node);
      results.expanded_count += 1;
      if (node.row === goal_node.row && node.col === goal_node.col) {
        // return results;
        let path_list = [];
        path_list.push(node);
        let temp = parent.get(parentNodeToString(node, nodeDir));
        while (temp !== undefined) {
          path_list.push(stringToNode(temp));
          temp = parent.get(temp);
        }
        path_list.reverse();
        results.path = path_list;
        return results;
      }
      for (let i = 0; i < successors(node, GRID_ROWS, GRID_COLS).length; i++) {
        let successor = successors(node, GRID_ROWS, GRID_COLS)[i][0];
        let successorDir = successors(node, GRID_ROWS, GRID_COLS)[i][1];
        parent.set(
          parentNodeToString(successor, successorDir),
          parentNodeToString(node, nodeDir)
        );
        if (
          frontier.get(nodeToString(successor)) === -1 &&
          explored.get(nodeToString(successor)) === undefined
        ) {
          frontier.add(
            nodeToString(successor),
            frontier_path_cost.get(nodeToString(node)) + 1
          );
          frontier_path_cost.set(
            nodeToString(successor),
            frontier_path_cost.get(nodeToString(node)) + 1
          );
          frontier_dir.set(nodeToString(successor), successorDir);
          results.frontier_count += 1;
          frontier_dir.set(nodeToString(successor), successorDir);
        } else if (
          frontier.get(nodeToString(successor)) !== -1 &&
          frontier_path_cost.get(nodeToString(successor)) >
            frontier_path_cost.get(nodeToString(node)) + 1
        ) {
          frontier.add(
            nodeToString(successor),
            frontier_path_cost.get(nodeToString(node)) + 1
          );
          frontier_path_cost.set(
            nodeToString(successor),
            frontier_path_cost.get(nodeToString(node)) + 1
          );
          frontier_dir.set(nodeToString(successor), successorDir);
          frontier_dir.set(nodeToString(successor), successorDir);
        }
      }
    }
  }
}

function successors(node, GRID_ROWS, GRID_COLS) {
  let succ = [];
  let row = node.row;
  let col = node.col;
  if (row > 0) {
    succ.push([{ row: row - 1, col: col }, "down"]);
  }
  if (row < GRID_ROWS - 1) {
    succ.push([{ row: row + 1, col: col }, "up"]);
  }
  if (col > 0) {
    succ.push([{ row: row, col: col - 1 }, "left"]);
  }
  if (col < GRID_COLS - 1) {
    succ.push([{ row: row, col: col + 1 }, "right"]);
  }
  return succ;
}

function nodeToString(node) {
  return `${node.row}-${node.col}`;
}

function parentNodeToString(node, dir) {
  return `${node.row}-${node.col}-${dir}`;
}

function stringToNode(str) {
  let node = sscanf(str, "%d-%d", "row", "col");
  return node;
}

function parentStringToNode(str) {
  let node = sscanf(str, "%d-%d-%d", "row", "col", "num");
  return node;
}

export default Search;
