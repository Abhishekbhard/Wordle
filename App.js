import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Keyboard from './src/components/Keyboard'


import { colors } from './src/constants';

const NUMBER_OF_TRIES=6;

export default function App() {
const word="hello";
const letters=word.split(''); //['h','e','l','l','o']
  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <View style={styles.map}>
        <View style={styles.row}>
          {
            letters.map(letter=>(
<View style={styles.cell}/> 
            )
            )

          }

         
       
       
        </View>
       
            </View>

      <Keyboard/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title:{
    color:colors.lightgrey,
    fontSize:32,
    fontWeight:'bold',
    letterSpacing:7
  } ,
  map:{
    alignSelf:'stretch',
    height:100,

  },
  row:{
flexDirection:'row',
alignSelf:'stretch',
justifyContent:'center',

  },
  cell:{
   flex:1,
    height:30,
    borderWidth:1,
    borderColor:colors.grey,
    aspectRatio:1,
    margin:3,
    maxWidth:70


  }
});
