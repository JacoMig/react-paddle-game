import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import Scene from './containers/Scene'
import {KeyListener} from 'react-game-kit'
import {GAME_WIDTH, LIVES} from './constants'
import './sass/global.scss'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lives: LIVES,
      gameover: false
    };
    this.World = Matter.World;
    this.Render = Matter.Render;
    this.Engine = Matter.Engine,
    this.engine = this.Engine.create();
    this.keyListener = new KeyListener();
     // const ground = Bodies.rectangle(0, 600, 600, 50, { isStatic: true })
    this.top = Matter.Bodies.rectangle(350, 0, 650, 50, { isStatic: true,  restitution: 0.9})
    this.left = Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true, restitution: 0.9 })
    this.right = Matter.Bodies.rectangle(GAME_WIDTH, 300, 50, 600, { isStatic: true, restitution: 0.9 })
    
  }

  componentDidMount() {
   // const  Bodies = Matter.Bodies;
    const render = this.Render.create({
        element: this.refs.worldEl,
        engine: this.engine,
        options: {
          width: GAME_WIDTH,
          height: 600,
          wireframes: false
        }
    });
    
    
   
    
    this.World.add(this.engine.world, [
      // walls
      this.top,
      //  ground,
      this.left,
      this.right
    ]);

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
    typeof element === 'object' ?
    this.World.add(this.engine.world, element) :
    this.World.add(this.engine.world, [element])
  }

  removeBody(element){
    typeof element === 'object' ?
    this.World.remove(this.engine.world, element) :
    this.World.remove(this.engine.world, [element])
  }

  ballFalls(ball){
    if(this.state.lives > 0){
      this.setState({lives: this.state.lives-1})
    }else{
      this.removeBody(ball)
      this.setState({gameover: true})
    }
  }
  
  playAgain(){
    location.reload()}

  render() {
    return  (<div ref="worldEl">
                <div className="score">
                  Lives: <span>{this.state.lives}</span>
                </div>
                {this.state.gameover && 
                  <div className="gameOver">
                    <p>GAME OVER</p>
                    <button onClick={this.playAgain.bind(this)}>Play</button>
                  </div>
                }
                
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
