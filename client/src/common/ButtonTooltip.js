import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

 class ButtonTooltip extends Component {
  render() {
    const {tooltip_text, 
      btn_text, 
      btn_icon,
      placement,
      type,
      btn_style,
    } = this.props;
    return (
      <div>
        {
          tooltip_text !== null ? 
          <OverlayTrigger key={placement} placement={placement}
            overlay={
              <Tooltip>
                {tooltip_text}
              </Tooltip>
            }>
            <button className={'btn ' + btn_style} type={type} >
              {btn_icon}{btn_text}
            </button>
          </OverlayTrigger>
        :
          <button className={'btn ' + btn_style} type={type} >
            {btn_icon}{btn_text}
          </button>
        }
      </div>
    )
  }
}

export default ButtonTooltip;
