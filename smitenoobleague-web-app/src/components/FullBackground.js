import React from 'react';
// Full page responsive background image
const bgStyle = {
    minHeight: '100%',
    minWidth: ' 1024px',
    width: '100%',
    height: 'auto',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '-1',
  };

export default function FullBackground(props) {

  return (
    <img src={props.src} style={bgStyle} />
  );
}