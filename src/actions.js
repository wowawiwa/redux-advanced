import fetch from 'cross-fetch'

export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit,
  }
}

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit,
  }
}

export const REQUEST_POSTS = 'REQUEST_POSTS'
export function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit,
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export function fetchPosts(subreddit) {
  return function(dispatch) {
    dispatch(requestPosts(subreddit))
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => {
        dispatch(receivePosts(subreddit, json))
      })
  }
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if(!posts) {
    return true
  }
  if(posts.isFetching) {
    return false
  }
  if(posts.didInvalidate) {
    return true
  }
  return true
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit)) // fetchPosts returns a Promise so it's homogene with the else case.
    } else {
      return Promise.resolve()
    }
  }
}