import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView ,Alert} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
//import handleClearCart from './CartScreen';
const Payment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
const [expiryDateError, setExpiryDateError] = useState('');
const [cvvError, setCVVError] = useState('');

  
  // Định nghĩa hàm handlePayment
  const handlePayment = () => {
    ////
    if (cardNumber.length !== 16) {
      setCardNumberError('Số thẻ phải có đúng 16 chữ số');
      return;
    } else {
      setCardNumberError('');
    }
    if (cvv.length !== 3) {
      setCVVError('CVV phải có đúng 3 chữ số');
      return;
    } else {
      setCVVError('');
    }
    const currentDate = new Date();
  const expiryArray = expiryDate.split('/');
  const expiryMonth = parseInt(expiryArray[0], 10);
  const expiryYear = parseInt(`20${expiryArray[1]}`, 10);

  if (expiryYear < currentDate.getFullYear() || (expiryYear === currentDate.getFullYear() && expiryMonth < currentDate.getMonth() + 1)) {
    setExpiryDateError('Ngày hết hạn không hợp lệ');
    return;
  } else {
    setExpiryDateError('');
  }
    ///////
    // Logic xử lý thanh toán của bạn sẽ ở đây
    console.log('Đã xử lý thanh toán!');
    Alert.alert('Thành công', 'Thêm thẻ thành công!');
  };
  
  // Hàm để xử lý việc xóa giỏ hàng
  const handleClearCart = () => {
    // Xử lý thanh toán khi nhấn nút "Thanh toán"
    handleClearCart(); // Xóa tất cả sp
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../Image/logo1.jpg')} style={styles.logo} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Số thẻ</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số thẻ"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <Text style={styles.errorText}>{cardNumberError}</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ngày hết hạn</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <Text style={styles.errorText}>{expiryDateError}</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>CVV</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập CVV"
          value={cvv}
          onChangeText={setCVV}
          secureTextEntry
        />
        <Text style={styles.errorText}>{cvvError}</Text>
      </View>

      <View style={styles.paymentOptions}>
        <Text style={styles.paymentLabel}>Chọn phương thức thanh toán</Text>
        <View style={styles.paymentIcons}>
          <FontAwesome name="cc-mastercard" size={40} color="#FF6F00" style={styles.paymentIcon} />
          <FontAwesome name="cc-paypal" size={40} color="#00457C" style={styles.paymentIcon} />
          <FontAwesome name="cc-visa" size={40} color="#6772E5" style={styles.paymentIcon} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Thêm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  logo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  paymentOptions: {
    marginBottom: 20,
  },
  paymentLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  paymentIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentIcon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#ee4d2d',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Payment;