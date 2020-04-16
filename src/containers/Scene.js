import React, {useState, useEffect} from 'react'
import Matter from 'matter-js'
import {GAME_WIDTH} from '../constants'
import '../sass/global.scss'
// import PropTypes from 'prop-types';

// import { observer } from 'mobx-react';


const shouldMoveLeft = (body) => {
    return body.position.x > 0;
}

const shouldMoveRight = (body) => {
    return body.position.x < GAME_WIDTH;
}

const woodY = GAME_WIDTH - 60

const woodOptions = {
    isStatic: true,
    restitution: 0,
    label: 'Paddle',
    render: {
        fillStyle: 'brown'
    }
}

const ballOptions = {
    density: 0.04,
    frictionAir: 0.02,
    restitution: 0.5,
    friction: 0.1,
    label: "ballME",
    render: {
        fillStyle: 'white'
    }
    // inertia : Infinity
}

let keydown = false;
let acc = 0.3;
const Scene = (props) => {
    const {keys} = props
    const wood = Matter.Bodies.rectangle(200, woodY, 150, 20, woodOptions)
    var ballA = Matter.Bodies.circle(210, 200, 10, ballOptions);
   
    let step = wood.position.x
    
    const update = () => {
        if (keys.isDown(keys.LEFT)) {
            console.log('LEFT')
            if(shouldMoveLeft(wood)){
                keydown = true
                step-=5
                Matter.Body.set(wood, 'position', { x: step, y: woodY});
            }
        }
        else if (keys.isDown(keys.RIGHT)) {
            console.log('RIGHT')
            if(shouldMoveRight(wood)){
                keydown = true
                step+=5
                Matter.Body.set(wood, 'position', { x: step, y: woodY});
            }
        }
        if(ballA.position.y > window.innerHeight){
            props.playerLivesOff()
            /* ballA.position.x = Math.floor( Math.random() * 400)
            ballA.position.y = 300 */
        }
    } 

    const ballCollision = (pairs) => {
        if(pairs.bodyA.label.includes("Paddle")){
            const middle = ((pairs.bodyA.vertices[1].x - pairs.bodyA.vertices[0].x) / 2 ) + pairs.bodyA.vertices[0].x
            const velX = ballA.position.x - middle
            Matter.Body.setVelocity(ballA, {x: (velX/5), y: -25}) 
        }
        if(pairs.bodyB.label === "ball"){
            props.removeBall(pairs.bodyB)
        }
        
    }

    useEffect(() => {
        props.addBody(wood)
        props.addBody(ballA)
        Matter.Events.on(props.engine, 'afterUpdate', update);
        Matter.Events.on(props.engine, 'collisionStart', (event) => ballCollision(event.pairs[0]))
        return () => {
            Matter.Events.off(props.engine, 'afterUpdate', update);
            Matter.Events.off(props.engine, 'collisionStart', (event) => ballCollision(event.pairs[0]))
       } 
       
    }, [])
    return (
        <div></div>
    )
}


export default Scene