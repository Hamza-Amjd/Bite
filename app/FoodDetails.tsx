import { Animated, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '@/constants/icons';
import { Colors } from '@/constants/Colors';
import { SIZES } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

const FoodDetails = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const navigation = useNavigation();
    const route=useRoute();
    const scrollX = new Animated.Value(0);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any>([]);

    useEffect(() => {
        //@ts-ignore
        let { item, currentLocation } = route.params;

        setRestaurant(item)
        setCurrentLocation(currentLocation)
    })

    scrollX.addListener(() => { return});
//@ts-ignore
    function editOrder(action, menuId, price) {
        let orderList = orderItems.slice()
        let item:any = orderList.filter((a:any) => a.menuId == menuId)

        if (action == "+") {
            if (item.length > 0) {
                let newQty = item[0].qty + 1
                item[0].qty = newQty
                item[0].total = item[0].qty * price
            } else {
                const newItem = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price
                }
                orderList.push(newItem)
            }

            setOrderItems(orderList)
        } else {
            if (item.length > 0) {
                if (item[0]?.qty > 0) {
                    let newQty = item[0].qty - 1
                    item[0].qty = newQty
                    item[0].total = newQty * price
                }
            }

            setOrderItems(orderList)
        }
    }
        //@ts-ignore
    function getOrderQty(menuId) {
        //@ts-ignore
        let orderItem = orderItems.filter(a => a.menuId == menuId)

        if (orderItem.length > 0) {
            return orderItem[0].qty
        }

        return 0
    }

    function getBasketItemCount() {
        //@ts-ignore
        let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0)

        return itemCount
    }

    function sumOrder() {
        //@ts-ignore
        let total = orderItems.reduce((a, b) => a + (b.total || 0), 0)

        return total.toFixed(2)
    }

    function renderHeader() {
        return (
            <ThemedView style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:15}}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={30} color={Colors[colorScheme].icon} />
                </TouchableOpacity>

                {/* Restaurant Name Section */}
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 10,
                            borderRadius: 20,
                            backgroundColor: Colors[colorScheme].backgroundOpacity
                        }}
                    >
                        <ThemedText type='defaultSemiBold'>{restaurant?.name}</ThemedText>
                    </View>
                </View>

                <TouchableOpacity>
                    <Ionicons name="list" size={30} color={Colors[colorScheme].icon} />
                </TouchableOpacity>
            </ThemedView>
        )
    }

    function renderFoodInfo() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { x: scrollX } } }
                ], { useNativeDriver: false })}
            >
                {//@ts-ignore
                    restaurant?.menu.map((item, index) => (
                        <ThemedView
                            key={`menu-${index}`}
                            style={{ alignItems: 'center' }}
                        >
                            <View style={{ height: SIZES.height * 0.35 }}>
                                {/* Food Image */}
                                <Image
                                    source={item.photo}
                                    resizeMode="cover"
                                    style={{
                                        width: SIZES.width,
                                        height: "100%"
                                    }}
                                />

                                {/* Quantity */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: - 20,
                                        width: SIZES.width,
                                        height: 50,
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: Colors[colorScheme].tint,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderTopLeftRadius: 25,
                                            borderBottomLeftRadius: 25
                                        }}
                                        onPress={() => editOrder("-", item.menuId, item.price)}
                                    >
                                        <Text style={{fontSize:22,fontWeight:'bold'}}>-</Text>
                                    </TouchableOpacity>

                                    <View
                                        style={{
                                            width: 50,
                                            backgroundColor:Colors[colorScheme].tint,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{fontSize:22,fontWeight:'bold'}}>{getOrderQty(item.menuId)}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: Colors[colorScheme].tint,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderTopRightRadius: 25,
                                            borderBottomRightRadius: 25
                                        }}
                                        onPress={() => editOrder("+", item.menuId, item.price)}
                                    >
                                        <Text style={{fontSize:22,fontWeight:'bold'}}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Name & Description */}
                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: 'center',
                                    marginTop: 15,
                                    paddingHorizontal: SIZES.padding * 2
                                }}
                            >
                                <ThemedText style={{ marginVertical: 10, textAlign: 'center' }}>{item.name} - {item.price.toFixed(2)}</ThemedText>
                                <ThemedText style={{  }}>{item.description}</ThemedText>
                            </View>

                            {/* Calories */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10
                                }}
                            >
                                <Image
                                    source={icons.fire}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 10
                                    }}
                                />

                                <ThemedText >{item.calories.toFixed(2)} cal</ThemedText>
                            </View>
                        </ThemedView>
                    ))
                }
            </Animated.ScrollView>
        )
    }

    function renderDots() {

        const dotPosition = Animated.divide(scrollX, SIZES.width)

        return (
            <View style={{ height: 30 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: SIZES.padding
                    }}
                >
                    {//@ts-ignore
                    restaurant?.menu.map((item, index) => {

                        const opacity = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: "clamp"
                        })

                        const dotSize = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
                            extrapolate: "clamp"
                        })

                        const dotColor = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: ['grey', Colors[colorScheme].primary, "grey"],
                            extrapolate: "clamp"
                        })

                        return (
                            <Animated.View
                                key={`dot-${index}`}
                                //@ts-ignore
                                opacity={opacity}
                                style={{
                                    borderRadius: SIZES.radius,
                                    marginHorizontal: 6,
                                    width: dotSize,
                                    height: dotSize,
                                    backgroundColor: dotColor
                                }}
                            />
                        )
                    })}
                </View>
            </View>
        )
    }

    function renderOrder() {
        return (
            <View>
                {
                    renderDots()
                }
                <View
                    style={{
                        backgroundColor: Colors[colorScheme].background,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3,
                            borderBottomColor: Colors[colorScheme].backgroundOpacity,
                            borderBottomWidth: 1
                        }}
                    >
                        <ThemedText type='defaultSemiBold'>{getBasketItemCount()} items in Cart</ThemedText>
                        <ThemedText type='defaultBold'>${sumOrder()}</ThemedText>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                        <Ionicons name="location-sharp" size={30} color={Colors[colorScheme].icon} />
                            <ThemedText style={{ marginLeft: SIZES.padding,  }}>Location</ThemedText>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={icons.master_card}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: Colors[colorScheme].primary
                                }}
                            />
                            <ThemedText style={{ marginLeft: SIZES.padding,  }}>8888</ThemedText>
                        </View>
                    </View>

                    {/* Order Button */}
                    <View
                        style={{
                            padding: SIZES.padding * 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: SIZES.width * 0.9,
                                padding: SIZES.padding,
                                backgroundColor: Colors[colorScheme].primary,
                                alignItems: 'center',
                                borderRadius: SIZES.radius
                            }}
                            //@ts-ignore
                            onPress={() => navigation.navigate("OrderDelivery", {
                                restaurant: restaurant,
                                currentLocation: currentLocation
                            })}
                        >
                            <ThemedText type='defaultBold' style={{ color:'white' }}>Order</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                
            </View>
        )
    }

    return (
        <SafeAreaView style={{flex: 1,
        paddingTop:30,backgroundColor: Colors[colorScheme].background}}>
            {renderHeader()}
             {renderFoodInfo()}
           {renderOrder()}
        </SafeAreaView>
    )
}

export default FoodDetails
