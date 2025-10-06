import React from 'react';

function TestApp() {
  return React.createElement('div', {
    style: {
      backgroundColor: 'red', 
      padding: '50px', 
      color: 'white',
      fontSize: '30px',
      textAlign: 'center'
    }
  }, 'REACT FUNCIONA!!!');
}

export default TestApp