import React from "react";
import Leaderboard from "./Leaderboard";

export default function Header(props) {

  const [ showLeaderboard, setShowLeaderboard ] = React.useState(false);

  function showBoard(event) {
    setShowLeaderboard(!showLeaderboard);
  }

  function isSelected(currentValue) {
    console.log(currentValue === props.currentLevel);
    if (currentValue === props.currentLevel) {
      return true;
    } else {
      return '';
    }
  }



  function getCurrentLevel() {
    try {
      return JSON.parse(window.localStorage.getItem('currentLevel')).name;
    } catch(err) {
      console.log(err);
      return 'hollywood';
    }
  }

  return (
    <>
      <header>
        <h1>Waldomania</h1>
        <ul className="levels">
          <form>
            <label> Choose level:
              <select
                id="select-level"
                defaultValue={ getCurrentLevel() }
                onChange = { props.levelChange }
              >
                <option value="hollywood">Hollywoood</option>
                <option value="olympics">Olympics</option>
                <option value="space">Space</option>
                <option value="green">Green</option>
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