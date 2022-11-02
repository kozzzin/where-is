import React from "react";

export default function Header(props) {
  function isSelected(currentValue) {
    console.log(currentValue === props.currentLevel);
    if (currentValue === props.currentLevel) {
      return true;
    } else {
      return '';
    }
  }
  return (
    <>
      <header>
        <h1>Waldomania</h1>
        <ul className="levels">
          <form>
            <label> Choose level:
              <select id="select-level" onChange = { props.levelChange }>
                <option selected = { isSelected('hollywood') }value="hollywood">Hollywoood</option>
                <option selected = { isSelected('olympics') } value="olympics">Olympics</option>
                <option selected = { isSelected('space') } value="space">Space</option>
                <option selected = { isSelected('green') } value="green">Green</option>
              </select>
            </label>
          </form>
        </ul>
        <div className="timer" data-seconds="0">
          { props.counterConverter(props.counter) }
        </div>
        <div className="rating">
          Best time: { props.counterConverter(props.bestTime) } <a href="#" id="rating">Rating</a>
        </div>
      </header>
    </>
  )
}