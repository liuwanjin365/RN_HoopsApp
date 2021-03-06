import React, {Component} from 'react'
import {ScrollView,View,Text, Image, TouchableHighlight} from 'react-native'
import moment from 'moment'

import StyleSheet from '../styles'
import {Avatar, Icon, HorizontalRule, Button, Popup, Header, ErrorPopup} from '../components'
import _ from '../i18n'
import {insert} from '../utils'
import EventDashboard from './event-dashboard'

const icons = {
  AMERICAN_FOOTBALL: 'activityAmericanFootball',
  ANGLING: 'activityAngling',
  ARCHERY: 'activityArchery',
  AUTOMOBILE_RACING: 'activityAutomobileRacing',
  BADMINTON: 'activityBadminton',
  BASEBALL: 'activityBaseball',
  BASKETBALL: 'activityBasketball',
  BEACH_VOLLEYBALL: 'activityVolleyball',
  BIKE: 'activityBike',
  BIKE_POLO: 'activityBike',
  BOWLING: 'activityBowling',
  BOXING: 'activityBoxing',
  CANOEING: 'activityCanoeing',
  CARDS: 'activityCards',
  CHESS: 'activityChess',
  DODGEBALL: 'activityDodgeball',
  DEFAULT: 'activityDefault',
  DISCGOLF: 'activityGolf',
  DIVING: 'activityDiving',
  FISHING: 'activityFishing',
  FOOTBALL: 'activityFootball',
  FOOTGOLF: 'activityGolf',
  FRISBEE: 'activityFrisbee',
  FREE_RUNNING: 'activityRunning',
  GOLF: 'activityGolf',
  GYM: 'activityGym',
  GYMNASTICS: 'activityGymnastics',
  HOCKEY: 'activityHockey',
  ICE_HOCKEY: 'activityIceHockey',
  ICE_SKATING: 'activityIceSkating',
  JIU_JITSU: 'activityBoxing',
  KORFBALL: 'activityVolleyball',
  LACROSSE: 'activityLacrosse',
  MOUNTAINEERING: 'activityMountaineering',
  NETBALL: 'activityVolleyball',
  PILOXING: 'activityYoga',
  POOL: 'activityPool',
  RUGBY: 'activityRugby',
  RUNNING: 'activityRunning',
  SKATEBOARDING: 'activitySkateboarding',
  SKIING: 'activitySkiing',
  SWIMMING: 'activitySwimming',
  TABLE_TENNIS: 'activityTableTennis',
  TAMBURELLO:'activityTennis',
  TAMBOURELLI:'activityTennis',
  TAMBEACH:'activityTennis',
  TENNIS: 'activityTennis',
  SNOOKER: 'sctivityPool',
  YOGA: 'activityYoga',
  VX: 'activityLacrosse',
  ZUMBA:'activityZumba',
}

export default class EventDetails extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showJoinPopup: false,
      showJoinedConfirmation: false,
      showQuitPopup: false,
      showCancelEventPopup: false,
      showCancelRequestPopup: false,
      showPaymentTypePopup: false,
      paymentMethod: undefined,
      joinRequest: false,
    }
  }

  componentWillMount() {
    this._actionListener = this.props.actionButton.addListener('press', () => {
      if (this.props.isExpired) {
        this.props.onBack()
      } else if (this.props.isMember) {
        this.setState({ showQuitPopup: true })
      } else if (this.props.isOrganizer) {
        this.props.onEditEvent()
      } else {
        this.onPressJoinTabAction()
      }
    })

    this.updateActionButton(this.props)
  }

  componentWillReceiveProps(nextProps) {
    // Display the joined popup
    if (this.state.joinRequest && this.props.isMember) {
      this.setState({
        joinRequest: false,
        showJoinedConfirmation: true,
      })
    }

    if (
      nextProps.isMember !== this.props.isMember ||
      nextProps.isOrganizer !== this.props.isOrganizer ||
      (nextProps.navKey !== this.props.navKey && nextProps.navKey === 'eventDetails')
    ) {
      this.updateActionButton(nextProps)
    }
  }

  onPressJoinTabAction() {
    let event = this.props.event
    this.setState({
      showJoinPopup: true,
      paymentMethod: event.entryFee === 0 ? 'cash' : event.paymentMethod
    })
  }
    // if (event.entryFee > 0 && event.paymentMethod === 'unrestricted') {
      //If we are on an 'unrestricted' payment type, show payment types popup
      // this.setState({ showPaymentTypePopup: true })
    // } else {
      //If we are on an event with a specified payment type, show the join popup
    // }


  updateActionButton(props) {
    let entryFee = props.event.entryFee || 0

    if (this.props.isExpired) {
      props.onChangeAction({
        text: _('back'),
        icon: "back",
        type: "action",
      })
    } else if (props.isMember) {
      props.onChangeAction({
        text: _('quit'),
        icon: "actionRemove",
        type: "action",
      })
    } else if (props.isOrganizer) {
      props.onChangeAction({
        text: _('edit'),
        icon: "actionEdit",
        type: "action",
      })
    } else if (entryFee === 0) {
      props.onChangeAction({
        text: _('join'),
        textLarge: _('free'),
        type: "actionDefault",
      })
    }
    else {
      props.onChangeAction({
        text: _('join'),
        textLarge: '??' + entryFee,
        type: "actionDefault",
      })
    }
  }

  componentWillUnmount() {
    this._actionListener && this._actionListener.remove()
  }

  onPressJoin = () => {
    this.setState({
      showJoinPopup: false,
      joinRequest: true,
    })

    this.props.onPressJoin(this.state.paymentMethod)
  };

  onPressInvite = () => {
    this.props.onPressInvite()
  };

  getIcon(activityKey) {
    return icons[activityKey] || icons.DEFAULT
  }

  render() {
    let event = this.props.event
    let address = event.address
    let ageText
    if (this.props.event.minAge && this.props.event.maxAge) {
      ageText = <Text>{this.props.event.minAge} - {this.props.event.maxAge}</Text>
    } else if (this.props.event.minAge) {
      ageText = <Text>Min Age {this.props.event.minAge}</Text>
    } else if (this.props.event.maxAge) {
      ageText = <Text>Max Age {this.props.event.maxAge}</Text>
    } else {
      ageText = _('noLimit')
    }
    return (
      <View style={{flex: 1}}>
        <Header title={_('eventDetails')} simple />
        <EventJoinPopup
          visible={this.state.showJoinPopup}
          event={this.props.event}
          onPressCancel={() => this.setState({showJoinPopup: false})}
          onPressJoin={this.onPressJoin}
          charge={(this.state.paymentMethod === 'app' && this.props.event.entryFee) ? 0.5 : 0}
        />
        <EventJoinedConfirmation
          visible={this.state.showJoinedConfirmation}
          onClose={() => this.setState({showJoinedConfirmation: false})}
          entryFee={this.props.event.entryFee}
          onPressViewList={() => {
            this.setState({showJoinedConfirmation: false})
            this.props.onPressViewList()
          }}
        />
        <EventQuitPopup
          visible={this.state.showQuitPopup}
          event={this.props.event}
          onPressCancel={() => this.setState({showQuitPopup: false})}
          onPressQuit={() => {
            this.setState({showQuitPopup: false})
            this.props.onPressQuit()
          }}
        />
        <EventDashboard.CancelEventPopup
          visible={this.state.showCancelEventPopup}
          onClose={() => this.setState({showCancelEventPopup: false})}
          onSubmit={(message) => {
            this.setState({showCancelEventPopup: false})
            this.props.onCancelEvent(message)
          }}
        />
        <PaymentTypePopup
          visible={this.state.showPaymentTypePopup}
          onClose={() => this.setState({showPaymentTypePopup: false})}
          onSelect={(paymentMethod) => {
            this.setState({
              showJoinPopup: true,
              showPaymentTypePopup: false,
              paymentMethod,
            })
          }}
        />
        <ErrorPopup
          visible={!!this.props.payments.paymentProcessingError}
          onPressOk={this.props.onClearPaymentError}
          text={this.props.payments.paymentProcessingError}
        />
        <ScrollView style={StyleSheet.eventDetails.style}>
          <View style={StyleSheet.eventDetails.titleStyle}>
            {event.image ? (
              <Image source={{uri: event.image}} style={[StyleSheet.eventDetails.coverImageStyle, {resizeMode: 'cover'}]}  />
            ) : (
              <View style={StyleSheet.eventDetails.coverImageStyle} />
            )}
            <View style={StyleSheet.eventDetails.coverImageOverlayStyle} />

            <View style={StyleSheet.eventDetails.titleButtonBar}>
              <Button
                type="roundedWhiteBorder"
                icon={this.props.isSaved ? "starFilled" : "star"}
                text={this.props.isSaved ? _('saved') : _('save')}
                onPress={this.props.onPressSave}
              />
              <View style={StyleSheet.flex} />
              <Button type="roundedWhiteBorder" icon="plusSmall" text={_('invite')} onPress={this.onPressInvite} />
            </View>

            <Text style={[StyleSheet.text, StyleSheet.eventDetails.titleTextStyle]}>
              {this.props.event.title}
            </Text>
            <TouchableHighlight
              underlayColor="transparent"
              hitSlop={{top: 10, bottom: 10}}
            >
              <Text style={[StyleSheet.text, StyleSheet.eventDetails.subtitleTextStyle]}>
                {address}
              </Text>
            </TouchableHighlight>
          </View>

          {this.props.organizer && (
            <TouchableHighlight
              style={StyleSheet.eventDetails.profileContainer}
              onPress={() => this.props.onPressOrganizer(this.props.organizer)}
              underlayColor="transparent"
            >
              <View style={StyleSheet.eventDetails.avatarStyle}>
                <View style={StyleSheet.eventDetails.avatarContainerStyle}>
                  <Avatar
                    title={this.props.organizer.name}
                    imageUrl={this.props.organizer.imageSrc}
                    avatarStyle={StyleSheet.menu.avatarImage}
                  />
                </View>
                <Text style={[StyleSheet.text, StyleSheet.eventDetails.avatarNameStyle]}>
                  {this.props.organizer.name}
                </Text>
                <Text style={[StyleSheet.text, StyleSheet.eventDetails.avatarOccupationStyle]}>
                  {_('theOrganizer')}
                </Text>
              </View>
            </TouchableHighlight>
          )}

          <EventInfo.Bar>
            <EventInfo icon="attendees" label={_('attendees')}>
              <Text style={StyleSheet.eventDetails.eventInfoTextHighlight}>
                {this.props.event.meta.memberCount}
              </Text>
              {!!this.props.event.maxPlayers && (
                <Text>
                  {'/'}{this.props.event.maxPlayers}
                </Text>
              )}
            </EventInfo>
            <EventInfo
              icon={this.getIcon(this.props.event.activity.id)}
              label={_('activity')}
            >
              {this.props.event.activity.name}
            </EventInfo>
            <EventInfo icon="calendarBig" label={_('dateAndTime')}>
              <DateText event={this.props.event} />
            </EventInfo>
          </EventInfo.Bar>

          <HorizontalRule style={StyleSheet.eventDetails.horizontalRule} />

          <EventInfo.Bar>
            <EventInfo icon={this.props.event.gender + 'Active'} label={_('gender')}>
              {this.props.event.gender === 'male' && _('maleOnly')}
              {this.props.event.gender === 'female' && _('femaleOnly')}
              {this.props.event.gender === 'mixed' && _('mixed')}
            </EventInfo>
            <EventInfo
              icon={this.props.event.courtType === 'outdoor' ? "courtType" : "homeActive"} label={_('courtType')}
            >
              {this.props.event.courtType === 'outdoor' ? _('outdoor') : _('indoor')}
            </EventInfo>
            <EventInfo
              icon="ageIcon2x"
              label={_('ageGroup')}
            >{ageText}</EventInfo>
            {this.props.event.privacy === 'public' && <EventInfo icon="globe" label={_('privacy')}>{_('_public')}</EventInfo>}
            {this.props.event.privacy === 'private' && <EventInfo icon="globe" label={_('privacy')}>{_('_private')}</EventInfo>}
          </EventInfo.Bar>

          <HorizontalRule style={StyleSheet.eventDetails.horizontalRule} />
          <Text style={[StyleSheet.text, StyleSheet.eventDetails.sectionTitleTextStyle]}>{_('eventDescription')}</Text>
          <Text style={[StyleSheet.text, StyleSheet.eventDetails.sectionBodyTextStyle]}>{this.props.event.description}</Text>

          <HorizontalRule style={StyleSheet.eventDetails.horizontalRule} />
          <Text style={[StyleSheet.text, StyleSheet.eventDetails.sectionTitleTextStyle]}>{_('rules')}</Text>
          <Text style={[StyleSheet.text, StyleSheet.eventDetails.sectionBodyTextStyle]}>{this.props.event.rules}</Text>

          <HorizontalRule style={StyleSheet.eventDetails.horizontalRule} />
          <Text style={[StyleSheet.text, StyleSheet.eventDetails.sectionTitleTextStyle]}>{_('notes')}</Text>
          <Text style={[StyleSheet.text, StyleSheet.eventDetails.sectionBodyTextStyle, StyleSheet.doubleMarginBottom]}>{this.props.event.notes}</Text>
        </ScrollView>
      </View>
    )
  }
}

class EventInfo extends Component {
  render() {
    return (
      <View style={[StyleSheet.eventDetails.eventInfoStyle, this.props.style]}>
        <Icon name={this.props.icon} style={StyleSheet.eventDetails.eventInfoIcon} />
        <Text style={[StyleSheet.text, StyleSheet.eventDetails.eventInfoKey]}>
          {this.props.label}
        </Text>
        <Text style={[StyleSheet.text, StyleSheet.eventDetails.eventInfoText]}>
          {this.props.children}
        </Text>
      </View>
    )
  }
}

EventInfo.Summary = class EventSummaryInfo extends Component {
  render() {
    return (
      <View style={[StyleSheet.eventDetails.eventInfoStyle, this.props.style]}>
        <Icon name={this.props.icon} style={StyleSheet.eventDetails.eventInfoIcon} />

        <Text style={[StyleSheet.text, StyleSheet.eventDetails.eventInfoText]}>
          {this.props.children}
        </Text>
      </View>
    )
  }
}

EventInfo.Bar = class EventInfoBar extends Component {
  render() {
    return (
      <View style={[StyleSheet.eventDetails.eventInfoBarStyle, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

class DateText extends Component {

  changeDateFormat(start){
    let day = moment(start).format('llll').replace(/ /g, '\u00a0').substr(0, 11).slice(9, 11) + ' '
    let dateWithoutDay = moment(start).format('llll').replace(/ /g, '\u00a0').substr(0, 9)
    let dayChecker = day.includes(',')

    if (dayChecker){
      day = day.slice(0,1) + ' '
    }

    return insert(dateWithoutDay, 5, day)
  }

  render() {
    let start = moment(this.props.event.date)
    let end = this.props.event.endDate ? moment(this.props.event.endDate) : null
    let newFormatStart = this.changeDateFormat(start)
    let newFormatEnd = this.changeDateFormat(end)

    let startComponent = (
      <Text>
        <Text style={StyleSheet.eventDetails.lightTextStyle}>
          {newFormatStart}
        </Text>
        {!end  && (
          <Text>
            {'\n'}
            <Text style={StyleSheet.eventDetails.hour}>
              {'HH'}
            </Text>
              {moment(start).format('HH:mm')}
            <Text style={StyleSheet.eventDetails.hour}>
              {'mm'}
            </Text>
          </Text>)}
        {end  &&  !moment(end).isSame(start, 'day') && (<Text>{moment(start).format('HH:mm')}{'\n'}</Text>)}
        {end  &&  moment(end).isSame(start, 'day') && (<Text>{'\n'}{moment(start).format('HH:mm')} - </Text>)}
      </Text>
    )

    if (!end) {
      return startComponent
    } else {
      return (
        <Text>
          {startComponent}
          {!moment(end).isSame(start, 'day') && (
            <Text style={StyleSheet.eventDetails.lightTextStyle}>
              {newFormatEnd}
            </Text>
          )}
          <Text>{moment(end).format('HH:mm')}</Text>
        </Text>
      )
    }
  }
}

class EventJoinPopup extends Component {

  render() {
    const formatCharge = (charge) => {
      return (parseFloat(charge) * 100).toFixed(0) + 'p'
    }

    let event = this.props.event
    let address = event.address

    return (
      <Popup visible={this.props.visible} onClose={this.props.onPressCancel}>
        <View style={{ flexGrow: 0}}>
          <View style={[StyleSheet.dialog.alertContentStyle]}>
            <Text style={[StyleSheet.text, StyleSheet.dialog.alertTitleStyle, { textAlign: 'center' }]}>{_('youAreAboutToJoin').toUpperCase()}</Text>
            <Text style={[StyleSheet.text, StyleSheet.dialog.alertTitleStyle, {textAlign: 'center', color: StyleSheet.colors.pink}]}>{event.title.toUpperCase()}</Text>

            <EventInfo.Bar style={[StyleSheet.doubleMarginTop, StyleSheet.dialog.infoBar]}>
              <EventInfo.Summary icon="calendarBig" style={[StyleSheet.halfPaddingBottom]}>
                <DateText event={event} />
              </EventInfo.Summary>
              <EventInfo.Summary icon="pin">
                <Text style={StyleSheet.eventDetails.lightTextStyle}>{address}</Text>
              </EventInfo.Summary>
            </EventInfo.Bar>
          </View>

          <View style={[StyleSheet.buttons.bar] }>
            <Button type="alert" text={_('cancel')} onPress={this.props.onPressCancel} />
            <Button
              type="alertDefault"
              text={
                <Text>
                  <Text>{
                    _('join').toUpperCase()} ??{event.entryFee}
                    {this.props.charge > 0 && (<Text> ({formatCharge(this.props.charge)})</Text>)}
                    {event.entryFee > 0 && this.props.charge === 0 && (<Text>{'(' + _('cash').toUpperCase() + ')'}</Text>)}
                  </Text>
                </Text>
            }
              onPress={this.props.onPressJoin}
            />
          </View>
        </View>
      </Popup>
    )
  }
}

class PaymentTypePopup extends Component {

  render() {
    return (
      <Popup visible={this.props.visible} onClose={this.props.onClose}>
        <Button
          type="alertVertical"
          text={_('cashOnSite')}
          onPress={() => this.props.onSelect('cash')}
        />
        <Button
          type="alertVertical"
          text={_('inAppPayment')}
          onPress={() => this.props.onSelect('app')}
        />
      </Popup>
    )
  }
}

class EventJoinedConfirmation extends Component {

  render() {
    return (
      <Popup visible={this.props.visible} onClose={this.props.onClose}>
        <View style={[StyleSheet.dialog.alertContentStyle]}>
          <Text style={[StyleSheet.text, StyleSheet.dialog.alertTitleStyle]}>
            {_('congrats').toUpperCase()}{'\n'}
            <Text style={{color: StyleSheet.colors.pink}}>{_('youreIn').toUpperCase()}!</Text>
          </Text>
          <Text style={[StyleSheet.text, StyleSheet.dialog.alertBodyStyle, StyleSheet.singleMarginTop]}>
            {this.props.entryFee === 0 ? _('joinConfirmedTextForFree') :
              this.props.charge > 0 ? _('joinConfirmedText').replace('$1', '??' + this.props.entryFee) :
                _('joinConfirmedTextCash')}
          </Text>
        </View>
        <View style={StyleSheet.buttons.bar}>
          <Button type="alert" text={_('close')} onPress={this.props.onClose} />
          <Button type="alertDefault"
            text={_('viewList')}
            onPress={this.props.onPressViewList} />
        </View>
      </Popup>
    )
  }
}

class EventQuitPopup extends Component {

  render() {
    return (
      <Popup visible={this.props.visible} onClose={this.props.onPressCancel}>
        <View style={[StyleSheet.dialog.alertContentStyle]}>
          <Text style={[StyleSheet.text, StyleSheet.dialog.alertTitleStyle]}>
            {_('quitConfirmationTitle')}
          </Text>

          <Text style={[StyleSheet.text, StyleSheet.dialog.alertBodyStyle, StyleSheet.singleMarginTop]}>
            {_('quitConfirmation')}
          </Text>
        </View>

        <View style={StyleSheet.buttons.bar}>
          <Button type="alert" text={_('cancel')} onPress={this.props.onPressCancel} />
          <Button
            type="alertDefault"
            text={_('quit')}
            onPress={this.props.onPressQuit}
          />
        </View>
      </Popup>
    )
  }
}
