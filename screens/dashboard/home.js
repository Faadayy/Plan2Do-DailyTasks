import { StyleSheet, Text, View, Dimensions, Keyboard, Alert, Image, TouchableOpacity, TextInput, BackHandler, ActivityIndicator } from 'react-native';
import { scale } from '../../utils/dimensions.js';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { useEffect, useState } from 'react';
import ToDoList from './todoList.js';
// import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js';
import DoneList from './doneList.js';
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';





export default function DashBoard({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [taskheader, setTaskHeader] = useState()
    const [taskDescription, setTaskDescription] = useState()
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [taskDate, setTaskDate] = useState()
    const [activeTab, setActiveTab] = useState(1)
    const [modalData, setModalData] = useState()
    const user = auth().currentUser;
    const [tasks, setTasks] = useState([])
    const [update, setUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [datemissing, setDateMissing] = useState(false)
    const [titlemissing, setTitleMissing] = useState(false)

    const todosRef = firestore().collection('users').doc(user?.uid).collection('todos');


    //Date Picker Details
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        setTaskDate(currentDate)
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    //Back Handler for Home Screen
    useEffect(() => {
        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to go back?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);


    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getName();
        }
    }, [isFocused]);



    useEffect(() => {
        return todosRef?.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot?.forEach(doc => {
                const { title, complete, description, dateData, done, timenDateStamp } = doc.data();
                list.push({
                    id: doc.id,
                    title,
                    description,
                    done,
                    dateData,
                    complete,
                    timenDateStamp
                });
                console.log('heyy', timenDateStamp, '\n\n')
            });
            list.sort((a, b) => a - b)


            return setTasks(list);

        });
    }, []);







    const timeGreetings = () => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) {
            return "Good Morning";
        } else if (hour >= 11 && hour < 13) {
            return "Good Noon";
        } else if (hour >= 13 && hour < 15) {
            return "Good After Noon";
        } else if (hour >= 15 && hour < 24) {
            return "Good Evening";
        } else {
            return "Good Evening";
        }
    }

    const generateRandomId = () => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const clearFields = () => {
        setTaskHeader()
        setTaskDate()
        setTaskDescription()
        setLoading(false)
    }

    const handleAddTask = async () => {
        setDateMissing(false)
        setTitleMissing(false)
        if (taskheader) {
            if (taskDate) {
                setLoading(true)
                const newTask = {
                    id: generateRandomId(),
                    done: false,
                    title: taskheader,
                    description: taskDescription ? taskDescription : ' ',
                    dateData: new Date(taskDate).toDateString(),
                    timenDateStamp: new Date().toDateString()
                }
                todosRef.add(newTask)
                    .then(docRef => {
                        clearFields()
                        setUpdate(!update)
                    })
                    .catch(error => {
                        console.error('Error adding todo: ', error);
                        setLoading(false)
                    });

            } else {
                setDateMissing(true)
            }
        } else {
            if (taskDate) {
                setTitleMissing(true)
            } else {

            }
        }
    }



    const handleActiveTAB = (val) => {
        setActiveTab(val)
    }

    const getName = () => {
        return auth().currentUser.displayName
    }



    // const data = {
    //     picture: "https://i.ibb.co/yy6TPCH/profile.jpg",
    // }

    // const dummyPhoto = '../../assets/images/dummyPhoto.png'

    const updateData = (item) => {

        todosRef?.doc(item.id).update({
            done: true
        }).then(() => {
            setModalVisible(false)
        }).catch((error) => {
            console.error(error)
        })
    }

    const deleteTask = (item) => {

        todosRef?.doc(item.id).delete()
            .then(() => {
                setModalVisible(false)
            }).catch((error) => {
                console.error(error)
            })
    }


    return (
        <View keyboardShouldPersistTaps={'handled'} style={styles.container}>
            <View style={styles.imageContainer}>
                <View style={{ flex: 1, marginTop: 4 }}>
                    <Text style={styles.headerText2}>Plan2Do</Text>
                </View>
                <View style={{
                    borderRadius: 100,
                    borderColor: '#D8605B',
                    padding: 2,
                }}>
                    <TouchableOpacity style={{}} onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="ios-settings" size={26} color="#D8605B" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginVertical: 10, }}>
                <Text style={styles.greetingsText}>{`${timeGreetings() + ", " + getName()}`}</Text>
            </View>

            <View style={styles.middleHalf}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={[styles.greetingsText, { marginTop: 5 }]}>Add Task</Text>
                </View>
                <View style={{ marginTop: scale(10) }}>
                    <Text style={styles.titleHeaderText}>Title</Text>
                    <TextInput
                        onChangeText={text => setTaskHeader(text)}
                        value={taskheader}
                        placeholder="Enter Task"
                        style={styles.inputfields}
                        maxLength={30}
                    />
                </View>
                <View style={{ marginTop: scale(10) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.titleHeaderText}>Description</Text>
                        <Text style={styles.optionalText}>{`[optional]`}</Text>
                    </View>
                    <TextInput
                        onChangeText={text => setTaskDescription(text)}
                        value={taskDescription}
                        placeholder="Enter Description"
                        style={[styles.inputfields2, { height: scale(100), textAlignVertical: 'top', }]}
                        maxLength={100}
                        multiline={true}
                        numberOfLines={3}
                    />
                </View>
                {datemissing && <Text style={styles.errorText}>Date not selected. Please choose a date.</Text>}
                {titlemissing && <Text style={styles.errorText}>Title not entered. Please provide a title.</Text>}
                <View style={styles.DatenButtonContainer}>
                    <TouchableOpacity
                        onPress={showDatepicker}
                        style={[styles.datePickerButton, { height: scale(35), }]}
                    >
                        <Icon style={{ marginRight: 9, }} name="date" size={20} color="black" />

                        <Text style={styles.datePickerText}>{!taskDate ? "Set Date" : new Date(taskDate).toDateString()}</Text>
                    </TouchableOpacity>
                    {!loading ? <TouchableOpacity onPress={handleAddTask} style={[styles.addTaskButton, { height: scale(35), width: scale(100) }]}>
                        <Text style={styles.taskButtonText}>Add</Text>
                    </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={handleAddTask} style={[styles.addTaskButton, { height: scale(35), width: scale(100) }]}>
                            <ActivityIndicator size={'small'} />
                        </TouchableOpacity>}
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                        minimumDate={new Date()}
                        dateFormat='day month year'
                    />
                )}
            </View>


            {/* <View style={styles.lowerHalf}> */}
            <View style={styles.todolist}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ paddingLeft: 0, }}>
                        <Text style={styles.headerText}>Tasks List</Text>
                    </View>
                    <View style={styles.completeIncompleteContainer}>
                        <TouchableOpacity onPress={() => handleActiveTAB(1)} style={[styles.taskSettings, { backgroundColor: activeTab == 1 ? '#D8605B' : "#fff" }]}>
                            <Text style={[styles.completeIncompleteText, { color: activeTab === 1 ? "#fff" : "#000" }]}>To-Do</Text>
                        </TouchableOpacity>
                        {/* <View style={{ marginHorizontal: 3, borderLeftWidth: 0.8, height: scale(10) }}></View> */}
                        <TouchableOpacity onPress={() => handleActiveTAB(2)} style={[styles.taskSettings, { backgroundColor: activeTab == 2 ? '#D8605B' : "#fff" }]}>
                            <Text style={[styles.completeIncompleteText, { color: activeTab === 2 ? "#fff" : "#000" }]}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {activeTab === 1 && <ToDoList tasks={tasks} setModalVisible={setModalVisible} setModalData={setModalData} />}
                {activeTab === 2 && <DoneList tasks={tasks} setModalVisible={setModalVisible} setModalData={setModalData} />}
            </View>
            {/* </View> */}




            {modalData && <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} onBackButtonPress={() => setModalVisible(false)}>
                <View style={styles.middleHalf}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={[styles.greetingsText, { marginTop: 5 }]}>Task Details</Text>
                        <TouchableOpacity onPress={() => deleteTask(modalData)}>
                            <MaterialCommunityIcons style={{ marginRight: 9, }} name="delete-outline" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: scale(10) }}>
                        <Text style={styles.titleHeaderText}>Title</Text>
                        <TextInput
                            onChangeText={text => setTaskHeader(text)}
                            value={modalData.title}
                            placeholder="Enter Task"
                            style={styles.inputfields}
                            maxLength={30}
                            editable={false}
                        />
                    </View>
                    <View style={{ marginTop: scale(10) }}>
                        <Text style={styles.titleHeaderText}>Description</Text>
                        <TextInput
                            onChangeText={text => setTaskDescription(text)}
                            value={modalData.description}
                            placeholder="Enter Description"
                            style={[styles.inputfields2, { height: scale(100), textAlignVertical: 'top', }]}
                            maxLength={100}
                            multiline={true}
                            numberOfLines={3}
                            editable={false}

                        />
                    </View>
                    <View style={styles.DatenButtonContainer}>
                        <TouchableOpacity
                            onPress={showDatepicker}
                            style={[styles.datePickerButton, { flex: 1 }]}
                            disabled={true}
                        >
                            <Icon style={{ marginRight: 9, }} name="date" size={20} color="black" />

                            <Text style={styles.datePickerText}>{new Date(modalData.dateData).toDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                    {!modalData.done && <View style={styles.DatenButtonContainer}>
                        <TouchableOpacity onPress={() => { updateData(modalData) }} style={[styles.addTaskButton, { flex: 1, paddingHorizontal: 5 }]}>
                            <Text style={styles.taskButtonText}>Mark as Done</Text>
                        </TouchableOpacity>
                    </View>}

                </View>
            </Modal>}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
    },
    upperHalf: {
        flex: 1,
        backgroundColor: 'rgba(244, 194, 127, 1)',
        // width: scale(width),
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(244, 194, 127, 1)',
        padding: 7,
        borderColor: '#D8605B'
    },
    image: {
        height: scale(40),
        width: scale(40),
        borderRadius: 100,
    },
    nameText: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        fontSize: scale(20),
    },
    inputfields: {
        backgroundColor: '#fff',
        width: scale(301),
        borderRadius: 10,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: scale(10),
        fontSize: scale(14),
        paddingTop: scale(15),
        elevation: 10
    },
    inputfields2: {
        backgroundColor: '#fff',
        borderRadius: 10,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: scale(10),
        fontSize: scale(14),
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emailText: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        fontSize: scale(12),
        marginTop: -10,
        color: 'rgba(52, 52, 52, 0.8)'
    },
    titleHeaderText: {
        fontSize: scale(15),
        fontFamily: 'Poppins-Bold'
    },
    optionalText: {
        fontSize: scale(12),
        fontFamily: 'Poppins-Light',
        marginLeft: 5
    },
    errorText: {
        marginTop: 5,
        fontSize: scale(12),
        fontFamily: 'Poppins-Regular',
        marginLeft: 5,
        color: 'red'
    },
    logoutButton: {
        marginTop: 15,
        backgroundColor: '#D8605B',
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 30,
        elevation: 10
    },
    logoutText: {
        fontFamily: 'Poppins-Regular',
        fontSize: scale(15),
        color: '#fff',
        marginTop: scale(3)
    },
    middleHalf: {
        // flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        elevation: 5,
        borderRadius: 15,
        width: width * 0.85,
        alignSelf: 'center',
        paddingVertical: 10,
        marginBottom: 30
    },
    DatenButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: 10,
        marginTop: 10,
        // width: "50%"
    },
    greetingsText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(18),
        textAlign: 'center'
    },
    lowerHalf: {
        flex: 1,

        // backgroundColor: 'red',
        // maxHeight: 400,
    },
    headerText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(20)
    },
    headerText2: {
        fontFamily: 'Poppins-Bold',
        fontSize: scale(20),
        color: '#000'
    },
    todolist: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        elevation: 5,
        borderRadius: 15,
        // height: '50%',
        width: width * 0.85,
        alignSelf: 'center',
        paddingVertical: 5,
        marginBottom: 10,
        // overflow: 'hidden'
    },
    addTasksContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        elevation: 5,
        borderRadius: 15,
        width: width * 0.85,
        // maxHeight: height * 0.5,
        alignSelf: 'center',
        paddingVertical: 10,
        // marginBottom: 10
    },
    taskSettings: {
        alignItems: 'center',
        paddingHorizontal: scale(15),
        paddingVertical: scale(5),
        borderRadius: 5,
        // flex: 1
    },
    addTaskButtonHandle: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: 5,
    },
    image2: {
        height: 35,
        width: 35
    },
    completeIncompleteText: {
        fontFamily: 'Poppins-Medium',
        fontSize: scale(11),
    },
    modalView: {
        marginHorizontal: 10,
        backgroundColor: '#F194FF',
        borderRadius: 20,
        paddingHorizontal: 35,
        paddingVertical: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalHeaderText: {
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        color: '#D8605B',
        fontSize: scale(17)
    },
    addTaskButton: {
        backgroundColor: '#D8605B',
        paddingHorizontal: 30,
        paddingVertical: 4,
        borderRadius: 5,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    taskButtonText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        marginTop: 3,
        fontSize: scale(14)
    },
    datePickerButton: {
        backgroundColor: '#fff',
        borderRadius: 5,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: scale(20),
        paddingVertical: scale(5),
        elevation: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    datePickerText: {
        fontFamily: 'Poppins-Medium',
        fontSize: scale(13),
        marginTop: 4
    },
    completeIncompleteContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        fontFamily: 'Poppins-Regular',
        marginTop: 3,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    activeTab: {

    }
});
