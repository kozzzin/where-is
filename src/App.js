import hollywoodImg from './imgs/waldo01.jpeg';
import olympicsImg from './imgs/waldo02.jpeg';
import spaceImg from './imgs/waldo03.jpeg';
import greenImg from './imgs/waldo04.jpeg';
import './App.css';
import React, {  } from 'react';
import CursorDiv from './CursorDiv';
import CursorExtra from './CursorExtra';
import Header from './Header.js';


/// LEFT SIDE BUG
// SHOW TOP OF IMAGE

function App() {
  const coordinates = [2110,830];
  const bgImgs = [
    {
      name: 'hollywood',
      img: hollywoodImg
    },
    {
      name: 'olympics',
      img: olympicsImg
    },
    {
      name: 'space',
      img: spaceImg
    },
    {
      name: 'green',
      img: greenImg
    },
  ];
  const [ secret, setSecret ] = React.useState([]);
  const [ cursorMenu, setCursorMenu ] = React.useState(false);
  const [ cursorPosition, setCursorPosition ] = React.useState({x:0,y:0});
  const [ cursorDisplay, setCursorDisplay ] = React.useState('none');
  const [ currentLevel, setCurrentLevel ] = React.useState(bgImgs[0]);


// BUG: when scroll, magnifier brreaks !!!!

  function getNaturalCoordinates(cursorPosition, currentImage) {
    const clickPositionX = cursorPosition.x;
    const naturalWidth = currentImage.naturalWidth;
    const currentWidth = currentImage.width;
    const naturalClickPosX = 
      (naturalWidth / currentWidth) * clickPositionX;

    const clickPositionY = cursorPosition.y;
    const naturalHeight = currentImage.naturalHeight;
    const currentHeight = currentImage.height;
    const naturalClickPosY = 
      (naturalHeight / currentHeight) * clickPositionY;
    
    return {
      x: naturalClickPosX,
      y: naturalClickPosY,
    }
  }


  React.useEffect(() => {
    console.log(cursorPosition.scroll);
    const currentImage = document.querySelector('.main-image');
    const naturalCoords = getNaturalCoordinates(cursorPosition,currentImage);

    document.querySelector('.cursor')
    .style.cssText = `
      display: ${cursorDisplay};
      top: ${cursorPosition.y}px;
      left: ${cursorPosition.x}px;
      background-image: url(${ currentLevel.img });
      background-position: -${naturalCoords.x-55}px -${naturalCoords.y-55-cursorPosition.scroll}px ;
    `;

  },[cursorPosition,cursorDisplay,currentLevel]);


  
  React.useEffect(() => {
    fetch('./hollyCoordinates.json')
      .then(response => response.json())
        .then(data => { 
          setSecret(data);
        });
  },[]);

  React.useEffect(() => {
    let moveListener = (event) => {
      moveCursor(event);
    };

    document.querySelector('.main-image')
      .addEventListener('mousemove', moveListener);
  },[]);


  function clickHandler(event) {
    const clickPosition = event.pageX;
    const naturalWidth = event.target.naturalWidth;
    const currentWidth = event.target.width;
    const naturalClickPosX = 
      (naturalWidth / currentWidth) * clickPosition;
    console.log((coordinates[0] - 50) < naturalClickPosX && naturalClickPosX < (coordinates[0] + 50));

    setCursorPosition({
      x: event.pageX,
      y: event.pageY,
      scroll: document.querySelector('.main-image').y
    });

    setCursorMenu(true);
  }



  function moveCursor(event) {
    console.dir(event.target);
    console.dir(event);
    setCursorPosition({
      x: event.pageX,
      y: event.pageY,
      scroll: document.querySelector('.main-image').y
    });
    setCursorDisplay('block');
  }

  function cursorMenuClick(event) {
    console.log(event.target.id);

    const answer = (character) => {
      return secret[currentLevel.name].find(
        (el) => el.name === character
      )
    }

    console.log(cursorPosition);

    const currentImage = document.querySelector('.main-image');
    const naturalCoords = getNaturalCoordinates(cursorPosition,currentImage);

    const trueOrNot = ((answer(event.target.id)['coord']['x'] - 50) < naturalCoords.x)
    && (naturalCoords.x < (answer(event.target.id)['coord']['x'] + 50)
    && (answer(event.target.id)['coord']['y'] - 50) < naturalCoords.y-cursorPosition.scroll)
    && (naturalCoords.y-cursorPosition.scroll < (answer(event.target.id)['coord']['y'] + 50));

    console.log(
      (
        trueOrNot
      )
    );

    console.log(answer(event.target.id));


    if (trueOrNot) {
      event.target.style.backgroundColor = 'green';
    } else {
      event.target.style.backgroundColor = 'red';
      setTimeout(()=>{
        event.target.style.backgroundColor = '';
      },500);
    }

    // CHECK IF 4 found, reset timer 
    // fix time
    // save to scoreboard if it is beaten
    


  }

  function cursorMenuClose(event) {
    setCursorMenu(false);
    moveCursor(event);
  }

  function levelChangeHandler(event) {
    console.log(event.target.value);
    const newImg = bgImgs.find(
      (el) => el.name === event.target.value
    );
    setCurrentLevel(newImg);
  }

  return (
    <>
      <div className="App">
        <Header
          levelChange = { levelChangeHandler }
        />
        <img 
          onClick={ clickHandler }
          // onMouseLeave = { () => {setCursorDisplay('none')} }
          src={ currentLevel.img }
          alt="waldo"
          className='main-image'
        />

        <p>{ console.log(secret[currentLevel.name]) }</p>

        <CursorDiv
          x = { cursorPosition.x  }
          y = { cursorPosition.y  }
          display = { cursorDisplay }
        />

        <CursorExtra
          currentTop = { cursorPosition.y }
          currentLeft = { cursorPosition.x }
          left = { 400 }
          top = { 400 }
          showMenu = { cursorMenu }
          setShowMenu = { setCursorMenu }
          subMenuClick = { cursorMenuClick }
          closeClick = { cursorMenuClose }
        />
        
      </div>


      
    </>
  );
}






export default App;
