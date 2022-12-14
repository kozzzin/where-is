import hollywoodImg from './imgs/waldo01.jpeg';
import olympicsImg from './imgs/waldo02.jpeg';
import spaceImg from './imgs/waldo03.jpeg';
import greenImg from './imgs/waldo04.jpeg';
import './App.css';
import React, { useEffect } from 'react';
import ZoomCursor from './ZoomCursor';
import CursorExtra from './CursorExtra';
import Header from './Header.js';
import NextLevelTimer from './NextLevelTimer';
import YourTime from './YourTime';
import GameBoard from './GameBoard';
import { getCoordsFromBase, getLeadersForLevel, saveNewLevelLeaders } from './firebase';

export const MyContext = React.createContext('content');

function App() {
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

  const [ bestTimes, setBestTimes ] = React.useState([]);
  const [ levelBestTimes, setLevelBestTimes ] = React.useState([]);
  const [ bestTime, setBestTime ] = React.useState(0);
  const [ lastLeaderTime, setLastLeaderTime ] = React.useState(0);
  const [ currentTime, setCurrentTime ] = React.useState(0);
 
  const [ counter, setCounter ] = React.useState(0);
  const [ stopCounter, setStopCounter ] = React.useState(false);

  const [ rightAnswers, setRightAnswers ] = React.useState(0);
  const [ leaderName, setLeaderName ] = React.useState('');
  const [ showNameForm, setShowNameForm ] = React.useState(false);
  const [ showCountdown, setShowCountdown ] = React.useState(false);
  const [ showYourTime, setShowYourTime ] = React.useState(false);

  // LOAD COORDINATES OF CHARACTERS
  React.useEffect(() => {
    // fetch('./hollyCoordinates.json')
    //   .then(response => response.json())
    //     .then(data => { 
    //       setSecret(data);
    //     });

  },[]);


  // LOAD LEADERS SCOREBOARD
  React.useEffect(() => {
    // checkAtFirstLocalStorage for results !
    async function getLeaders(currentLevel) {
      getLeadersForLevel(currentLevel.name)
      .then((response) => {
        setBestTimes(response.times);
      })
    }

    if (currentLevel.name !== undefined) {
      getLeaders(currentLevel);
    }


    // if (localStorage.getItem("bestTimes") === null) {
    //   fetch('./bestTimes.json')
    //     .then(response => response.json())
    //       .then(data => {
    //         setBestTimes(data);
    //       });
    // } else {
    //   setBestTimes(
    //     JSON.parse(window.localStorage.getItem('bestTimes'))
    //     );
    // }
  },[currentLevel]);

  // SAVE UPDATED LEADERBOARD
  React.useEffect(() => {
    // if (bestTimes.length > 0) {
    //   window.localStorage.setItem(
    //     'bestTimes',
    //     JSON.stringify(bestTimes)
    //   );
    // }
    if (bestTimes.length > 0) {
      saveNewLevelLeaders(currentLevel.name, bestTimes);
    }
    console.log(bestTimes);
  }, [bestTimes]);


  // SET DATA FOR LEADERBOARD
  // SET LEVEL'S BEST TIME
  React.useEffect(() => {
    if (bestTimes.length <= 0) return;
    const times = 
      [
        ...bestTimes
      ]
        .sort((a,b) => a.time - b.time)
        .slice(0,10);
    setLevelBestTimes(times);
    setBestTime(times[0]['time']);
    setLastLeaderTime(times.slice(-1)[0]['time']);
  },[currentLevel, bestTimes]);


  // CHECK SAVED LEVEL
  React.useEffect(() => {
    let level = 
      JSON.parse(window.localStorage.getItem('currentLevel')) || levels[0];
    setCurrentLevel(level);
  }, []);


  // START NEW LEVEL
  React.useEffect(
    () => {
      setMarkersList([]);
      setCounter(0);
      setStopCounter(false);
      setRightAnswers(0);
      document.querySelectorAll('.green').forEach(
        green => {
          green.classList.remove('green');
        }
      );
    }, [currentLevel]
  );


  // CHECK IF GAME HAS ENDED
  React.useEffect(
    () => {
      if (isLevelFinished(rightAnswers)) {
        setCurrentTime(counter);
        setStopCounter(true);
      }
    }, [rightAnswers]
  );
  

  // CHECK SCORE
  React.useEffect(
    () => {
      if (currentTime > 0) setShowYourTime(true);
      checkBestTime(currentTime);
    }, [currentTime]
  );

  function counterConverter(counter) {
    return `${ String(Math.floor(counter / 60)).padStart(2,'0') }:${ String(Math.floor(counter % 60)).padStart(2,'0') }`
  }


  // CURSOR LOGIC
  function getNaturalCoordinates(cursorPosition, currentImage) {
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
    
    return {
      x: naturalClickPosX,
      y: naturalClickPosY,
    }
  }

  function moveCursor(event) {
    setCursorPosition({
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

  async function cursorMenuClick(event) {
    const character = await getRightAnswer(event.target.id);
    const characterFound = checkUserAnswer(character)

    if (characterFound) {
      event.target.classList.add('green');
      addFoundMarker(event.pageX,event.pageY);
      setRightAnswers(rightAnswers + 1);
      setCursorMenu(false);
    } else {
      event.target.style.backgroundColor = 'red';
      setTimeout(()=>{
        event.target.style.backgroundColor = '';
      },500);
    }
  }

  function addFoundMarker(x,y) {
    return setMarkersList(
      [ ...markersList, 
        {
          x: cursorPosition.x,
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


  // CHANGE LEVEL LOGIC
  async function getRightAnswer(character) {
    // const currentChar = secret[currentLevel.name].find(
    //   (el) => el.name === character
    // );

    const currentChar = await getCoordsFromBase(currentLevel.name, character);

    return  {
      x: currentChar['coord']['x'],
      y: currentChar['coord']['y'],
    }
  }

  function checkUserAnswer(character) {
    const currentImage = document.querySelector('.main-image');
    const naturalCoords = getNaturalCoordinates(cursorPosition,currentImage);
    return (
      (character.x - 50) < naturalCoords.x)
        && (naturalCoords.x < (character.x + 50)
        && (character.y - 50) < naturalCoords.y)
        && (naturalCoords.y < (character.y + 50)
    );
  }

  function changeLevel(level) {
    setShowCountdown(true);
    window.localStorage.setItem('currentLevel', JSON.stringify(level));
    setTimeout(() => {setCurrentLevel(level);}, 6000);
  }

  function levelChangeHandler(event) {
    const level = levels.find(
      (el) => el.name === event.target.value
    );
    
    changeLevel(level);
  }


  // END LEVEL LOGIC
  function isLevelFinished(answers) {
    if (answers === 4) {
      return true;
    }
    return false;
  }

  function checkBestTime(current) {
    if (current < lastLeaderTime) {
      setShowNameForm(true);
    }
  }

  function saveNameChange(event) {
    setLeaderName(event.target.value);
  }

  function startNextLevel() {
    changeLevel(findNextLevel());
    setShowNameForm(false);
    setShowYourTime(false);
  }

  function getUniqId() {
    return Date.now().toString().slice(-4);
  }

  function saveNameSubmit(event) {
    event.preventDefault();
    const checkedLeadername = leaderName == '' ? 
      `Anonymus ${getUniqId()}` : leaderName;
    setBestTimes(oldBests => 
      [...oldBests, {name: checkedLeadername, time: currentTime}]
      
      // oldBests.map(
      // (oldBest) => {
      //   return oldBest.level === currentLevel.name ? 
      //     {...oldBest, times: [...oldBest.times, {name: checkedLeadername, time: currentTime}] } :
      //     {...oldBest, times: oldBest.times };
);
    startNextLevel();
  }

  function findNextLevel() {
    const currentIndex =
      levels.findIndex(lev => lev.name === currentLevel.name);
    if (currentIndex < levels.length - 1) {
      return levels[[currentIndex + 1]];
    }
    return levels[0];
  }

  return (
    <>
      <div className="App">
        { showCountdown && <NextLevelTimer setShowCountdown = { setShowCountdown } showCountdown = { showCountdown } /> }

        <MyContext.Provider
          value={
            {
              counterConverter: counterConverter,
              leaders: levelBestTimes,
              currentLevelName: currentLevel.name,
            }
          }>
          <Header
            levelChange = { levelChangeHandler }
            currentLevel = { currentLevel.name }
            counter = { counter }
            stopCounter = { stopCounter }
            setCounter = { setCounter }
            counterConverter = { counterConverter }
            bestTime = { bestTime }
          />
        </MyContext.Provider>


        <GameBoard
          currentLevel = { currentLevel }
          moveCursor = { moveCursor }
          clickHandler = { clickHandler }
          markersList = { markersList }
        />

        <ZoomCursor
          x = { cursorPosition.x  }
          y = { cursorPosition.y  }
          display = { cursorDisplay }
          currentLevel = { currentLevel }
          cursorDisplay = { cursorDisplay }
          cursorPosition = { cursorPosition }
          getNaturalCoordinates = { getNaturalCoordinates }
        />

        <CursorExtra
          currentTop = { cursorPosition.y }
          currentLeft = { cursorPosition.x }
          showMenu = { cursorMenu }
          setShowMenu = { setCursorMenu }
          subMenuClick = { cursorMenuClick }
          closeClick = { cursorMenuClose }

        />

        {
          showYourTime && 
            <YourTime
            saveNameChange = { saveNameChange }
            saveNameSubmit = { saveNameSubmit }
            leaderName = { leaderName }
            currentTime = { currentTime }
            showNameForm = { showNameForm }
            counterConverter = { counterConverter }
            startNextLevel = { startNextLevel }
          />
        }

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