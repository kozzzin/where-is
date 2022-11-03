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
import AskName from './AskName';

export const MyContext = React.createContext('content');

// !!! Keep track of how long it takes between when the photo is first loaded and when the user finally identifies all characters (do this on the server side otherwise the user could hack their score).

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
  const [ levelBestTimes, setLevelBestTimes ] = React.useState([]);
  const [ stopCounter, setStopCounter ] = React.useState(false);
  const [ leaderName, setLeaderName ] = React.useState('');
  const [ showNameForm, setShowNameForm ] = React.useState(false);

  function getNaturalCoordinates(cursorPosition, currentImage) {
    // use scroll position !!!
    const clickPositionX = cursorPosition.x;
    const naturalWidth = currentImage.naturalWidth;
    const currentWidth = currentImage.width;
    const naturalClickPosX = 
      (naturalWidth / currentWidth) * clickPositionX;

    const clickPositionY = cursorPosition.yOffset;
    const naturalHeight = currentImage.naturalHeight;
    const currentHeight = currentImage.height;
    const naturalClickPosY = 
      (naturalHeight / currentHeight) * clickPositionY;

      // console.log(naturalHeight,currentHeight);
      // console.log(naturalClickPosX, naturalClickPosY)
    
    return {
      x: naturalClickPosX,
      y: naturalClickPosY,
    }
  }

  React.useEffect(() => {
    console.log('CHECKING SAVED LEVEL');
    if (window.localStorage.length === 0) {
      setCurrentLevel(levels[0]);
      return;
    }
    const savedLevel = JSON.parse(window.localStorage.getItem('currentLevel'));
    if (Object.keys(savedLevel).length === 0)  {
      setCurrentLevel(levels[0]);
      return;
    }
    setCurrentLevel(savedLevel);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    if (stopCounter) {
      clearInterval(interval);
    }
    // end counter on finished time
    // stop counter on game finish

    return () => clearInterval(interval);
  },[stopCounter])

  React.useEffect(() => {
    document.querySelector('.cursor')
      .style.backgroundImage = `url(${ currentLevel.img })`;
  },[currentLevel]);

  React.useEffect(() => {

    const currentImage = document.querySelector('.main-image');
    const naturalCoords = getNaturalCoordinates(cursorPosition,currentImage);

    
    // SCROLL PROBLEM WITH SAFARI !!!
    // SAFARI: when save name see cursor -> hide cursor
    // if not save result, it will be seen on next level too -> close name modal
    // compare my result with worst result for now -> on page or not --> saving to list --> give names to anonyms --> anonym + datetime !!

    const cursor = document.querySelector('.cursor');
    cursor.style.display = `${cursorDisplay}`;
    cursor.style.top = `${cursorPosition.y}px`;
    cursor.style.left = `${cursorPosition.x}px`;
    cursor.style.backgroundPosition = `
      ${ Math.floor( -1 * (naturalCoords.x - 50)) }px
      ${ -1 *
        Math.floor(
          naturalCoords.y-50
          // naturalCoords.y - 50 -
          //   (
          //     cursorPosition.scroll < 0 ?
          //       cursorPosition.scroll + 25 + 50 : cursorPosition.scroll
          //   )
        )
        }px`;

    // USE SCROLL ON natural coordinates, because we couldn't check answer

    // document.querySelector('.cursor')
    //   .style.cssText = `
    //     background-position: ${ Math.floor( -1 * (naturalCoords.x-50)) }px -${ Math.floor(naturalCoords.y-50-(cursorPosition.scroll < 0 ? cursorPosition.scroll + 25 : cursorPosition.scroll )) }px ;
    // //   `;

  },[cursorPosition,cursorDisplay]);


  React.useEffect(
    () => {
      if (isLevelFinished(rightAnswers)) {
        alertCounter();
        setCurrentTime(counter);
        setStopCounter(true);
        // next level !
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
      document.querySelectorAll('.green').forEach(
        green => {
          green.classList.remove('green');
        }
      );
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
    const times = 
      [
        ...bestTimes.find(el => el.level === level).times
      ].sort((a,b) => a.time - b.time);

    console.log(times);
    console.log(times);

    setLevelBestTimes(times);
    setBestTime(times[0]['time']);

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
      setShowNameForm(true);
      // write new time save
      // update and save bestTimes

          // save to scoreboard if it is beaten
    // we're saving time for current level
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
    // console.log('y top scroll', document.querySelector('.main-image').y);
    // console.dir(document.querySelector('.main-image'));
    // console.log('PAGEY YYY',event.pageY);
    // console.dir(event);
    // console.log(event.nativeEvent.offsetY);
    // console.log('simple top scroll', document.scrollTop);
    setCursorPosition({
      // x: event.pageX,
      // y: event.pageY,
      x: event.pageX,
      y: event.pageY,
      yOffset: event.nativeEvent.offsetY,
      scroll: document.querySelector('.main-image').y
    });
    setCursorDisplay('block');
  }

  function clickHandler(event) {
    setCursorPosition({
      x: event.pageX,
      y: event.pageY,
      yOffset: event.nativeEvent.offsetY,
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
          && (character.y - 50) < naturalCoords.y)
          && (naturalCoords.y < (character.y + 50)
          // && (character.y - 50) < naturalCoords.y-cursorPosition.scroll)
          // && (naturalCoords.y-cursorPosition.scroll < (character.y + 50)
      );
    }

    const character = getRightAnswer(event.target.id);
    const characterFound = checkUserAnswer(character)

    if (characterFound) {
      event.target.classList.add('green');
      addFoundMarker(event.pageX,event.pageY);
      setCursorMenu(false);
      setRightAnswers(rightAnswers + 1);
    } else {
      event.target.style.backgroundColor = 'red';
      setTimeout(()=>{
        event.target.style.backgroundColor = '';
      },500);
    }
  }

  // MARKER BUG: with scroll it puts scroll higher !!!!

  function addFoundMarker(x,y) {
    return setMarkersList(
      [ ...markersList, 
        {
          x: cursorPosition.x,
          // y: cursorPosition.y - cursorPosition.scroll / 2,
          y: cursorPosition.yOffset,
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

  function saveNameChange(event) {
    setLeaderName(event.target.value);
  }

  function saveNameSubmit(event) {
    // store result
    // save name
    // update everywhere
    event.preventDefault();
    console.log(leaderName);
    setShowNameForm(false);
    // NEXT LEVEL !
  }

  return (
    <>
      <div className="App">
        <MyContext.Provider
          value={
            {
              counterConverter: counterConverter,
              leaders: levelBestTimes,
              // leaders: [
              //   {
              //     name: 'Vitalii',
              //     time: 35
              //   },
              //   {
              //     name: 'Elon Musk and Some Really Long Name to Hold',
              //     time: 90
              //   },
              //   {
              //     name: 'Bill Gates',
              //     time: 70
              //   },
              //   {
              //     name: 'Bob Square Pants',
              //     time: 120
              //   }
              // ]
            }
          }>
          <Header
            levelChange = { levelChangeHandler }
            currentLevel = { currentLevel.name }
            counter = { counter }
            counterConverter = { counterConverter }
            bestTime = { bestTime }
          />
        </MyContext.Provider>

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

        {
          showNameForm &&  <AskName
          saveNameChange = { saveNameChange }
          saveNameSubmit = { saveNameSubmit }
          leaderName = { leaderName }
         />
        }

        { /* SAVE RESULT OF TIME WITH NAME + LOCALSTOPRAGE  */ }

        
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