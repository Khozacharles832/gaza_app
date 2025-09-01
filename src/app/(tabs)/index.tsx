import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import products from '../../../assets/data/products';
import Colors from '@/src/constants/Colors';

const product = products[1];
export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image}} style={styles.image}/>
       <Text style={styles.title}>{product.name}</Text>
       <Text style={styles.price}>R{product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  }
});
