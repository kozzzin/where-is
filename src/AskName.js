export default function AskName(props) {
  return (
    <>
      <form
        id="ask-name"
        onSubmit={ props.saveNameSubmit }  
      >
        <input
          type="text"
          onChange = { props.saveNameChange }
          value={ props.leaderName }
          placeholder="your name" />
        <input type="submit" value="Save" />
      </form>
    </>
  );
}