import React from "react";
import FoundMarker from "./FoundMarker";

export default function GameBoard(props) {

  return (
    <div className='img-container'>
      <img 
        src={ props.currentLevel.img }
        alt="waldo game"
        className='main-image'
      />
      { props.markersList.map(
          (marker) => {
            return (
              <FoundMarker
                key =  { marker.x }
                left = { marker.x }
                top = { marker.y }
                zoomX = { marker.zoomX }
                zoomY = { marker.zoomY }
                hover = { props.moveCursor }
              />
            );
          }
      ) }
      <div 
        className='img-move'
        onMouseMove={ props.moveCursor }
        onClick={ props.clickHandler } 
      />
    </div>
  );
}