import { View } from 'react-native';
import products from '@assets/data/products';
import ProductListItem from '@components/productListItem';

export default function TabOneScreen() {
  return (
    <View>
      <ProductListItem product={products[5]}/>
      <ProductListItem product={products[1]}/>
    </View>
  );
}

