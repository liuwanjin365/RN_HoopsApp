import React, {Component} from 'react'
import {View, Image, Text, TouchableHighlight} from 'react-native'
import moment from 'moment'

import {Avatar, Icon} from '../components'
import _ from '../i18n'
import StyleSheet from '../styles'

class EventListItem extends Component {

  render() {
    let event = this.props.event
    if(!event) {
      return null
    }

    let date = moment(event.date).calendar(null, {
      sameDay: "[Today], HH:mm",
      nextDay: "[Tomorrow], HH:mm",
    })

    let overlay

    if (event.meta.isEnded) { overlay = 'ended' }
    if (event.meta.isCancelled) { overlay = 'cancelled' }

    let textColorStyle = (!this.props.ignoreDisabled && event.meta.isDisabled) ?
      StyleSheet.eventListItem.disabledText :
      null
    return (
      <TouchableHighlight
        style={[StyleSheet.eventListItem.container, this.props.style]}
        onPress={this.props.onPress}
        activeOpacity={1.0}
        underlayColor={StyleSheet.eventListItem.underlayColor}
      >
        <View style={StyleSheet.eventListItem.wrapper}>
          {this.props.event.entryFee === 0 && (
            <Icon name="free" style={StyleSheet.eventListItem.freeIcon}/>
          )}
          <View style={StyleSheet.eventListItem.imageContainer}>
            {event && event.image === undefined ?
              <Avatar
                title={event.title}
                avatarStyle={[StyleSheet.eventListItem.avatarStyle]}
                overlay={overlay}
              />
              : <Avatar
                  title={event.title}
                  imageUrl={event.image}
                  avatarStyle={[StyleSheet.eventListItem.avatarStyle]}
                 overlay={overlay}
                />
             }
          </View>
          <View style={StyleSheet.eventListItem.textContainer}>
            {this.props.showDistance && event.distance && (
              <Text
                style={[
                  StyleSheet.text,
                  StyleSheet.eventListItem.distance,
                  textColorStyle
                ]}
              >
                {event.distance.toFixed(2)} mi
              </Text>
            )}
            <Text
              style={[
                StyleSheet.eventListItem.text,
                StyleSheet.eventListItem.title,
                textColorStyle,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {event.title}
            </Text>
            <Text
              style={[
                StyleSheet.eventListItem.text,
                StyleSheet.eventListItem.detail,
                textColorStyle,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {_('players')}&nbsp;
              <Text style={[StyleSheet.eventListItem.highlight, textColorStyle]}>
                <Text>{event.meta.memberCount}</Text>
                {!!event.maxPlayers && <Text>/{event.maxPlayers}</Text>}
              </Text>
              {'\u00a0\u00a0|\u00a0\u00a0'}
              {_('level')}&nbsp;
              <Text style={[StyleSheet.eventListItem.highlight, textColorStyle]}>
                {event.level}
              </Text>
            </Text>
            <View style={StyleSheet.eventListItem.bottomText}>
              <View style={{flex: -1}}>
                <Text
                  numberOfLines={1}
                  style={[
                    StyleSheet.eventListItem.detail,
                    StyleSheet.eventListItem.venue,
                    textColorStyle,
                  ]}
                >
                  {event.address}
                </Text>
              </View>
              <View style={{flex: 0}}>
                <Text
                  style={[
                    StyleSheet.eventListItem.date,
                    StyleSheet.eventListItem.detail,
                    textColorStyle,
                  ]}
                > | {date}</Text>
              </View>
            </View>
          </View>
          {!this.props.hideDisclosure && (
            <TouchableHighlight
              underlayColor={StyleSheet.colors.transparent}
              onPress={this.props.onPressDisclosure}
              hitSlop={{top: 10, right: 10, bottom: 10, left: 0}}
            >
              <Image
                source={this.props.disclosure || StyleSheet.icons.chevronRight}
                style={StyleSheet.eventListItem.disclosure}
              />
            </TouchableHighlight>
          )}
        </View>
      </TouchableHighlight>
    )
  }
}

export default EventListItem
