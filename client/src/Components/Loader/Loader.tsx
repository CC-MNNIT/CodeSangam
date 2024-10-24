import React from 'react';
import './Loader.css'; // Assuming you have some CSS to style this

export default function Loader() {
  return (
    <div id="universe">
      <div id="galaxy">
        <div className="circle"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} id={`orbit${i}`}>
            <div id={`pos${i}`}>
              <div id={`dot${i}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

