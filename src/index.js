import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import Scene from './containers/Scene'
import {KeyListener} from 'react-game-kit'
import {DEFAULT_BALLS, GAME_WIDTH, BALLS_COLORS} from './constants'
import './sass/global.scss'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lives: 5
    };
    this.World = Matter.World;
    this.Render = Matter.Render;
    this.Engine = Matter.Engine,
    this.engine = this.Engine.create({
        // positionIterations: 20
      });
    this.keyListener = new KeyListener()
    this.BALLS = []
  }

  componentDidMount() {
    const  Bodies = Matter.Bodies;
    const render = this.Render.create({
        element: this.refs.worldEl,
        engine: this.engine,
        options: {
          width: GAME_WIDTH,
          height: 600,
          wireframes: false
        }
    });
    
    
    const BALL_options = {
      isStatic: true, 
      restitution: 0,
      label: "ball"
    }
    let ballX = 50;
    let Xpos = 0;
    let initRow = 50;
    let rowY = initRow;
    for(var i = 1; i <= DEFAULT_BALLS; i++){
      const randomColor = Math.floor(Math.random()*BALLS_COLORS.length)
      Xpos = ballX*(i % 12)+50
      if(i % 13 == 0){
        rowY = ( (i / 13) * initRow ) + initRow
      }
      this.BALLS.push(Matter.Bodies.circle(
        Xpos, 
        rowY, 
        15, 
        {...BALL_options, render: {
            fillStyle: BALLS_COLORS[randomColor]
          }
        })
      )
    }
  
    // const ground = Bodies.rectangle(0, 600, 600, 50, { isStatic: true })
    const top = Bodies.rectangle(350, 0, 650, 50, { isStatic: true,  restitution: 0.9})
    const left = Bodies.rectangle(0, 300, 50, 600, { isStatic: true, restitution: 0.9 })
    const right = Bodies.rectangle(GAME_WIDTH, 300, 50, 600, { isStatic: true, restitution: 0.9 })
    
    this.World.add(this.engine.world, [
      // walls
      top,
      //  ground,
      left,
      right
    ]);

    this.World.add(this.engine.world, this.BALLS);

    this.keyListener.subscribe([
        this.keyListener.LEFT,
        this.keyListener.RIGHT,
        this.keyListener.UP
    ]);
    this.Engine.run(this.engine);
    this.Render.run(render);
  }

  componentWillUnmount(){
    this.keyListener.unsubscribe([
      this.keyListener.LEFT,
      this.keyListener.RIGHT,
      this.keyListener.UP
  ]);
  }

  addBody(element) {
    this.World.add(this.engine.world, [element]);
  }

  removeBody(BODY){
    this.World.remove(this.engine.world, BODY)
    console.log(BODY)
  }

  ballFalls(ball){
    if(this.state.lives > 0){
      this.setState({lives: this.state.lives-1})
    }else{
      this.removeBody(ball)
    }
  }
  

  render() {
    return  (<div ref="worldEl">
                <p className="score">{this.state.lives}</p>
                <Scene 
                  addBody={this.addBody.bind(this)} 
                  engine={this.engine}
                  keys={this.keyListener}
                  removeBody={this.removeBody.bind(this)}
                  ballFalls={this.ballFalls.bind(this)}
                  lives={this.state.lives}
                />
            </div>)
  }
}
export default App;

ReactDOM.render(<App />, document.getElementById('app'))
