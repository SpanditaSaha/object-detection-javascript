import React, { useState } from 'react';

const ObjectSizeMeasurement = () => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    setEndPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleMouseDown = (event) => {
    setStartPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = (event) => {
    setEndPos({ x: event.clientX, y: event.clientY });
  };

  const calculateDistance = () => {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <p>Touch or click on the object to measure its size.</p>
      {startPos.x !== 0 && startPos.y !== 0 && endPos.x !== 0 && endPos.y !== 0 && (
        <p>Distance: {calculateDistance().toFixed(2)} pixels</p>
      )}
    </div>
  );
};

export default ObjectSizeMeasurement;