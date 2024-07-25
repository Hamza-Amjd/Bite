import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";;
import { useColorScheme } from "@/hooks/useColorScheme";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  // @ts-ignore
  // const TabBarCustomButton = ({ accessibilityState, childern, onPress }) => {
  //   var isSelected = accessibilityState.selected;
  //   if (isSelected) {
  //     return (
  //       <TouchableOpacity
  //         style={{
  //           flex: 1,
  //           height: 60,
  //           backgroundColor: Colors[colorScheme ?? "light"].background,
  //         }}
  //         activeOpacity={1}
  //         onPress={onPress}
  //       >
  //         {childern}
  //       </TouchableOpacity>
  //     );
  //   } else {
  //     return (
  //       <TouchableOpacity
  //         style={{
  //           flex: 1,
  //           backgroundColor: Colors[colorScheme ?? "light"].background,
  //         }}
  //         activeOpacity={1}
  //         onPress={onPress}
  //       >
  //         {childern}
  //       </TouchableOpacity>
  //     );
  //   }
  // };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'rgba(130, 99, 72,0.2)',
          elevation: 0,
          borderTopWidth: 0,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({  focused }) => (
            <TabBarIcon
              name={focused ? "fast-food" : "fast-food-outline"}
              size={ 35}
              color={"#fc6203"}
            />
          ),
          // @ts-ignore
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({  focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search-outline"}
              size={30}
              color={"#fc6203"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "heart" : "heart-outline"}
              size={ 30}
              color={"#fc6203"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              size={ 30}
              color={"#fc6203"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
