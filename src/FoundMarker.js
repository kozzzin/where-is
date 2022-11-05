import React from "react";

export default function FoundMarker(props) {
  return (
    <div 
      className="found-marker"
      onMouseMove={ props.hover }
      // trouble on hover !!!
      style = {
        {
          "top": `
            ${((props.top) * document.querySelector('.main-image').height / props.zoomY - 55) / document.querySelector('.main-image').height * 100}%
          `,
          "left": `
            ${((props.left) * document.querySelector('.main-image').width / props.zoomX -55  ) / document.querySelector('.main-image').width * 100}%
          `,
        }
      }  
      />
  );
}