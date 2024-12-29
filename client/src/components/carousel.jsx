import React from 'react';
import { Carousel } from 'antd';
const contentStyle = {
  margin: 0,
  height: '70vh',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const CarouselOnDashboard = () => (
  <>
    <Carousel arrows autoplay infinite={false}>
      <div style={{
         width:"80%",
         border: '1px solid white',
      }}>
        <h3 style={contentStyle}>1</h3>
      </div>
      <div  style={{
         width:"80%"
      }}>
        <h3 style={contentStyle}>2</h3>
      </div>
      {/* <div  style={{
         width:"80%"
      }}>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div> */}
    </Carousel>
  </>
);
export default CarouselOnDashboard;