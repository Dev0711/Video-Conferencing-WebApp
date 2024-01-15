import React from 'react';

export default function Room() {
  return (
    <>
      <div className="room-container">
        <form className='flex flex-col items-center gap-5' action="/auth/login" method="post">
          <h2>JOIN MEETING</h2>
          <div className="input-container">
            <input type="text" name="" placeholder='Meeting id' />
          </div>
          <div className="btn__container">
            <button className="btn join__btn w-full"> Join Meeting </button>
          </div>
          <h4>Don't have a meeting Id? <span className='cursor-pointer text-blue-400'>create</span></h4>
        </form>
      </div>
    </>
  );
}
