import React from 'react'
import Home from './Home'
import Store from '../store'
import Modal from './Modal.react'
import Error from './Error.react'
import Navbar from './Navbar.react'
import { Switch, Route } from 'react-router-dom'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { fetching: false }
  }

  componentDidMount() {

  }

  render() {
    const fetching = !!this.state.fetching

    return (
      <div ref="app">
        <Navbar/>
        <div className="main-container container">
          <Error/>
          <Switch>
            <Route path="/" exact component={Home}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={this.state.fetching}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.app) {
      const state = Store.getState()
      this.setState({ fetching: state.fetching, connected: state.network.connected, couldAccessAccount: state.network.couldAccessAccount })
    }
  }
}
