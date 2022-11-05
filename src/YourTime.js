import AskName from "./AskName";
export default function YourTime(props) {
  return (
    <div className="dark-background">
      <h2>Your time: { props.counterConverter(props.currentTime) }</h2>
      { props.showNameForm && <AskName
          saveNameChange = { props.saveNameChange }
          saveNameSubmit = { props.saveNameSubmit }
          leaderName = { props.leaderName }
       /> }
       {
         !props.showNameForm && <button onClick={ props.startNextLevel }>
           Next Level
         </button>
       }
    </div>
  );
}