import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from './CartContent';
import { useNavigation } from '@react-navigation/native';
//import Payment from './Payment';
import HomeBar from './HomeBar';//gọi thanh task

const CartScreen = React.memo(() => {
  const { updateCartItemCount } = useContext(CartContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itemPrices, setItemPrices] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [paidAmounts, setPaidAmounts] = useState({});
  const [paymentSuccessNotificationShown, setPaymentSuccessNotificationShown] = useState(false);
  const navigation = useNavigation();
  


  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  useEffect(() => {
    checkPaymentSuccessNotification(); // Check if payment success notification has been shown for all items
  }, [cartItems]);

  const handleAddCard = useCallback(() => {
    // Logic xử lý khi nhấn nút "Thêm Thẻ"
    // Bạn có thể chuyển hướng đến màn hình thêm thẻ hoặc thực hiện bất kỳ hành động nào khác cần thiết
    console.log('Nút "Thêm Thẻ" đã được nhấn');
    setIsAddingCard(true);
    navigation.navigate('Payment');
  }, [navigation]);
  const checkPaymentSuccessNotification = async () => {
    try {
      const value = await AsyncStorage.getItem('@paymentSuccessNotificationAllItems');
      if (value !== null) {
        // Payment success notification has already been shown for all items
        setPaymentSuccessNotificationShown(true);
      }
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
    }
  };
//////////xóa hết tất cả sp

const handleClearCart = useCallback(async () => {
  try {
    // Xóa tất cả sản phẩm từ giỏ hàng
    await AsyncStorage.removeItem('cartItems');
    setCartItems([]);
    updateCartItemCount(0);
    setTotalPrice(0);
    setItemPrices({});
  } catch (error) {
    console.log('Lỗi trong quá trình xóa giỏ hàng:', error);
    Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình xóa giỏ hàng. Vui lòng thử lại sau.');
  }
}, [updateCartItemCount]);
/////////////////
  const showPaymentSuccessNotification = async () => {
    if (!paymentSuccessNotificationShown) {
      // Show payment success notification

      // Mark that the notification has been shown for all items
      try {
        await AsyncStorage.setItem('@paymentSuccessNotificationAllItems', 'true');
        setPaymentSuccessNotificationShown(true);
      } catch (error) {
        console.error('Error storing data in AsyncStorage:', error);
      }
    }
  };

  const fetchCartItems = useCallback(async () => {
    try {
      const cartItemsData = await AsyncStorage.getItem('cartItems');
      if (cartItemsData) {
        const parsedCartItems = JSON.parse(cartItemsData);
        setCartItems(parsedCartItems);
        updateCartItemCount(getCartItemCount(parsedCartItems));

        const initialItemPrices = {};
        parsedCartItems.forEach((item) => {
          initialItemPrices[item.id] = item.price * item.quantity;
        });
        setItemPrices(initialItemPrices);
      }
    } catch (error) {
      console.log('Error fetching cart items:', error);
    }
  }, [updateCartItemCount]);

  const handleRemoveItem = useCallback(async (itemId) => {
    try {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === itemId && itemId != null) {
          item.quantity = 0;// xóa hết số lượng sản phẩm
          if (item.quantity === 0) {
            return null;
          }
updateItemPrice(itemId, item.quantity);
        }
        return item;
      }).filter(Boolean);

      if (!cartItems.find((item) => item.id === itemId)?.paid) {
        setCartItems(updatedCartItems);
        await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        updateCartItemCount(getCartItemCount(updatedCartItems));
      } else {
        await handlePaymentForItem(itemId);
      }
    } catch (error) {
      console.log('Error removing item from cart:', error);
    }
  }, [cartItems, updateItemPrice, updateCartItemCount, handlePaymentForItem]);
  

  const updateItemPrice = useCallback((itemId, newQuantity) => {
    setItemPrices((prevItemPrices) => {
      const updatedItemPrices = { ...prevItemPrices };
      const updatedItem = cartItems.find((item) => item.id === itemId);

      if (updatedItem) {
        updatedItemPrices[itemId] = updatedItem.price * newQuantity;
        setTotalPrice((prevTotalPrice) => prevTotalPrice + updatedItemPrices[itemId] - prevItemPrices[itemId]);
      }

      return updatedItemPrices;
    });
  }, [cartItems]);

  const calculateTotalPrice = useCallback(() => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalPrice(totalPrice);
  }, [cartItems]);

  const getCartItemCount = useCallback((cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, []);

  const handlePaymentForItem = useCallback(async (itemId) => {
    try {
      console.log(`Processing payment for item ${itemId}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      //Alert.alert('Thanh toán thành công',`\nSản phẩm ${itemId} đã được thanh toán.\nGiá tiền:${itemPrices[itemId]}$`);
      console.log(`Payment successful for item ${itemId}`);
      const updatedPaidAmounts = { ...paidAmounts };
      updatedPaidAmounts[itemId] = itemPrices[itemId];



      setPaidAmounts(updatedPaidAmounts);

      const updatedCartItems = cartItems.filter((item) => {
        if (item.id === itemId) {
          setTotalPrice((prevTotalPrice) => prevTotalPrice - itemPrices[itemId]);
          return false;
        }
        return true;
      });

      setCartItems(updatedCartItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      updateCartItemCount(getCartItemCount(updatedCartItems));

      
      

    

      showPaymentSuccessNotification(); // Show payment success notification for all items
    } catch (error) {
      console.log(`Error during payment for item ${itemId}:`, error);
      throw error;
    }
  }, [cartItems, itemPrices, paidAmounts, updateCartItemCount]);
//Thanh toán tất cả sp
  const handlePayAllItems = useCallback(async () => {
    try {
      setIsProcessingPayment(true);
      if (!isAddingCard) {
        // Nếu nút "Thêm Thẻ" chưa được nhấn, hiển thị thông báo và trả về
        Alert.alert('Thông báo', 'Vui lòng bấm "Thêm Thẻ" trước khi thanh toán tất cả.');
        return;
      }
      if (cartItems.length === 0) {
        // Giỏ hàng trống, hiển thị thông báo và trở về ngay
        Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống!');
        return;
      }
      
      //thanh toán từng sp
      // await Promise.all(
      //   cartItems.map(async (item) => {
      //     if (!item.paid) {
      //       await handlePaymentForItem(item.id);
      //     }
      //   })
      // );
      //thanh toán tất cả sp
      const updatedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          if (!item.paid) {
      await handlePaymentForItem(item.id);
            return { ...item, paid: true };
          } else {
            return item;
          }
        })
      );
      // Hiển thị thông báo thanh toán thành công cho tất cả các sản phẩm
      showPaymentSuccessNotification();
      // Chuyển hướng đến màn hình 'Payment'
      //navigation.navigate('Payment');
      // Xóa tất cả các sản phẩm khỏi giỏ hàng sau khi xử lý thanh toán
      handlePaymentSuccess(updatedCartItems);
      await AsyncStorage.removeItem('cartItems');
      updateCartItemCount(0);
      showPaymentSuccessNotification();
      setIsAddingCard(false);
    } catch (error) {
      console.log('Lỗi trong quá trình thanh toán tất cả sản phẩm:', error);
      Alert.alert(
        'Lỗi thanh toán',
        'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  }, [isAddingCard,cartItems, handlePaymentForItem,handlePaymentSuccess, updateCartItemCount, totalPrice]);

  const handlePaymentSuccess = useCallback(async (updatedCartItems) => {
    try {
      const totalPricePaid = updatedCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      updateCartItemCount(getCartItemCount(updatedCartItems));

      Alert.alert(
        `Bạn đã thanh toán thành công tổng số tiền là $${totalPricePaid.toFixed(2)}.`////
      );

      const allItemsPaid = updatedCartItems.every((item) => item.paid);
      if (allItemsPaid) {
        setCartItems([]);
        await AsyncStorage.removeItem('cartItems');
        updateCartItemCount(0);
        

      }
    } catch (error) {
      console.log('Error handling payment success:', error);
    }
  }, [updateCartItemCount, getCartItemCount, setCartItems, navigation]);

  const handleIncreaseQuantity = useCallback((itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId && itemId != null) {
        item.quantity += 1;
        updateItemPrice(itemId, item.quantity);
      }
      return item;
    });

    setCartItems(updatedCartItems);
    updateCartItemCount(getCartItemCount(updatedCartItems));
    AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    calculateTotalPrice();
  }, [cartItems, updateItemPrice, updateCartItemCount, calculateTotalPrice]);

  const handleDecreaseQuantity = useCallback((itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId && itemId != null) {
        if (item.quantity === 1 || item.quantity < 2) {
          return item;
        }
        item.quantity -= 1;
        updateItemPrice(itemId, item.quantity);
      }
      return item;
    }).filter(Boolean);

    setCartItems(updatedCartItems);
    updateCartItemCount(getCartItemCount(updatedCartItems));
    AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    calculateTotalPrice();
  }, [cartItems, updateItemPrice, updateCartItemCount, calculateTotalPrice]);

  return (
    <>
    <View style={styles.container}>
<Text style={styles.title}>Đơn hàng</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemTitle}>{item.title}</Text>
                <Text style={styles.cartItemPrice}>
                  Giá: ${typeof item.price === 'number' ? item.price * (item.quantity || 0) : 'N/A'}
                </Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)}>
                    <Text style={styles.quantityControlButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
                    <Text style={styles.quantityControlButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Text style={styles.removeItemButton}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePaymentForItem(item.id)}>
                <Text style={styles.checkoutItemButton}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyCartText}>Giỏ hàng của bạn trống!</Text>
      )}
      <Text style={styles.totalPrice}>Tổng giá đơn hàng của bạn: ${totalPrice.toFixed(2)}</Text>
      <TouchableOpacity
        onPress={handlePayAllItems}
        style={styles.checkoutAllButton}
        disabled={isProcessingPayment}
      >
        <Text style={styles.checkoutAllButtonText}>
          {isProcessingPayment ? 'Đang xử lý...' : 'Thanh toán tất cả'}
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity
        onPress={handleAddCard}
        style={styles.checkoutAllButton}
        disabled={isProcessingPayment}
      >
        <Text style={styles.checkoutAllButtonText}>
          {isProcessingPayment ? 'Đang xử lý...' : 'Thêm Thẻ'}
        </Text>
      </TouchableOpacity>

    </View>
    <HomeBar></HomeBar>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityControlButton: {
    fontSize: 18,
    color: 'blue',
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartItemImage: {
    width: '18%',
    height: '90%',
    resizeMode: 'contain',
    marginRight: 8,
  },
  checkoutAllButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
justifyContent: 'center',
  },
  checkoutItemButton:{
    fontSize: 16,
    color: 'blue',
    marginTop: 8,
    marginRight: 8,
  },
  checkoutAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItemPrice: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  removeItemButton: {
    fontSize: 16,
    color: 'red',
    marginTop: 8,
    marginRight: 8,
  },
  emptyCartText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default CartScreen;