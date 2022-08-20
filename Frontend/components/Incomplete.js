import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';

export default function Home({navigation, route}) {
  console.log('token from home', route.params.token);
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');

  const getDataFromLocal = async () => {
    let tokenn = AsyncStorage.getItem('@token');
    console.log('token : ', tokenn);
    setToken(tokenn);
  };

  const getData = () => {
    axios
      .get('https://todo-app-sdp4.herokuapp.com/task/incomplete', {
        headers: {
          authorization: 'Bearer ' + route.params.token,
        },
      })
      .then(res => {
        if (res.data.error === false) setTaskItems(res.data.task);
        else {
          Alert.alert(res.data.message);
        }
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  };
  useEffect(() => {
    // getDataFromLocal();
    // Alert.alert(token);
    getData();
  }, [route.params.token]);

  const handleAddTask = () => {
    if (task.length <= 2) {
      Alert.alert('write at least 3 charecture');
      return;
    }
    axios
      .post(
        'https://todo-app-sdp4.herokuapp.com/task/add',
        {text: task},
        {
          headers: {
            authorization: 'Bearer ' + route.params.token,
          },
        },
      )
      .then(res => {
        if (res.data.error === false) {
          getData();
          setTask('');
        } else {
          Alert.alert(res.data.message);
        }
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  };

  const completeTask = id => {
    // Alert.alert(id);
    axios
      .patch(
        `https://todo-app-sdp4.herokuapp.com/task/complete/${id}`,
        {},
        {
          headers: {
            authorization: 'Bearer ' + route.params.token,
          },
        },
      )
      .then(res => {
        if (res.data.error === false) getData();
        else {
          Alert.alert(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert(err.message);
      });
  };
  if (!taskItems) return;
  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
        {/* Today's Tasks */}
        <View style={styles.tasksWrapper}>
          {/* <Text style={styles.sectionTitle}>Today's tasks</Text> */}
          <View style={styles.items}>
            {/* This is where the tasks will go! */}
            {taskItems.map((item, index) => {
              return (
                <View key={item._id} onPress={() => completeTask(item._id)}>
                  {/* <Task text={item}  /> */}
                  <View style={styles.item}>
                    <View style={styles.itemLeft}>
                      <View style={styles.square}></View>
                      <Text style={styles.itemText}>{item.text}</Text>
                    </View>
                    <View style={styles.action}>
                      <TouchableOpacity>
                        <MaterialCommunityIcons
                          onPress={() => completeTask(item._id)}
                          name="check-circle-outline"
                          color="black"
                          size={22}
                        />
                      </TouchableOpacity>
                      {/* <TouchableOpacity>
                        <MaterialCommunityIcons
                          onPress={() => completeTask(index)}
                          name="delete-outline"
                          color="black"
                          size={22}
                        />
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <MaterialCommunityIcons name="add" color="black" size={27} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    // paddingTop: 10,
    // paddingHorizontal: 20,
  },
  sectionTitle: {
    padding: 15,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#009387',
    color: 'white',
    // textAlign: 'center'
  },
  items: {
    marginTop: 15,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: '80%',
  },
  addWrapper: {
    width: 55,
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
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
  action: {
    flexDirection: 'row',
  },
});
