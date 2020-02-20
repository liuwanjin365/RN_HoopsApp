import React, {Component} from 'react'
import {View, TouchableHighlight, Text, ActivityIndicator, InteractionManager} from 'react-native'
import _MapView from 'react-native-maps'

import StyleSheet from '../styles'
import icons from '../styles/resources/icons'
import Icon from './icon'

const iconsMap = {
  AMERICAN_FOOTBALL: 'pinAmericanFootball',
  ANGLING: 'pinDefault',
  ARCHERY: 'pinArchery',
  AUTOMOBILE_RACING: 'pinAutomobileRacing',
  BADMINTON: 'pinBadminton',
  BASEBALL: 'pinBaseball',
  BASKETBALL: 'pinBasketball',
  BEACH_VOLLEYBALL: 'pinVolleyball',
  BIKE: 'pinBike',
  BIKE_POLO: 'pinBike',
  BOWLING: 'pinBowling',
  BOXING: 'pinBoxing',
  CANOEING: 'pinCanoeing',
  CARDS: 'pinCards',
  CHESS: 'pinChess',
  DEFAULT: 'pinDefault',
  DISCGOLF: 'pinGolf',
  DIVING: 'pinDiving',
  DODGEBALL: 'pinDodgeball',
  FISHING: 'pinDefault',
  FOOTBALL: 'pinFootball',
  FOOTGOLF: 'pinGolf',
  FRISBEE: 'pinFrisbee',
  FREE_RUNNING: 'pinRunning',
  GOLF: 'pinGolf',
  GYM: 'pinGym',
  GYMNASTICS: 'pinGymnastics',
  HOCKEY: 'pinHockey',
  ICE_HOCKEY: 'pinIceHockey',
  ICE_SKATING: 'pinIceSkating',
  JIU_JITSU: 'pinBoxing',
  KORFBALL: 'pinVolleyball',
  LACROSSE: 'pinLacrosse',
  MOUNTAINEERING: 'pinMountaineering',
  NETBALL: 'pinVolleyball',
  PILOXING: 'pinYoga',
  POOL: 'pinPool',
  RUGBY: 'pinRugby',
  RUNNING: 'pinRunning',
  SKATEBOARDING: 'pinSkateboarding',
  SKIING: 'pinSkiing',
  SNOOKER: 'pinPool',
  SWIMMING: 'pinSwimming',
  TABLE_TENNIS: 'pinTableTennis',
  TAMBURELLO:'pinTennis',
  TAMBOURELLI:'pinTennis',
  TAMBEACH:'pinTennis',
  TENNIS: 'pinTennis',
  YOGA: 'pinYoga',
  VX: 'pinLacrosse',
  ZUMBA: 'pinZumba',
}

class MapView extends Component {

  constructor(props) {
    super(props)

    // Marker record of refs
    this.markers = []
    this.activeMarker

    this.state = {
      renderPlaceholderOnly: true,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderPlaceholderOnly: false
      })
    })
  }

  renderLoader() {
    return (
      <ActivityIndicator
        style={{ marginTop: 20, alignSelf: 'center' }}
        animating={this.state.renderPlaceholderOnly}
      />
    )
  }

  renderMap(region, annotations) {
    return (
      <_MapView
        style={[{flex: 1}, this.props.style]}
        showsPointsOfInterest={true}
        region={region}
        {...this.props}
        onPress={() => {
          for (let i = 0; i < this.markers.length; i++){
            if (this.markers[i].activeMarker) {
              delete this.markers[i].activeMarker
              this.markers[i].hideCallout()
              return
            }
          }
        }}
      >
        {annotations.map((marker, ind) => (
          <_MapView.Marker
            key={ind}
            image={marker.image}
            coordinate={marker.latlng}
            ref={ref => { this.markers[ind] = ref }}

            onPress={(e) => {
              e.stopPropagation()
              this.markers[ind].activeMarker = true
              this.markers[ind].showCallout()
            }}
          >
            <_MapView.Callout style={StyleSheet.mapView.callOut} onPress={marker.rightCalloutView}>
              <TouchableHighlight
                underlayColor="transparent"
              >
                <View style={StyleSheet.mapView.toolTip}>
                  <Text>{marker.title}</Text>
                  <View>
                    <Icon name="chevronRight" />
                  </View>
                </View>
              </TouchableHighlight>
            </_MapView.Callout>
          </_MapView.Marker>
        ))}
      </_MapView>
    )
  }

  render() {
    let annotations = this.props.events.filter(event => {
      return event && event.addressCoords
    }).map(event => {
      return {
        latlng: {
          latitude: event.addressCoords.lat,
          longitude: event.addressCoords.lon
        },
        image: icons[iconsMap[event.activity] || iconsMap.DEFAULT],
        title: event.title,
        rightCalloutView: () => this.props.onPressEvent(event),
      }
    })

    //Calculate region size based on events distances
    let region
    if (this.props.location && this.props.location.lat && this.props.location.lon) {
      let location = this.props.location

      //Calculate the maximum lat/lon delta
      let maxDelta = this.props.events.filter(event => {
        return event && event.addressCoords
      }).reduce((prev, event) => {
        let coords = event.addressCoords

        let deltaLat = Math.abs(coords.lat - location.lat)
        let deltaLon = Math.abs(coords.lon - location.lon)

        return {
          lat: Math.max(deltaLat, prev.lat),
          lon: Math.max(deltaLon, prev.lon),
        }
      }, { lat: 0, lon: 0 })

      region = {
        latitude: location.lat,
        longitude: location.lon,
        latitudeDelta: maxDelta.lat * 0.2, // Double (for left+right) and add some padding.
        longitudeDelta: maxDelta.lon * 0.2,
      }
    } else {
      let minLat, minLon
      let maxLat, maxLon
      this.props.events.forEach(event => {
        if (event && event.addressCoords) {
          let coords = event.addressCoords
          minLat = minLat ? Math.min(minLat, coords.lat) : coords.lat
          maxLat = maxLat ? Math.max(maxLat, coords.lat) : coords.lat
          minLon = minLon ? Math.min(minLon, coords.lon) : coords.lon
          maxLon = maxLon ? Math.max(maxLon, coords.lon) : coords.lon
        }
      })
      if (minLat && maxLat && minLon && maxLon) {
        region = {
          latitude: (minLat + maxLat) / 2, //middle of extreme east+west
          longitude: (minLon + maxLon) / 2, //middle of extreme north+south
          latitudeDelta: Math.max(0.1, Math.abs(minLat - maxLat)),
          longitudeDelta: Math.max(0.1, Math.abs(minLon - maxLon)),
        }
      }
    }
    return (this.state.renderPlaceholderOnly ? this.renderLoader() : this.renderMap(region, annotations))
  }
}

MapView.defaultProps = {
  events: [],
}

export default MapView
