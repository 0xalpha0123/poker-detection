import React from 'react';

const Button = (props) => {
  return (
    <button {...props} className='bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600'>
      {props.children}
    </button>
  );
}

export default Button;