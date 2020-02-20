import React, {Component} from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'

import StyleSheet from '../styles'
import _ from '../i18n'

class Avatar extends Component {

  getAvatarColor() {
    const userName = this.props.title
    const name = userName.toUpperCase().split(' ')

    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`
    } else {
      this.avatarName = ''
    }

    let sumChars = 0
    for(let i = 0; i < userName.length; i++) {
      sumChars += userName.charCodeAt(i)
    }
    // inspired by https://github.com/wbinnssmith/react-user-avatar
    // colors from https://flatuicolors.com/
    const colors = [
      '#e67e22', // carrot
      '#2ecc71', // emerald
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
    ]

    return colors[sumChars % colors.length]
  }

  renderAvatar() {
    // imageSrc = Facebook OR uploaded Avatar
    const uri = this.props.imageUrl

    return (
      <Image
        source={{uri}}
        style={[
          defaultStyles.avatarStyle,
          defaultStyles.avatarImage,
          this.props.avatarStyle]}
      />
    )
  }
  renderInitials() {
    return (
      <View style={[
        defaultStyles.avatarStyle,
        {backgroundColor: this.getAvatarColor()},
        this.props.avatarStyle
      ]}>
        <Text style={[defaultStyles.textStyle, this.props.textStyle]}>
          {this.avatarName}
        </Text>
      </View>
    )
  }

  render() {
    const avatarContent = this.props.imageUrl ? this.renderAvatar() : this.renderInitials()
    let isEnded
    let isCancelled

    this.props.overlay === 'ended' ? isEnded = true : isEnded = false
    this.props.overlay === 'cancelled' ? isCancelled = true : isCancelled = false

    if (this.props.onPress) {
      return (
        <TouchableOpacity accessibilityTraits="image" onPress={this.props.onPress}>
          {avatarContent}
          {this.props.overlay && (isEnded || isCancelled) && (
            <View
              style={[
                StyleSheet.eventListItem.imageOverlay,
                isEnded && StyleSheet.eventListItem.endedImageOverlay,
                isCancelled && StyleSheet.eventListItem.cancelledImageOverlay,
              ]}
            >
              <Text style={StyleSheet.eventListItem.disabledImageText}>
                {isEnded ? _('ended') : _('cancelled')}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )
    } else {
        return (
          <View>
            {avatarContent}
            {this.props.overlay && (isEnded || isCancelled) && (
              <View
                style={[
                  StyleSheet.eventListItem.imageOverlay,
                  isEnded && StyleSheet.eventListItem.endedImageOverlay,
                  isCancelled && StyleSheet.eventListItem.cancelledImageOverlay,
                ]}
              >
                <Text style={StyleSheet.eventListItem.disabledImageText}>
                  {isEnded ? _('ended') : _('cancelled')}
                </Text>
              </View>
            )}
          </View>
        )
    }
  }
}

const defaultStyles = {
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  avatarImage: {
    resizeMode: 'cover'
  },

  textStyle: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '100',
  },
}

Avatar.propTypes = {
  onPress: React.PropTypes.func,
  imageUrl: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  overlay: React.PropTypes.string,
}

export default Avatar
