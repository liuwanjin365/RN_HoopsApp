import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {navigationActions, eventActions, requestActions, paymentActions} from '../actions'
import {EventDetails as _EventDetails} from '../windows'
import {eventSelector} from '../selectors/events'

import inflateEvent from '../data/inflaters/event'
import inflateUser from '../data/inflaters/user'

class EventDetails extends Component {

  constructor() {
    super()

    this.state = {
      isAwaitingCard: false,
      userPaymentMethod: undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    //If the first card has been added and we are waiting for one.
    //Use it to pay for the current event
    if(
      this.state.isAwaitingCard &&
      this.props.payments.cards.length === 0 &&
      nextProps.payments.cards.length === 1
    ) {
      this.props.onJoin(this.props.id, this.state.userPaymentMethod)
    }
  }

  render() {
    let event = inflateEvent(
      this.props.event,
      {
        users: {
          ...this.props.users.usersById,
          [this.props.user.uid]: {
            ...this.props.user,
            id: this.props.user.uid,
          },
        },
        invites: this.props.invites.invitesById,
        requests: this.props.requests.requestsById,
        interests: this.props.interests,
      }
    )

    let user = inflateUser(this.props.user, {
      invites: this.props.invites.invitesById,
      requests: this.props.requests.requestsById,
    })

    let isMember = !!user.requests.find(connection => {
      return connection.eventId === event.id
    })

    let request = user.requests.find(connection => {
      return connection.eventId === event.id
    })

    let isPendingRequest = request && request.status === 'pending'

    let isSaved = !!Object.keys(user.savedEvents).find(eventId => {
      return eventId === event.id
    })

    //navRoute is needed to determine weather or not to update the action button
    let tabKey = this.props.navigation.tabKey
    let tabNav = this.props.navigation.tabs[tabKey]
    let navRoute = tabNav.routes[tabNav.index]

    return (
      <_EventDetails
        onBack={this.props.onBack}
        onClose={this.props.onClose}
        navKey={navRoute.scene}
        event={event}
        isExpired={moment(event.date).isBefore()}
        organizer={event.organizer}
        isMember={isMember}
        isPendingRequest={isPendingRequest}
        isOrganizer={event.organizer && event.organizer.id === this.props.user.uid}
        isSaved={isSaved}
        actionButton={this.props.actionButton}
        onChangeAction={this.props.onChangeAction}
        payments={this.props.payments}
        onPressOrganizer={(organizer) => {
          this.props.onNavigate('profile', {id: organizer.id})
        }}
        onPressSave={() => {
          if(isSaved) {
            this.props.onPressUnsave(this.props.id)
          } else {
            this.props.onPressSave(this.props.id)
          }
        }}
        onPressJoin={(userPaymentMethod) => {
          if(
            event.entryFee === 0 ||
            event.paymentMethod === 'cash' ||
            userPaymentMethod === 'cash' ||
            this.props.payments.cards.length > 0
          ) {
            this.props.onJoin(this.props.id, userPaymentMethod)
          } else {
            this.setState({isAwaitingCard: true, userPaymentMethod})
            this.props.onNavigate('addCard', {}, false)
          }
        }}
        onCancelRequest={() => {
          this.props.onCancelRequest(request)
        }}
        isAwaitingCard={this.state.isAwaitingCard}
        onPressQuit={() => {
          this.props.onPressQuit(this.props.id)
        }}
        onPressViewList={() => {
          this.props.onNavigate('eventMembers', {id: this.props.id})
        }}
        onPressInvite={() => {
          this.props.onNavigate('eventInvites', {id: event.id})
        }}
        onEditEvent={() => {
          this.props.onNavigate('createEvent', {id: event.id}, false)
        }}
        onClearPaymentError={() => {
          this.props.onClearPaymentError()
        }}
      />
    )
  }
}

EventDetails.propTypes = {
  id: React.PropTypes.string.isRequired,
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    return {
      router: state.router,
      event: eventSelector(state, props.id),
      users: state.users,
      user: state.user,
      requests: state.requests,
      invites: state.invites,
      payments: state.payments,
      interests: state.interests,
      navigation: state.navigation,
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = (dispatch) => {
  return {
    onNavigate: (key, props, subTab) => dispatch(navigationActions.push({key, props}, subTab)),
    onDeepLinkTab: (key, tabKey, props) => {
      dispatch(navigationActions.deepLinkTab(null, tabKey))
    },
    onJoin: (eventId, userPaymentMethod) => {
      dispatch(eventActions.join(eventId, userPaymentMethod))
    },
    onPressQuit: (eventId) => dispatch(eventActions.quit(eventId)),
    onPressSave: (eventId) => dispatch(eventActions.save(eventId)),
    onPressUnsave: (eventId) => dispatch(eventActions.unsave(eventId)),
    onCancelRequest: (request) => dispatch(requestActions.cancel(request)),
    onClearPaymentError: (request) => dispatch(paymentActions.clearPaymentError())
  }
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(EventDetails)
