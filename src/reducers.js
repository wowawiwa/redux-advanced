import { combineReducers } from 'redux'
import { SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT, REQUEST_POSTS, RECEIVE_POSTS } from './actions'

// {
//   selectedSubreddit: 'frontend',
//   postsBySubreddit: {
//     frontend: {
//       isFetching: true,
//       didInvalidate: false,
//       items: []
//     },
//     reactjs: {
//       isFetching: false,
//       didInvalidate: false,
//       lastUpdated: 1439478405547,
//       items: [
//         {
//           id: 42,
//           title: 'Confusion about Flux and Relay'
//         },
//         {
//           id: 500,
//           title: 'Creating a Simple Application Using React JS and Flux Architecture'
//         }
//       ]
//     }
//   }
// }

const selectedSubreddit = (state='reactjs', action) => {
  switch(action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

const postsBySubreddit = (state={}, action) => {
  switch(action.type) {
    case INVALIDATE_SUBREDDIT:
    case REQUEST_POSTS: 
    case RECEIVE_POSTS:
      return Object.assign({}, state, {[action.subreddit]: posts(state[action.subreddit], action)})
    default:
      return state
  }
}

const posts = (state={}, action) => {
  switch(action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {didInvalidate: true})
    case REQUEST_POSTS:
      return Object.assign({}, state, {isFetching: true})
    case RECEIVE_POSTS:
      return Object.assign({}, state, {items: action.posts})
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectedSubreddit,
  postsBySubreddit,
})

export default rootReducer