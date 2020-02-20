import {firebaseDb} from '../data/firebase'
import DBHelper from '../data/database-helper'
const database = DBHelper('users')

import actionTypes, {eventActions, requestActions} from './'

const setupUser = (dispatch, id, user) => {
  dispatch({
    type: actionTypes.USERS_LOADED,
    users: {[id]: user}
  })

  if (user.organizing) {
    for (let eventId in user.organizing) {
      dispatch(eventActions.load(eventId))
    }
  }

  if (user.requests) {
    for (let requestId in user.requests) {
      dispatch(requestActions.load(requestId))
    }
  }

  // database.addListener(`users/${id}`, 'value', (snapshot) => {

  // todo: Invites loaded as part of the startup routine
  // if(user.invites) {
  //   for(let id in user.invites) {
  //     dispatch(inviteActions.load(id))
  //   }
  // }
}

export const load = (id) => {
  return (dispatch, getState) => {
    // Replace with setupUser for now
  }
}

export const loadMany = (userIds) => {
  return dispatch => {
    userIds.map((id) => {
      dispatch(load(id))
    })
  }
}

export const sendFriendRequests = (userIds) => {
  return (dispatch, getState) => {
    let uid = getState().user.uid
    userIds.forEach((userId) => {
      let friendRequest = firebaseDb.child('friendRequests').push()

      firebaseDb.update({
        [`friendRequests/${friendRequest.key}`]: {
          fromId: uid,
          toId: userId,
          status: 'pending',
        },
        [`users/${uid}/friendRequests/${friendRequest.key}`]: true,
        [`users/${userId}/friendRequests/${friendRequest.key}`]: true,
      })
    })
  }
}

export const loadFriendRequest = (id) => {
  return (dispatch, getState) => {
    let uid = getState().user.uid

    database.addListener(`friendRequests/${id}`, 'value', (snapshot) => {
      let friendRequest = snapshot.val()

      if (!friendRequest) {
        return
      }

      dispatch({
        type: actionTypes.FRIEND_REQUESTS_LOADED,
        friendRequests: {
          [id]: {
            ...friendRequest,
            id,
          },
        },
      })

      if (friendRequest.fromId === uid) {
        //Friend request is from me, to a user.
        dispatch(load(friendRequest.toId))
      } else {
        //Friend request is from a user, to me.
        dispatch(load(friendRequest.fromId))
      }
    })
  }
}

export const getAll = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      firebaseDb.child(`users`).once('value', snapshot => {
        dispatch({type: actionTypes.USERS_LOADED, users: snapshot.val()})
        resolve()
      })
    })
  }
}

export const registerWithStore = () => {
  return (dispatch, getState) => {
    const cb = snapshot => {
      const id = snapshot.key
      const user = snapshot.val()

      setupUser(dispatch, id, user)
    }

    firebaseDb.child(`users`).limitToLast(1).on('child_added', cb)
    firebaseDb.child(`users`).on('child_changed', cb)
  }
}
