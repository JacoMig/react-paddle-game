import React, {useState, useEffect} from 'react'
import Matter from 'matter-js'
import {GAME_WIDTH} from '../constants'
import Paddle from '../components/Paddle'
import '../sass/global.scss'

const shouldMoveLeft = (body) => {
    return body.position.x > 0;
}

const shouldMoveRight = (body) => {
    return body.position.x < GAME_WIDTH;
}

const paddleY = GAME_WIDTH - 60

const paddleOptions = {
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
   // const [lives, setLives] = useState(props.lives)
    const paddle = Matter.Bodies.rectangle(200, paddleY, 150, 20, paddleOptions)
    let ballA = Matter.Bodies.circle(210, 200, 10, ballOptions)
    let step = paddle.position.x
   
    const checkIfBallIsIn = () => {
        return props.engine.world.bodies.some(b => b.label === "ballME")
    } 

    const update = () => {
        if (keys.isDown(keys.LEFT)) {
            console.log('LEFT')
            if(shouldMoveLeft(paddle)){
                keydown = true
                step-=5
                Matter.Body.set(paddle, 'position', { x: step, y: paddleY});
            }
        }
        else if (keys.isDown(keys.RIGHT)) {
            console.log('RIGHT')
            if(shouldMoveRight(paddle)){
                keydown = true
                step+=5
                Matter.Body.set(paddle, 'position', { x: step, y: paddleY});
            }
        }
        if(ballA.position.y > window.innerHeight && checkIfBallIsIn()){
            props.ballFalls(ballA)
            Matter.Body.setVelocity(ballA, {x: 0, y: 0})
            Matter.Body.set(ballA, 'position', {x: 100, y: 200})
        }

    } 

    const ballCollision = (pairs) => {
        if(pairs.bodyA.label === "Paddle"){
            const middle = ((pairs.bodyA.vertices[1].x - pairs.bodyA.vertices[0].x) / 2 ) + pairs.bodyA.vertices[0].x
            const velX = ballA.position.x - middle
            Matter.Body.setVelocity(ballA, {x: (velX/5), y: -25}) 
        }
        if(pairs.bodyB.label === "ball"){
            props.removeBody(pairs.bodyB)
        }
       
    }

    useEffect(() => {
        props.addBody(paddle)
        props.addBody(ballA)
        Matter.Events.on(props.engine, 'afterUpdate', update);
        Matter.Events.on(props.engine, 'collisionStart', (event) => ballCollision(event.pairs[0]))
        return () => {
            Matter.Events.off(props.engine, 'afterUpdate', update);
            Matter.Events.off(props.engine, 'collisionStart', (event) => ballCollision(event.pairs[0]))
       } 
    }, [])
    
    return (
        <div>
            <Paddle 
                addBody={props.addBody}
            />
        </div>
    )
}


export default Scene