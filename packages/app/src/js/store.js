import React from 'react'
import thunkMiddleware from 'redux-thunk'
import error from './reducers/errors'
import fetching from './reducers/fetching'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const mainReducer = combineReducers({
  error,
  fetching,
})

const Store = createStore (
  mainReducer,
  applyMiddleware(thunkMiddleware)
)

export default Store
