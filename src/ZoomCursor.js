import React from "react";

export default function ZoomCursor(props) {

  // INIT ZOOM LENS
  React.useEffect(() => {
    document.querySelector('.cursor')
      .style.backgroundImage = `url(${ props.currentLevel.img })`;
  },[props.currentLevel]);

  // ZOOM LENS LOGIC
  React.useEffect(() => {
    const currentImage = document.querySelector('.main-image');
    const naturalCoords = props.getNaturalCoordinates(props.cursorPosition,currentImage);
    const cursor = document.querySelector('.cursor');
    cursor.style.display = `${props.cursorDisplay}`;
    cursor.style.top = `${props.cursorPosition.y}px`;
    cursor.style.left = `${props.cursorPosition.x}px`;
    cursor.style.backgroundPosition = `
      ${ -1 * (naturalCoords.x - 50) }px
      -${naturalCoords.y-50}px`;
  },[
    props.cursorPosition,
    props.cursorDisplay
  ]);

  return (
    <>
    <div
      className='cursor'
      style={ {
        'display': props.display,
        'top': `${props.y - 50}px`,
        'left': `${props.x - 50}px`,
      } }  
    />
    </>
  );
}