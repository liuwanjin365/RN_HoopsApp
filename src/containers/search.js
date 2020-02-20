import React, {Component} from 'react'
import {connect} from 'react-redux'

import {navigationActions, searchActions} from '../actions'
import {generalSearchEventsSelector} from '../selectors/events'
import {Search as _Search} from '../windows'

class Search extends Component {

  constructor() {
    super()

    this.state = {
      activityKey: null,
      location: null,
    }
  }

  render() {
    const events = this.props.searchGeneralEvents
    let userIds = this.props.search.general.userIds

    let users = userIds.map(id => {
      return this.props.users.usersById[id]
    }).filter(user => !!user)
    return (
      <_Search
        onClose={this.props.onNavigateBack}
        onPressActivity={() => {
          this.props.onNavigate('activitiesSelect', {
            activities: this.props.interests,
            onSelect: (activityKey) => {
              this.setState({activityKey})
              this.props.onNavigateBack()
            }
          }, false)
        }}
        activity={this.props.interests[this.state.activityKey]}
        onPressSearchEvents={(searchParams) => {
          this.props.onSearchEvents(searchParams)
        }}
        onPressSearchGeneral={params => {
          this.props.onSearchGeneral(params)
        }}
        results={{
          events: events.slice(0, 2),
          showMoreEvents: events.length > 2,
          users: users.slice(0, 2),
          showMoreUsers: users.length > 2,
        }}
        onPressEvent={(event) => {
          this.props.onDeepLinkTab('eventDetails', 'home', {id: event.id})
        }}
        onPressUser={(user) => {
          this.props.onDeepLinkTab('profile', 'home', {id: user.id})
        }}
        onPressSeeMoreEvents={() => {
          this.props.onNavigate('searchResults', {generalSearch: 'events'})
        }}
        onPressSeeMoreUsers={() => {
          this.props.onNavigate('searchResults', {generalSearch: 'users'})
        }}
        requestGeolocation={() => {
          navigator.geolocation.getCurrentPosition((result) => {
            this.setState({location: result})
          }, (err) => {
            console.warn(err) //eslint-disable-line no-console
            this.setState({location: null})
          })
        }}
        coords={this.state.location && this.state.location.coords}
      />
    )
  }
}

export default connect(
  (state) => ({
    user: state.user,
    search: state.search,
    interests: state.interests,
    users: state.users,
    invites: state.invites,
    requests: state.requests,

    searchGeneralEvents: generalSearchEventsSelector(state),
  }),
  (dispatch) => ({
    onNavigate: (key, props, subTab) => dispatch(navigationActions.push({key, props}, subTab)),
    onNavigateBack: () => dispatch(navigationActions.pop()),
    onDeepLinkTab: (key, tabKey, props) => dispatch(
      navigationActions.deepLinkTab({key, props}, tabKey)
    ),
    onSearchEvents: (params) => dispatch(searchActions.searchEvents(params)),
    onSearchGeneral: (params) => dispatch(searchActions.searchGeneral(params)),
  }),
)(Search)
