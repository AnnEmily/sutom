import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import clsx from 'clsx';

import './CartridgeTop.scss';

interface CartridgeTopProps {
  /** Cartridge title */
  title: string,
  /** Icon type. Default : chevron */
  icon?: 'help' | 'chevron',
  /** React nodes to display on open */
  children? : React.ReactNode
}

/** Component to display title + help icon
 */
const CartridgeTop: React.FC<CartridgeTopProps> = (props) => {
  const compName = 'CartridgeTop';

  const [showHelp, setShowHelp] = useState(false);

  const getIcon = (): JSX.Element => {
    const { icon = 'chevron' } = props;

    const wantChevron = icon === 'chevron';
    const innerChild = wantChevron ? <Icon name='chevron down' size='small' /> : <Icon name='help circle' />;
    const iconClass = clsx('icon', wantChevron ? 'chevron' : 'help', showHelp && 'open');
    
    return (
      <div className={iconClass} onClick={() => setShowHelp(!showHelp)}>
        {innerChild}    
      </div>
    );
  }

  const { title, children } = props;
  const childClass = clsx('info', showHelp && 'visible');

  return (
      <div className={compName}>
        <div className='top'>
          <div className='title'>
            {title}
          </div>
          {children ? getIcon() : null}
        </div>
        <div className={childClass}>
          <div className='content'>
            {children}
          </div>
        </div>
      </div>
  );
}

export default CartridgeTop;
