import React from "react";
import { MyContext } from "./App";
export default function Leaderboard(props) {

  const context = React.useContext(MyContext);
  
  // remove sort from rendering !!!
  return (
    <div className="leaderboard-table">
      <ul>
        { [...context.leaders]
          .map(
            (leader) => 
              <li key = { leader.name }>
                <span>{ leader.name }</span>
                <span>{ context.counterConverter(leader.time) }</span>
              </li>
          ) }
      </ul>
    </div>
  );
}