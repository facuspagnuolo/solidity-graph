import React from 'react'
import { Link } from 'react-router-dom'

export default class Home extends React.Component {
  render() {
    const eventLogger = (e: MouseEvent, data: Object) => {
      console.log('Event: ', e);
      console.log('Data: ', data);
    };

    return (
      <div className="home">
        <div className="row buy-sell-question center">
          <h3 className="super-title">Would you like to buy or sell tokens?</h3>
          <div className="row">
            <Link to="/token-purchase" className="btn btn-large btn-primary buy-button" id="buy">Buy</Link>
            <Link to="/token-sale" className="btn btn-large btn-primary" id="sell">Sell</Link>
          </div>
        </div>
        <div className="row contracts-lists">
          <Draggable
            axis="x"
            handle=".handle"
            defaultPosition={{x: 0, y: 0}}
            position={null}
            grid={[25, 25]}
            onStart={this.handleStart}
            onDrag={this.handleDrag}
            onStop={this.handleStop}>
            <div>
              <div className="handle">Drag from here</div>
              <div>This readme is really dragging on...</div>
            </div>
          </Draggable>
        </div>
      </div>
    )
  }
}
