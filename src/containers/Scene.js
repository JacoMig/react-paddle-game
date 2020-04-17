import React, {useState, useEffect} from 'react'
import Matter from 'matter-js'
// import {GAME_WIDTH} from '../constants'
import Paddle from '../components/Paddle'
import Bricks from '../components/Bricks'
import { GAME_WIDTH } from '../constants'
import {getRandom} from '../utils'

const ballOptions = {
    density: 0.04,
    frictionAir: 0.01,
    restitution: 0.5,
    friction: 0.1,
    label: "ball",
    render: {
        fillStyle: 'white'
    }
    // inertia : Infinity
}



const Scene = (props) => {
    let ballA = Matter.Bodies.circle(getRandom(50, GAME_WIDTH-50), 200, 10, ballOptions)
   
    const gameOver = () => {
        return props.engine.world.bodies.some(b => b.label === "ball")
    } 

    const reLoadBall = () => {
        setTimeout(() => {
            Matter.Body.set(ballA, 'isStatic', false)
            Matter.Body.setVelocity(ballA, {x: getRandom(-8, 8), y: 0})
        }, 500)
    }

    const update = () => {
        if(ballA.position.y > window.innerHeight && gameOver()){
            reLoadBall()
            props.ballFalls(ballA)
            const randomX = getRandom(50, GAME_WIDTH-50)
            Matter.Body.set(ballA, 'position', {x: randomX, y: 200})
            Matter.Body.set(ballA, 'isStatic', true)
        }
    } 

    const ballCollision = (pairs) => {
        if(pairs.bodyB.label === "brick"){
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
            <Bricks addBody={props.addBody} />
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