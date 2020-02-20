import React, {Component} from 'react'
import {Animated, View, Text, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native'

import {Avatar, Icon} from './'
import _ from '../i18n'
import StyleSheet from '../styles'

class Menu extends Component {

  render() {
    return (
      <View style={StyleSheet.menu.menuContainer}>
        <TouchableWithoutFeedback onPress={this.props.onPressBackground}>
          <Animated.View style={[StyleSheet.menu.menuOverlay, {opacity: this.props.animation}]} />
        </TouchableWithoutFeedback>
        <Animated.View style={[StyleSheet.menu.style, {right: this.props.animation.interpolate({ inputRange: [0, 1], outputRange: [-115, 0] }) }]}>
          <TouchableHighlight underlayColor="transparent" onPress={this.props.onPressProfile}>
            <View style={StyleSheet.menu.header}>
              <Avatar
                title={this.props.user.name}
                imageUrl={this.props.user.imageSrc}
                avatarStyle={StyleSheet.menu.avatarImage}
              />
              <Text style={[StyleSheet.text, StyleSheet.menu.avatarText]}>
                <Text>{this.props.user.name.toUpperCase()}</Text>
              </Text>
            </View>
          </TouchableHighlight>
          <View style={StyleSheet.menu.items}>
            <MenuItem
              active={this.props.currentTab === 'settings'}
              icon="settings"
              text={_('preferences')}
              onPress={() => this.props.onTabPress('settings')}
            />
            {this.props.mode === 'ORGANIZE' ? (
              <MenuItem
                active={this.props.currentTab === 'wallet'}
                icon="payments"
                text={_('myWallet')}
                onPress={() => this.props.onTabPress('wallet')}
              />
            ) : (
              <MenuItem
                active={this.props.currentTab === 'payments'}
                icon="payments"
                text={_('payments')}
                onPress={() => this.props.onTabPress('payments')}
              />
            )}
            {this.props.mode === 'ORGANIZE' ? (
              <MenuItem
                active={this.props.currentTab === 'calendar'}
                icon="calendar"
                text={_('calendar')}
                onPress={() => this.props.onTabPress('calendar')}
              />
            ) : (
              <MenuItem
                active={this.props.currentTab === 'invitations'}
                icon="invitations"
                text={_('invitations')}
                badge={this.props.invitationsBadge}
                onPress={() => this.props.onTabPress('invitations')}
              />
            )}
            <MenuItem
              active={this.props.currentTab === 'friends'}
              icon="friends"
              text={_('friends')}
              onPress={() => this.props.onTabPress('friends')}
            />
          </View>
        </Animated.View>
      </View>
    )
  }
}

class MenuItem extends Component {

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.props.onPress}>
        <View style={StyleSheet.menu.itemContainer}>
          <View>
            <Icon
              name={this.props.icon}
              active={this.props.active}
              style={StyleSheet.menu.icon}
            />
            {!!this.props.badge && (
              <View style={StyleSheet.menu.sidedrawBadgeContainer}>
                <Text style={StyleSheet.menu.badge}>{this.props.badge}</Text>
              </View>
            )}
          </View>

          <Text
            style={[
              StyleSheet.menu.itemText,
              this.props.active && StyleSheet.menu.itemTextActive,
            ]}
          >
            {this.props.text}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

MenuItem.propTypes = {
  text: React.PropTypes.string.isRequired,
  badge: React.PropTypes.number,
  icon: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
  active: React.PropTypes.bool,
}

Menu.Item = MenuItem

export default Menu
