import React, {useEffect, useState} from 'react';
import Matter from "matter-js"
import {DEFAULT_BRICKS, BRICKS_COLORS, BRICK_WIDTH} from '../constants'

const Bricks = (props) => {
    
    const BRICKS = []
    
    useEffect(() => {
        const BRICK_options = {
            isStatic: true, 
            restitution: 0,
            label: "brick",
            wireframes: false
          }
        let brickX = 50;
        let Xpos = 0;
        let initRow = 50;
        let rowY = initRow;
        for(var i = 1; i <= DEFAULT_BRICKS; i++){
            const randomColor = Math.floor(Math.random()*BRICKS_COLORS.length)
            Xpos = brickX*(i % 12)+50
            if(i % 13 == 0){
                rowY = ( (i / 13) * initRow ) + initRow
            }
            BRICKS.push(Matter.Bodies.rectangle(
                Xpos+2, 
                rowY, 
                BRICK_WIDTH,
                20, 
                {...BRICK_options, render: {
                    fillStyle: BRICKS_COLORS[randomColor],
                    
                }
                })
            )
        }
        props.addBody(BRICKS)
        //     this.World.add(this.engine.world, this.BALLS);
    },[])
    return (
        null
    )
}


export default Bricks