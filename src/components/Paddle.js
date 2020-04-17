import React, { useEffect, useState } from 'react'
import {GAME_WIDTH, GAME_HEIGHT} from '../constants'
import Matter from 'matter-js'

const shouldMoveLeft = (body) => {
    return body.position.x > 0;
}

const shouldMoveRight = (body) => {
    return body.position.x < GAME_WIDTH;
}

const paddleY = GAME_HEIGHT

const paddleOptions = {
    isStatic: true,
    restitution: 0,
    label: 'Paddle',
    render: {
        fillStyle: 'brown'
    }
}


const Paddle = (props) => {
    const {keys} = props
    const paddle = Matter.Bodies.rectangle(200, paddleY, 150, 20, paddleOptions)
    let step = paddle.position.x

    const update = () => {
        if (keys.isDown(keys.LEFT)) {
            console.log('LEFT')
            if(shouldMoveLeft(paddle)){
               // keydown = true
                step-=5
                Matter.Body.set(paddle, 'position', { x: step, y: paddleY});
            }
        }
        else if (keys.isDown(keys.RIGHT)) {
            console.log('RIGHT')
            if(shouldMoveRight(paddle)){
               // keydown = true
                step+=5
                Matter.Body.set(paddle, 'position', { x: step, y: paddleY});
            }
        }
    }

    const handleCollision = (pairs) => {
        if(pairs.bodyB.label === "Paddle"){
            const middle = ((pairs.bodyB.vertices[1].x - pairs.bodyB.vertices[0].x) / 2 ) + pairs.bodyB.vertices[0].x
            const velX = pairs.bodyA.position.x - middle
            Matter.Body.setVelocity(pairs.bodyA, {x: (velX/5), y: -25}) 
        }
       // console.log(pairs)
    }

    
    useEffect(() => {
        props.addBody(paddle)
        Matter.Events.on(props.engine, 'afterUpdate', update);
        Matter.Events.on(props.engine, 'collisionStart', (event) => handleCollision(event.pairs[0]))
        return () => {
            Matter.Events.off(props.engine, 'afterUpdate', update);
            Matter.Events.off(props.engine, 'collisionStart', (event) => handleCollision(event.pairs[0]))
       } 
    }, [])
    
    return (
       null
    )
}

export default Paddle