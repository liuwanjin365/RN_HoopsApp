import React, {Component} from 'react'
import {connect} from 'react-redux'

import inflateUser from '../data/inflaters/user'
import {eventActions, navigationActions} from '../actions'
import {eventSelector} from '../selectors/events'
import {EventDashboard as _EventDashboard} from '../windows'

class EventDashboard extends Component {

  onCancel(message) {
    this.props.onCancel(this.props.id, message)
    this.props.onNavigateBack()
  }

  onPressDetails() {
    this.props.onNavigate('eventDetails', {id: this.props.id})
  }

  onPressMembers() {
    this.props.onNavigate('eventMembers', {id: this.props.id})
  }

  onPressMessages() {
    this.props.onNavigate('chat', {id: this.props.event.chatId}, false, 'horizontal')
  }

  onPressGallery() {
    //this.props.onNavigate('eventGallery', {id: this.props.id});
  }

  onPressFinances() {
    //this.props.onNavigate('eventFinances', {id: this.props.id});
  }

  render() {
    const event = this.props.event

    const user = inflateUser(this.props.user, {
      invites: this.props.invites.invitesById,
      requests: this.props.requests.requestsById,
    })

    const isMember = !!user.requests.find(connection => {
      return connection.eventId === event.id
    })

    return (
      <_EventDashboard
        event={event}
        onCancel={this.onCancel.bind(this)}
        onPressDetails={this.onPressDetails.bind(this)}
        onPressMembers={this.onPressMembers.bind(this)}
        onPressMessages={this.onPressMessages.bind(this)}
        onPressGallery={this.onPressGallery.bind(this)}
        onPressFinances={this.onPressFinances.bind(this)}
        actionButton={this.props.actionButton}
        onBack={this.props.onNavigateBack}
        isMember={isMember}
        onChangeAction={this.props.onChangeAction}
        onPressQuit={this.props.onPressQuit}
      />
    )
  }
}

EventDashboard.propTypes = {
  id: React.PropTypes.string.isRequired,
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    return {
      event: eventSelector(state, props.id),
      invites: state.invites,
      requests: state.requests,
      router: state.router,
      user: state.user,
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = (dispatch) => {
  return {
    onNavigate: (key, props, subTab, direction) => dispatch(navigationActions.push({key, props}, subTab, direction)),
    onNavigateBack: () => dispatch(navigationActions.pop()),
    onCancel: (eventId, message) => dispatch(eventActions.cancel(eventId, message)),
    onPressQuit: (eventId) => {
      dispatch(eventActions.quit(eventId))
      dispatch(navigationActions.changeTab('home'))
    }
  }
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(EventDashboard)
