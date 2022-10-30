export default function CursorExtra(props) {
  const renderConfig = [
    {
      classes: 'cursor-extra-circle clock-12-circle',
      style: '',
      content: '',
      id: 'waldo',
      click: false,
    },
    {
      classes: 'cursor-extra-circle clock-14-circle',
      style: '',
      content: '',
      id: 'odlaw',
      click: false,
    },   
    {
      classes: 'cursor-extra-circle clock-16-circle',
      style: '',
      content: '',
      id: 'wilma',
      click: false,
    },
    {
      classes: 'cursor-extra-circle clock-18-circle',
      style: '',
      content: '',
      id: 'wizard',
      click: false,
    },
    {
      classes: 'cursor-extra-circle clock-20-circle',
      style: '',
      content: 'X',
      id: 'close-menu',
      click: props.closeClick,
    },
    {
      classes: 'cursor-extra-circle clock-22-circle',
      style: '',
      content: 'time',
      id: 'timer',
      click: false,
    }
  ];
  return (
    <>
      <div
        className='extra-cursors'
        style = {
          {
            'top': `${props.currentTop || props.top}px`,
            'left': `${props.currentLeft || props.left}px`,
            'display': `${props.showMenu ? 'flex' : 'none'}`
          }
        }
        onMouseLeave = {
          (event) => {
            props.setShowMenu(false);
          }  
        }
      >
        <div 
          style = {
            {
              'display': `${props.showMenu ? 'flex' : 'none'}`
            }
          }
          className='extra-cursors-inner'
        >
          { 
            renderConfig.map(
              (config) => {
                return (
                  <div
                    key = { config.classes }
                    className={config.classes}
                    id = {config.id}
                    onClick = {
                      config.click ? config.click : props.subMenuClick
                    }
                    style = {
                      {
                        'top': `${90}px`,
                        'left': `${78}px`,
                      }
                    }
                  >
                    { config.content }
                  </div>
                );
              }
            )
          }
        </div>
      </div>
    </>
  );
}