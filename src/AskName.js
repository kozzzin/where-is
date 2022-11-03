export default function AskName(props) {
  return (
    <div className="ask-name">
      <form
        id="ask-name"
        onSubmit={ props.saveNameSubmit }  
      >
        <h2>Save result:</h2>
        <input
          type="text"
          onChange = { props.saveNameChange }
          value={ props.leaderName }
          placeholder="your name" />
        <input type="submit" value="Save" />
      </form>
    </div>
  );
}