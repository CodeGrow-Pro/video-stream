import React from 'react';
import { Rate } from 'antd';
const LevelSelect = ({ value = 0, handleChangeRating, index }) => <Rate style={{
    border: '1px solid white',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'gray',
    fontSize: '20px',
    fontWeight: 'bold',
    width: '1auto',
}}
    value={value}
    defaultValue={value}
    count={10}
    index={index}
    onChange={(value)=>handleChangeRating(value,index)}
    tooltips={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
/>;
export default LevelSelect;