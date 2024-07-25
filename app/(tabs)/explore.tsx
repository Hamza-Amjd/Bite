import Input from '@/components/Input';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ThemedView style={{flex:1,justifyContent:'center',backgroundColor:'#f2f4f8'}}>
      <Input label={'Random'} placeholder={"Please enter anything"}/>
      <Input label={'Random2'} placeholder={"Please enter anything"}/>
    </ThemedView>
   );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
