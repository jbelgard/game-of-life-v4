import React, { useState, useCallback, useRef } from 'react';
import produce from "immer";
import "./App.css";

const operations = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 0],
  [1, 0],
]

const numRows = 30;
const numCols = 42;

const App = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const effer = [1, 2, 3, 4, 5, 6, 7, 8];

  const symmetry = (arr, x) => {
    const newArr = [];
    let half = arr / 2;
    console.log("Half", half);
    let res = 0;
    if (x > half) {
      let x2 = x - half;
      let x3 = half - x2;
      res = x3
      newArr.push(x, x3);
    } else if (x < half) {
      let x2 = half - x;
      let x3 = half + x2;
      res = x3
      newArr.push(x, x3);
    } else {
      newArr.push(x);
      res = half
    }
    return [x, res]
  };
  
  const makeEmptyGrid = () => {
    const rows = [];  
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  };

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const speeds = {med : 100, fast : 10, slow : 1000};
  const [speed, setSpeed] = useState(100);

  const speedRef = useRef(speed);
  speedRef.current = speed;

  console.log("Speed", speed)
  
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >=0 && newK < numCols) {
                neighbors += g[newI][newK]
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;              
            } else if (g[i][k] === 0 && neighbors === 3) gridCopy[i][k] = 1;
          }
        }        
      });
    });
    setTimeout(runSimulation, speeds[speedRef.current]);
  }, [])

  const [color, setColor] = useState ('red')
  const colors = ['red', 'orange', 'yellow', 'yellowgreen', 'blue', 'white', 'magenta', 'cyan', 'chartreuse', 'black'];

  return (
    <>
    <div>
      <h1>Conway's Game of Life</h1>
      <h4>By Jason Belgard</h4>
    </div>
      <button
        onClick = {() => {
          setRunning(!running);
          if(!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick = {() => {
          setGrid(makeEmptyGrid);
        }}
      >
        Clear Grid
      </button>
      <button
        onClick = {() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0))
            );
          }
          setGrid(rows);
        }}
      >
        Random
      </button>

      <button
        onClick = {() => {
          const glider = [];
          const rows2 = [];
          for (let i = 0; i < numRows; i++) {
            glider.push(Array.from(Array(numCols), () => 0));
          }
          glider [1][1] = glider [2][2] = glider [3][2] = glider[3][1] = glider [3][0] = 1;
          glider [1][40] = glider [2][39] = glider [3][40] = glider [3][41] = 1;
          console.log("glider", glider);
          setGrid(glider);
        }}
      >
        Glider
      </button>

      <button
        onClick = {() => {
          const glider = [];
          for (let i = 0; i < numRows; i++) {
            glider.push(Array.from(Array(numCols), () => 0));
          }
          glider[2][21] = glider[3][21] = glider[3][20] = glider[4][22] = glider[4][23] = glider[4][24] = glider[4][20] = glider[4][19] = glider[4][18] = glider[5][24] = glider[5][18] = glider[6][24] = glider[6][18] = glider[6][25] = glider[6][17] = glider[7][25] = glider[7][17] = glider[7][26] = glider[7][16] = glider[6][17] = glider[8][25] = glider[8][24] = glider[8][18] = glider[8][17] = glider[9][18] = glider[9][24] = glider[10][18] = glider[10][19] = glider[10][20] = glider[10][24] = glider[10][23] = glider[10][22] = glider[11][20] = glider[11][21] = glider[11][22] = glider[12][21] = 1;
          setGrid(glider);
        }}
      >
        Box
      </button>

      <button
        onClick = {() => {

         let arr= []
          let g =  symmetry(numRows, 15) 
          let z = symmetry(numCols,21)
          let [gOne, gTwo] = g
          let[zOne, zTwo] = z
           console.log('G', gOne +=1, "Z", z)
          for ( let i = 0; i<numRows; i ++) {
           arr.push(Array.from(Array(numCols), () => 0));
           }

            arr[gOne][zOne] = arr[gTwo][zTwo] = arr[gOne+=1][zOne+=1] = arr[gTwo+=1][zTwo+=1] = arr[gOne+=1][zOne+=1] = arr[gTwo+=1][zTwo+=1] = arr[gOne+=1][zOne+=1] = arr[gTwo+=1][zTwo+=1] = arr[gOne][zOne] = arr[gTwo][zTwo] = arr[gOne+=1][zOne+=1] = arr[gTwo+=1][zTwo+=1] = arr[gOne+=1][zOne+=1] = arr[gTwo+=1][zTwo+=1] = arr[gOne+=1][zOne+=1] = arr[gTwo+=1][zTwo+=1] = 1;
           setGrid(arr);
        }}
      >
        Test
      </button>
      
      <form type = "submit" className = "colors">
        <label htmlFor = "color">
          <h4 style = {{ color: `$color}`}}>Color</h4>
          <select
            id = "type"
            value = {color}
            onChange = {(e) => setColor(e.target.value)}
          >
            <option style = {{ color: `${color}` }}> {color.color}</option>
            {colors.map((color) => (
              <option
                style = {{ backgroundColor: `${color}` }}
                key = {color}
                value = {color}
              >
                {color}
              </option>
            ))}
          </select>
        </label>
      </form>
      <form type = "submit" className = "speedForm">
        <label htmlFor = "speed">
          <h3>Speed</h3>
          <select
            id = "type"
            value = {speed}
            onChange = {(e) => setSpeed(e.target.value)}
          >
            <option value = {speed.med}>Medium</option>
            <option value = {speed.fast}>Fast</option>
            <option value = {speed.slow}>Slow</option>
          </select>
        </label>
      </form>

      <div
        style = {{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,          
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key = {`${i} - ${k}`}
              onClick = {() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style = {{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? `${color}` : undefined,
                border: "solid 1px black",
              }}
            />            
          )))}
      </div>
      <div>
        <h3>The Rules of the Game of Life</h3>
      </div>
    </>
  );
};

export default App
