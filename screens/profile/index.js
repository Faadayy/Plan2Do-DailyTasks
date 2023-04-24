import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Alert, Keyboard, ActivityIndicator, Image, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import { scale } from '../../utils/dimensions.js';
const width = Dimensions.get('window').width;
import { useEffect, useState } from 'react';
// import DataList from './datalist';
// import Modal from "react-native-modal";
// import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons.js';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import Modal from "react-native-modal";
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';

const nowDate = () => {
    const d = new Date();
    let second = d.getSeconds();
    let minute = d.getMinutes();
    let hour = d.getHours();
    return { second, minute, hour };
};

const nowTimer = () => {
    const { second, minute, hour } = nowDate();
    const [state, setState] = useState({
        second,
        minute,
        hour,
    });

    useEffect(() => {
        setInterval(() => {
            const { second, minute, hour } = nowDate();
            setState({ second, minute, hour });
        }, 1000);
    }, [useState]);
    return state;
};

export default function DashBoard({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const [oldPassword, setOldPassword] = useState()
    const [mode, setMode] = useState("")
    const [loading, setLoading] = useState(false)
    const [nameUpdate, setNameUpdate] = useState(false)
    const [passwordUpdate, setPasswordUpdate] = useState(false)
    const [logoutModalVisible, setLogoutModalVisible] = useState(false)
    const [logoutLoader, setLogoutLoader] = useState(false)


    const handleLogout = () => {
        setLogoutLoader(true)
        setTimeout(() => {
            auth()
                .signOut()
                .then(() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Login' }, // replace 'Login' with the name of your app's login screen
                            ],
                        })
                    )
                });
        }, 3000);
    }

    const updateName = () => {
        setModalVisible(true)
        setMode('name')
    }


    //Back Handler for Profile Screen
    useEffect(() => {
        const backAction = () => {
            navigation.goBack()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const updatePass = () => {
        setModalVisible(true)
        setMode('pass')

    }

    const updateDetails = async (trait) => {
        if (trait === 'name') {
            if (name) {
                setLoading(true)
                auth().currentUser.updateProfile({
                    displayName: name,
                }).then(() => {
                    setModalVisible(false)
                    Keyboard.dismiss()
                }).finally(() => {
                    setLoading(false)
                })
                const updatedUser = auth().currentUser;

            }
        } else {
            if (password) {
                setLoading(true)
                auth().signInWithEmailAndPassword(auth().currentUser.email, oldPassword)
                    .then(() => {
                        auth().currentUser.updatePassword(password).then(() => {

                        })
                    })
                    .catch((error) => {
                        if (error.code == 'auth/wrong-password') {
                            Alert.alert('iNCORRECT pASSWORD')
                        }
                        console.log(error)
                    }).finally(() => {
                        setModalVisible(false)
                        Keyboard.dismiss()
                        setLoading(false)
                        // setTimeout(() => {

                        // }, 3000);
                    })

            }
        }
    }


    const data = {
        name: auth().currentUser?.displayName,
        email: auth().currentUser?.email,
        picture: "https://i.ibb.co/yy6TPCH/profile.jpg",
        todos: [{}]
    }
    return (
        <View style={styles.container}>
            <View style={styles.upperHalf}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', padding: 10, marginBottom: -20 }}>
                    <Ionicons style={{ marginBottom: 4, marginRight: 9, }} name="arrow-back-circle" size={40} color="#D8605B" />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={require('../../assets/images/dummyPhoto.png')} />
                </View>
                <View>
                    <Text style={styles.nameText}>{data.name}</Text>
                    <Text style={styles.emailText}>{data.email}</Text>
                </View>
                <TouchableOpacity onPress={() => setLogoutModalVisible(true)} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.lowerHalf}>
                <TouchableOpacity style={styles.optionsProfile} onPress={updateName}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 style={{ marginBottom: 4, marginRight: 9, }} name="key" size={22} color="#D8605B" />
                        <View style={{ paddingLeft: 0, }}>
                            <Text style={styles.headerText}>Update Name</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionsProfile} onPress={updatePass}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons style={{ marginBottom: 4, marginRight: 9, }} name="rename-box" size={26} color="#D8605B" />
                        <View style={{ paddingLeft: 0, }}>
                            <Text style={styles.headerText}>Update Password</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <Modal isVisible={modalVisible} onBackButtonPress={() => setModalVisible(false)} onBackdropPress={() => setModalVisible(false)}>
                <View style={styles.middleHalf}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={[styles.greetingsText, { marginTop: 5 }]}>{mode == 'name' ? "Update Name" : "Update Password"}</Text>
                    </View>
                    {mode == 'name' && <View style={{ marginTop: scale(10) }}>
                        <TextInput
                            onChangeText={setName}
                            value={name}
                            placeholder="Enter new Name"
                            style={styles.inputfields}
                            maxLength={15}
                        // editable={false}
                        />
                    </View>}
                    {mode == 'pass' && <View style={{ marginTop: scale(10) }}>
                        <TextInput
                            onChangeText={setOldPassword}
                            value={oldPassword}
                            placeholder="Enter old password"
                            style={styles.inputfields}
                            maxLength={20}
                        />
                        <View style={{ marginVertical: 5 }}></View>
                        <TextInput
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Enter new password"
                            style={styles.inputfields}
                            maxLength={20}
                        />
                    </View>}
                    {!loading ? <View style={styles.DatenButtonContainer}>
                        <TouchableOpacity onPress={() => {
                            mode == 'pass' ?
                                updateDetails('pass')
                                :
                                updateDetails("name")
                        }} style={[styles.addTaskButton, { flex: 1, paddingHorizontal: 5, height: scale(40) }]}>
                            <Text style={styles.taskButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                        :
                        <View style={styles.DatenButtonContainer}>
                            <TouchableOpacity style={[styles.addTaskButton, { flex: 1, paddingHorizontal: 5, height: scale(40) }]}>
                                <ActivityIndicator size={'large'} />
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </Modal>


            <Modal isVisible={logoutModalVisible} onBackButtonPress={() => setLogoutModalVisible(false)} onBackdropPress={() => setLogoutModalVisible(false)}>
                {!logoutLoader ? <View style={styles.middleHalf}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={[styles.logoutModalText, { marginTop: 5 }]}>Are you sure you want to logout?</Text>
                    </View>

                    <View style={[styles.DatenButtonContainer, { justifyContent: 'space-around' }]}>
                        <TouchableOpacity onPress={() => { }} style={[styles.logoutModalButtons, {}]}>
                            <Text style={styles.taskButtonText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={[styles.logoutModalButtons, {}]}>
                            <Text style={[styles.taskButtonText]}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                    :
                    <View style={[styles.middleHalf]}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 13 }}>
                            <Text style={[styles.logoutModalText, { marginBottom: 15 }]}>Logging out</Text>
                            <ActivityIndicator size={'large'} />
                        </View>
                    </View>
                }
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    upperHalf: {
        flex: 1,
        backgroundColor: 'rgba(244, 194, 127, 1)',
        // width: scale(width),
        // justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        borderRadius: 100,
        borderWidth: 5,
        padding: 7,
        borderColor: '#D8605B'
    },
    image: {
        height: scale(150),
        width: scale(150),
        borderRadius: 100,
    },
    nameText: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        fontSize: scale(25),

    },
    emailText: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        fontSize: scale(12),
        marginTop: -10,
        color: 'rgba(52, 52, 52, 0.8)'
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
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    lowerHalf: {
        flex: 1.2,
        backgroundColor: '#fff',
    },
    headerText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(15)
    },
    optionsProfile: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        elevation: 5,
        marginTop: 20,
        borderRadius: 15,
        width: width * 0.85,
        alignSelf: 'center',
        paddingVertical: 10,
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
    greetingsText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(18),
        textAlign: 'center'
    },
    logoutModalText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(15),
        textAlign: 'center'
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
    DatenButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: 10,
        marginTop: 10,

        // width: "50%"
    },
    titleHeaderText: {
        fontSize: scale(15),
        fontFamily: 'Poppins-Bold'
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
    addTaskButton: {
        backgroundColor: '#D8605B',
        paddingHorizontal: 30,
        paddingVertical: 4,
        borderRadius: 5,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutModalButtons: {
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
});
