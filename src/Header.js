import React from "react";

export default function Header(props) {
  return (
    <>
      <header>
        <h1>Waldomania</h1>
        <ul className="levels">
          <form>
            <label> Choose level:
              <select id="select-level" onChange = { props.levelChange }>
                <option value="hollywood">Hollywoood</option>
                <option value="olympics">Olympics</option>
                <option value="space">Space</option>
                <option value="green">Green</option>
              </select>
            </label>
          </form>
        </ul>
        <div className="timer">
          00:46
        </div>
        <div className="rating">
          <a href="#" id="rating">Rating</a>
        </div>
      </header>
    </>
  )
}