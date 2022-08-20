import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
// let data = ['task1', 'task2']
export default function Complete({ navigation, route }) {
   console.log('token from complete', route.params.token);
  // const [token, setToken] = useState('')
  const [data, setData] = useState([]);

  const getData = () => {
    axios
      .get('https://todo-app-sdp4.herokuapp.com/task/complete', {
        headers: {
          authorization: 'Bearer ' + route.params.token,
        },
      })
      .then(res => {
        if (res.data.error === false) setData(res.data.task);
        else {
          Alert.alert(res.data.message);
        }
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  };
  useEffect(() => {
    // let token = getDataFromLocal();
    // Alert.alert(token);
    // console.log(222222);
    getData();
  });

  const handleDelete = id => {
    // Alert.alert(id);
    axios
      .delete(`https://todo-app-sdp4.herokuapp.com/task/delete/${id}`, {
        headers: {
          authorization: 'Bearer ' + route.params.token,
        },
      })
      .then(res => {
        if (res.data.error === false) getData();
        else {
          Alert.alert(res.data.message);
        }
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  };

  if (!data) return;
  return (
    <ScrollView style={{marginTop: 15}}>
      {data.map(task => (
        <View key={task._id} style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={styles.square}></View>
            <Text style={styles.itemText}>{task.text}</Text>
          </View>
          <View>
            <MaterialCommunityIcons
              onPress={() => handleDelete(task._id)}
              name="delete-outline"
              color="black"
              size={22}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});

