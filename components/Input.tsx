import { StyleSheet, Text, TextInput, View,Animated, Easing } from 'react-native'
import React, { useRef } from 'react'
import { ThemedText } from './ThemedText'
import { Colors } from '@/constants/Colors'

type inputProps={
    label: string,
  placeholder: string
}
  
const Input:React.FC<inputProps> = ({label,placeholder}) => {
    const transY= useRef(new Animated.Value(0))
    const borderWidth= useRef(new Animated.Value(0))
    
    const handleFocus=()=>{
        Animated.timing(transY.current,{
            toValue:-35,
            duration:200,
            useNativeDriver:true,
            easing:Easing.ease,
        }).start()
        Animated.timing(borderWidth.current,{
            toValue:3,
            duration:200,
            useNativeDriver:true,
            easing:Easing.ease,
        }).start()
    };
    const handleBlur=()=>{
        Animated.timing(transY.current,{
            toValue:0,
            duration:200,
            useNativeDriver:true,
            easing:Easing.ease,
        }).start()
        Animated.timing(borderWidth.current,{
            toValue:0,
            duration:200,
            useNativeDriver:true,
            easing:Easing.ease,
        }).start()
    };
    const transX= transY.current.interpolate({
        inputRange:[-35,0],
        outputRange:[-8,0],
        extrapolate:'clamp',
    })
    const labelColor= borderWidth.current.interpolate({
        inputRange:[0,2],
        outputRange:["grey","black"],
        extrapolate:'clamp',
    })
    return (
    <Animated.View style={[{width:"90%",height:50,paddingHorizontal:10,marginTop:30,backgroundColor:'#FFFFFF',borderRadius:10,justifyContent:'center',alignSelf:'center',borderColor:Colors.light.primary},{borderWidth:1}]}>
        <Animated.View style={{position:'absolute',padding:10,transform:[{translateY:transY.current},{translateX:transX}]}}>
            <Animated.Text style={{}}>{label}</Animated.Text>
        </Animated.View>
      <TextInput
        style={{flex:1}}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({})

export default Input