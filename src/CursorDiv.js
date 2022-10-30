export default function CursorDiv(props) {
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