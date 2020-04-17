import React, {useState, useEffect} from 'react'
import Matter from 'matter-js'
import {GAME_WIDTH} from '../constants'
import Paddle from '../components/Paddle'
import '../sass/global.scss'

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
    let ballA = Matter.Bodies.circle(210, 200, 10, ballOptions)
   
    const checkIfBallIsIn = () => {
        return props.engine.world.bodies.some(b => b.label === "ballME")
    } 

    const update = () => {
       if(ballA.position.y > window.innerHeight && checkIfBallIsIn()){
            props.ballFalls(ballA)
            Matter.Body.setVelocity(ballA, {x: 0, y: 0})
            Matter.Body.set(ballA, 'position', {x: 100, y: 200})
        }
    } 

    const ballCollision = (pairs) => {
        if(pairs.bodyB.label === "ball"){
            props.removeBody(pairs.bodyB)
        }
    }

    useEffect(() => {
        props.addBody(ballA)
        Matter.Events.on(props.engine, 'afterUpdate', update);
        Matter.Events.on(props.engine, 'collisionStart', (event) => ballCollision(event.pairs[0]))
        return () => {
            Matter.Events.off(props.engine, 'afterUpdate', update);
            Matter.Events.off(props.engine, 'collisionStart', (event) => ballCollision(event.pairs[0]))
       } 
    }, [])
    
    return (
        <>
            
            <Paddle 
                addBody={props.addBody}
                engine={props.engine}
                keys={props.keys}
                ball={ballA}
            />
        </>
    )
}


export default Scene