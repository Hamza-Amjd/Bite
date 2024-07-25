import {  Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { SIZES } from '@/constants/theme'
import { useNavigation } from 'expo-router'
import { useRoute } from '@react-navigation/native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import images from '@/constants/images'


const OrderDelivery = () => {
  const mapView = React.useRef()
  const colorScheme = useColorScheme() ?? 'light';
  const navigation = useNavigation();
    const route=useRoute();
    const [restaurant, setRestaurant] = React.useState(null)
    const [streetName, setStreetName] = React.useState("")
    const [fromLocation, setFromLocation] = React.useState(null)
    const [toLocation, setToLocation] = React.useState(null)
    const [region, setRegion] = React.useState(null)

    const [duration, setDuration] = React.useState(0)
    const [isReady, setIsReady] = React.useState(false)
    const [angle, setAngle] = React.useState(0)

    React.useEffect(() => {
        let { restaurant, currentLocation } = route.params;

        let fromLoc = currentLocation.gps
        let toLoc = restaurant.location
        let street = currentLocation.streetName

        let mapRegion = {
            latitude: (fromLoc.latitude + toLoc.latitude) / 2,
            longitude: (fromLoc.longitude + toLoc.longitude) / 2,
            latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
            longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2
        }

        setRestaurant(restaurant)
        setStreetName(street)
        setFromLocation(fromLoc)
        setToLocation(toLoc)
        setRegion(mapRegion)

    }, [])

    function calculateAngle(coordinates) {
        let startLat = coordinates[0]["latitude"]
        let startLng = coordinates[0]["longitude"]
        let endLat = coordinates[1]["latitude"]
        let endLng = coordinates[1]["longitude"]
        let dx = endLat - startLat
        let dy = endLng - startLng

        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    function zoomIn() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2
        }

        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 200)
    }

    function zoomOut() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2
        }

        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 200)
    }

    function renderMap() {
        const destinationMarker = () => (
            <Marker
                coordinate={toLocation}
            >
                <View
                    style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff'
                    }}
                >
                    <View
                        style={{
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors[colorScheme].primary
                        }}
                    >
                    </View>
                </View>
            </Marker>
        )

        const carIcon = () => (
            <Marker
                coordinate={fromLocation}
                anchor={{ x: 0.5, y: 0.5 }}
                flat={true}
                rotation={angle}
            >
            </Marker>
        )

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapView}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    style={{ flex: 1 }}
                >
                    <MapViewDirections
                    apikey='AAIzaSyD6_LLF0tuGCR1aWs-qCa9wCNTnSesSh9s'

                        origin={fromLocation}
                        destination={toLocation}
                        strokeWidth={5}
                        strokeColor={Colors[colorScheme].primary}
                        optimizeWaypoints={true}
                        onReady={result => {
                            setDuration(result.duration)

                            if (!isReady) {
                                // Fit route into maps
                                mapView.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (SIZES.width / 20),
                                        bottom: (SIZES.height / 4),
                                        left: (SIZES.width / 20),
                                        top: (SIZES.height / 8)
                                    }
                                })

                                // Reposition the car
                                let nextLoc = {
                                    latitude: result.coordinates[0]["latitude"],
                                    longitude: result.coordinates[0]["longitude"]
                                }

                                if (result.coordinates.length >= 2) {
                                    let angle = calculateAngle(result.coordinates)
                                    setAngle(angle)
                                }

                                setFromLocation(nextLoc)
                                setIsReady(true)
                            }
                        }}
                    />
                    {destinationMarker()}
                    {fromLocation? carIcon() : null}
                </MapView>
            </View>
        )
    }

    function renderDestinationHeader() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 0,
                    right: 0,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: SIZES.width * 0.9,
                        paddingVertical: 15,
                        paddingHorizontal: 15 * 2,
                        borderRadius: 20,
                        backgroundColor: "white"
                    }}
                >
                    

                    <View style={{ flex: 1 }}>
                        <Text style={{ }}>{streetName}</Text>
                    </View>

                    <Text style={{}}>{Math.ceil(duration)} mins</Text>
                </View>
            </View>
        )
    }

    function renderDeliveryInfo() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        width: SIZES.width * 0.9,
                        paddingVertical: 15 * 3,
                        paddingHorizontal: 15 * 2,
                        borderRadius: 20,
                        backgroundColor: "white"
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Avatar */}
                        <View style={{ width: 50, height: 50, borderRadius: 30, backgroundColor: Colors[colorScheme].primary, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={restaurant?.courier.avatar} style={{width: 50, height: 50,}} />
                        </View>

                        <View style={{ flex: 1,paddingLeft:15, }}>
                            {/* Name & Rating */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
                                <Text style={{fontWeight:'bold',fontSize:18}}>{restaurant?.courier.name}</Text>
                                <View style={{ flexDirection: 'row' ,alignItems:'center'}}>
                                   <Ionicons name="star" size={15} color={Colors.light.primary}/>
                                    <Text style={{fontSize:16 }}>{"  4.7"}</Text>
                                </View>
                            </View>

                            {/* Restaurant */}
                            <Text style={{ color: 'grey' }}>{restaurant?.name}</Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 15 * 2,
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 50,
                                marginRight: 10,
                                backgroundColor: Colors.light.primary,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                            onPress={() => navigation.navigate("(tabs)")}
                        >
                            <Text style={{  color: '#fff',fontWeight:'bold',fontSize:16 }}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                backgroundColor:"rgba(1,1,1,0.08)"
                            }}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={{ fontWeight:'bold',fontSize:16}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }

    // function renderButtons() {
    //     return (
    //         <View
    //             style={{
    //                 position: 'absolute',
    //                 bottom: SIZES.height * 0.35,
    //                 right: SIZES.padding * 2,
    //                 width: 60,
    //                 height: 130,
    //                 justifyContent: 'space-between'
    //             }}
    //         >
    //             {/* Zoom In */}
    //             <TouchableOpacity
    //                 style={{
    //                     width: 60,
    //                     height: 60,
    //                     borderRadius: 30,
    //                     backgroundColor: Colors.light.white,
    //                     alignItems: 'center',
    //                     justifyContent: 'center'
    //                 }}
    //                 onPress={() => zoomIn()}
    //             >
    //                 <Text style={{}}>+</Text>
    //             </TouchableOpacity>

    //             {/* Zoom Out */}
    //             <TouchableOpacity
    //                 style={{
    //                     width: 60,
    //                     height: 60,
    //                     borderRadius: 30,
    //                     backgroundColor: Colors["light"].white,
    //                     alignItems: 'center',
    //                     justifyContent: 'center'
    //                 }}
    //                 onPress={() => zoomOut()}
    //             >
    //                 <Text style={{}}>-</Text>
    //             </TouchableOpacity>
    //         </View>

    //     )
    // }

    return (
        <View style={{ flex: 1 }}>
            {renderMap()}
            {renderDestinationHeader()}
            {renderDeliveryInfo()}
            {/* {renderButtons()} */}
        </View>
    )
     
}

export default OrderDelivery

const styles = StyleSheet.create({
  container: {
        flex: 1,
      },
      map: {
        width: '100%',
        height: '100%',
      },})