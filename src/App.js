import hollywoodImg from './imgs/waldo01.jpeg';
import olympicsImg from './imgs/waldo02.jpeg';
import spaceImg from './imgs/waldo03.jpeg';
import greenImg from './imgs/waldo04.jpeg';
import './App.css';
import React, {  } from 'react';
import CursorDiv from './CursorDiv';
import CursorExtra from './CursorExtra';
import Header from './Header.js';
import FoundMarker from './FoundMarker';

function App() {

  // next level switch!!!!
  const levels = [
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
  const [ currentLevel, setCurrentLevel ] = React.useState({});
  const [ markersList, setMarkersList ] = React.useState([]);
  const [ counter, setCounter ] = React.useState(0);
  const [ rightAnswers, setRightAnswers ] = React.useState(0);
  const [ bestTime, setBestTime ] = React.useState(0);
  const [ currentTime, setCurrentTime ] = React.useState(0);
  const [ bestTimes, setBestTimes ] = React.useState([]);


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
    console.log('CHECKING SAVED LEVEL');
    if (window.localStorage.length === 0) return;
    const savedLevel = JSON.parse(window.localStorage.getItem('currentLevel'));
    if (Object.keys(savedLevel).length === 0) return;
    setCurrentLevel(savedLevel);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    // end counter on finished time
    // stop counter on game finish

    return () => clearInterval(interval);
  },[])

  React.useEffect(() => {

    const currentImage = document.querySelector('.main-image');
    const naturalCoords = getNaturalCoordinates(cursorPosition,currentImage);

    document.querySelector('.cursor')
      .style.cssText = `
        display: ${cursorDisplay};
        top: ${cursorPosition.y}px;
        left: ${cursorPosition.x}px;
        background-image: url(${ currentLevel.img });
        background-position: ${-1 * (naturalCoords.x-50)}px -${naturalCoords.y-50-(cursorPosition.scroll < 0 ? cursorPosition.scroll + 25 : cursorPosition.scroll )}px ;
      `;


    // ON PAGE RELOAD --> save curent level --> add router?
    // CLEAR OR STYLES ON CURSOR SUBMENU

  },[cursorPosition,cursorDisplay,currentLevel]);





  // React.useEffect(
  //   () => {
      
  //   }, [currentLevel]
  // )

  React.useEffect(
    () => {
      if (isLevelFinished(rightAnswers)) {
        alertCounter();
        setCurrentTime(counter);
      }
    }, [rightAnswers]
  );

  React.useEffect(
    () => {
      checkBestTime(currentTime);
    }, [currentTime]
  );

  React.useEffect(
    () => {
      setMarkersList([]);
      setCounter(0);
      setRightAnswers(0);
    }, [currentLevel]
  );
  
  React.useEffect(() => {
    fetch('./hollyCoordinates.json')
      .then(response => response.json())
        .then(data => { 
          setSecret(data);
        });
  },[]);

  React.useEffect(() => {
    // add names of winners to json
    fetch('./bestTimes.json')
    .then(response => response.json())
      .then(data => {
        setBestTimes(data);
      });
  },[]);

  React.useEffect(() => {
    if (bestTimes.length <= 0) return;

    const level = currentLevel.name;
    const time = 
      [
        ...bestTimes.find(el => el.level === level).times
      ].sort((a,b) => a - b);
    
      setBestTime(time[0]);

  },[currentLevel, bestTimes]);

  function checkBestTime(current) {
    if (current < bestTime) {
      // ask name
      // const name = prompt('What is your name?');
      // console.log(name, counterConverter(current));
      // render new time
      // setBestTime(current);
      setBestTimes(oldBests => oldBests.map(
        (oldBest) => {
          return oldBest.level === currentLevel.name ? 
            {...oldBest, times: [...oldBest.times, current] } :
            {...oldBest, times: oldBest.times };
        }
      ));
      // write new time save
      // update and save bestTimes
    }
  }


  function counterConverter(counter) {
    return `${ String(Math.floor(counter / 60)).padStart(2,'0') }:${ String(Math.floor(counter % 60)).padStart(2,'0') }`
  }

  function alertCounter() {
    alert(`your time ${counterConverter(counter)}`);
  }

  function isLevelFinished(answers) {
    if (answers === 4) {
      return true;
    }
    return false;
  }

  function moveCursor(event) {
    setCursorPosition({
      x: event.pageX,
      y: event.pageY,
      scroll: document.querySelector('.main-image').y
    });
    setCursorDisplay('block');
  }

  function clickHandler(event) {
    setCursorPosition({
      x: event.pageX,
      y: event.pageY,
      scroll: document.querySelector('.main-image').y
    });

    setCursorMenu(true);
  }

  function cursorMenuClick(event) {
    const getRightAnswer = (character) => {
      const currentChar = secret[currentLevel.name].find(
        (el) => el.name === character
      );
      return  {
        x: currentChar['coord']['x'],
        y: currentChar['coord']['y'],
      }
    }

    const checkUserAnswer = (character) => {
      const currentImage = document.querySelector('.main-image');
      const naturalCoords = getNaturalCoordinates(cursorPosition,currentImage);
      return (
        (character.x - 50) < naturalCoords.x)
          && (naturalCoords.x < (character.x + 50)
          && (character.y - 50) < naturalCoords.y-cursorPosition.scroll)
          && (naturalCoords.y-cursorPosition.scroll < (character.y + 50)
      );
    }

    const character = getRightAnswer(event.target.id);
    const characterFound = checkUserAnswer(character)

    if (characterFound) {
      event.target.style.backgroundColor = 'green';
      event.target.style.cursor = 'none';
      addFoundMarker(event.pageX,event.pageY);
      setCursorMenu(false);
      setRightAnswers(rightAnswers + 1);
    } else {
      event.target.style.backgroundColor = 'red';
      setTimeout(()=>{
        event.target.style.backgroundColor = '';
      },500);
    }
    // CHECK IF 4 found, reset timer 
    // fix time
    // save to scoreboard if it is beaten
    // we're saving time for current level
  }

  function addFoundMarker(x,y) {
    return setMarkersList(
      [ ...markersList, 
        {
          x: cursorPosition.x,
          y: cursorPosition.y - cursorPosition.scroll / 2,
          zoomX: document.querySelector('.main-image').width,
          zoomY: document.querySelector('.main-image').height,
        }
      ]);
  }

  function cursorMenuClose(event) {
    setCursorMenu(false);
    moveCursor(event);
  }

  function levelChangeHandler(event) {
    const level = levels.find(
      (el) => el.name === event.target.value
    );
    window.localStorage.setItem('currentLevel', JSON.stringify(level));
    setCurrentLevel(level);
  }

  return (
    <>
      <div className="App">
        <Header
          levelChange = { levelChangeHandler }
          currentLevel = { currentLevel.name }
          counter = { counter }
          counterConverter = { counterConverter }
          bestTime = { bestTime }
        />
        <div className='img-container'>

          <img 
            onClick={ clickHandler }
            src={ currentLevel.img }
            alt="waldo"
            className='main-image'
            onMouseMove={ moveCursor }
          />

          { markersList.map(
          (marker) => {
            return (
              <FoundMarker
                left = { marker.x }
                top = { marker.y }
                zoomX = { marker.zoomX }
                zoomY = { marker.zoomY }
                hover = { moveCursor }
              />
            );
          }
        ) }
        </div>

        <CursorDiv
          x = { cursorPosition.x  }
          y = { cursorPosition.y  }
          display = { cursorDisplay }
        />

        <CursorExtra
          currentTop = { cursorPosition.y }
          currentLeft = { cursorPosition.x }
          // left = { 400 }
          // top = { 400 }
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


  // MARK NEW CHARACTERS ON NEW MAPS
  // const [coordinates,setCoordinates] = React.useState([]);

    // const currentImage = document.querySelector('.main-image');
    // const naturalCoords = getNaturalCoordinates(cursorPosition,currentImage);
    // console.log(naturalCoords);

    // setCoordinates([
    //   ...coordinates,
    //   {
    //     name: "",
    //     coord: {
    //       x: Math.floor(naturalCoords.x),
    //       y: Math.floor(naturalCoords.y),
    //     }
    //   }
    // ]);

    // console.log(coordinates);