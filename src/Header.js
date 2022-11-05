import React from "react";
import Leaderboard from "./Leaderboard";
import { Select } from 'react';


export default function Header(props) {

  const [ showLeaderboard, setShowLeaderboard ] = React.useState(false);

  function showBoard(event) {
    setShowLeaderboard(!showLeaderboard);
  }

  function getDefaultOption() {
    return window.localStorage.length  === 0 ? 'hollywood' : JSON.parse(window.localStorage.getItem('currentLevel')).name;
  }
  

  // selected = { level[0] === getDefaultOption() ? true : false }

  return (
    <>
      <header>
        <a href="/">
          <h1>Waldomania</h1>
        </a>
        <ul className="levels">
           <form>
            <label>Choose level:
              <select
                id="select-level"
                value ={ getDefaultOption() }
                onChange = { props.levelChange }
              >
                {
                  [
                    ["hollywood", "Hollywood"],
                    ["olympics", "Olympics"],
                    ["space", "In space"],
                    ["green", "Vegetables"]
                  ].map(
                    (level) => {
                      return <option
                        key = { level[0] }
                        value={ level[0] }>
                          { level[1] }
                      </option>
                    }
                  )
                }
              </select>
            </label>
          </form>
        </ul>
        <div className="timer" data-seconds="0">
          { props.counterConverter(props.counter) }
        </div>
        <div className="leaderboard">
          Best time: { props.counterConverter(props.bestTime) } <a href="#leaderboard" id="rating" onClick={ showBoard }>Leaderboard</a>
        </div>
      </header>
      
      { showLeaderboard && <Leaderboard /> }
    </>
  )
}