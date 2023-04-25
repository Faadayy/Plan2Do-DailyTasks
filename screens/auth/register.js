import { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, Text, TouchableOpacity, View, Alert, Vibration, Animated, ActivityIndicator } from 'react-native';
import { scale } from '../../utils/dimensions.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import validator from 'validator'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/firestore';

export default function Splash({ navigation }) {

    //UsesStates for Variables
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [localOTP, setLocalOTP] = useState(0);
    const [serverOTP, setServerOTP] = useState(0);

    //Missing Details Handling UseStaes
    const [emailMissing, setEmailMissing] = useState(false)
    const [passwordMissing, setPasswordMissing] = useState(false)
    const [fullNameMissing, setFullNameMissing] = useState(false)
    const [confirmPassMissing, setConfirmPassMissing] = useState(false)
    const [passMismatch, setPassMisMatch] = useState(false)
    const [weakPass, setWeakPass] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState("")
    const [switchMode, setSwitchMode] = useState(true);
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
    const [emailinUseError, setEmailinUseError] = useState(true);
    const [linkMessageVisible, setLinkMessageVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        clearFields()
        resetErrorMessages()

        return () => {
            clearFields()
            resetErrorMessages()
        }
    }, [])


    //Function to correct email
    const removeSpaces = (str) => {
        return str.replace(/\s/g, '');
    }

    //Register Button Function which validates the input
    const verifyDetails = () => {
        resetErrorMessages()
        if (fullName && email && confirmPassword && password) {
            if (password === confirmPassword) {
                if (validator.isStrongPassword(password)) {
                    return true
                } else setWeakPass(true)
            } else setPassMisMatch(true)
        } else {
            if (!email) setEmailMissing(true)
            if (!fullName) setFullNameMissing(true)
            if (!confirmPassword) setConfirmPassMissing(true)
            if (!password) setPasswordMissing(true)
        }
        return false
    }

    Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true, }),
        Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true, }),
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true, }),
        Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true, }),
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true, }),
        Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true, }),
    ]).start();



    const animatedStyle = {
        opacity: animatedValue,
        transform: [{
            scale: animatedValue.interpolate({
                inputRange: [0.3, 1],
                outputRange: [1, 1.1],
            }),
        },],
    };


    const sendLink = async () => {
        const val = await auth().currentUser.sendEmailVerification()
            .then(async () => {
                console.log('Sent')
                // await auth().signOut()
            })
        const user = auth().currentUser;
        setLoading(false)
        clearFields()
        setLinkMessageVisible(true)
        const match = await user.updateProfile({
            displayName: fullName,
            photoURL: 'https://i.ibb.co/Fmv63nx/dummy-Photo.png'
        });
        const databasee = await database.collection('users').doc(user.uid).set({
            displayName: fullName,
            data: []
        })
    }

    const registerButton = async () => {
        if (verifyDetails()) {
            setLoading(true)
            // if (!auth().currentUser) {
            auth()
                .createUserWithEmailAndPassword(removeSpaces(email), password)
                .then(() => {
                    sendLink()
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        setEmailinUseError(true)
                        console.log('That email address is already in use!');
                    }
                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                    }
                }).finally(() => {
                    setLoading(false)

                })
            // } else {
            //     const res = await auth().signOut()
            // }
        }
    }


    //Function to clear error messages
    const resetErrorMessages = () => {
        setServerError(false)
        setEmailMissing(false)
        setFullNameMissing(false)
        setPasswordMissing(false)
        setConfirmPassMissing(false)
        setPassMisMatch(false)
        setWeakPass(false)
        setEmailinUseError(false)
        setLinkMessageVisible(false)
    }

    //Function to clear user enetered details
    const clearFields = () => {
        setEmail("")
        setFullName("")
        setPassword("")
        setConfirmPassword("")
        setLocalOTP(0)
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View >
                        <Image source={require('../../assets/images/Done.png')} style={styles.image} />
                    </View>
                    <View>
                        <View style={styles.uppertextContainer}>
                            <Text style={[styles.uppertext, { marginBottom: scale(-10) }]}>Get’s things done</Text>
                            <Text style={[styles.uppertext, {}]}>with Plan2Do</Text>
                            <Text style={styles.descriptionText}>
                                Let’s help you meet up your tasks
                            </Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                        </View>
                    </View>
                    <View>
                        <TextInput
                            onChangeText={text => setFullName(text)}
                            value={fullName}
                            placeholder="Enter your full name"
                            placeholderTextColor={'#000'}
                            style={styles.inputfields}

                        />
                        {fullNameMissing && <Text style={styles.errorMessages}>Please enter your name</Text>}
                        <TextInput
                            onChangeText={text => setEmail(text)}
                            value={email}
                            placeholderTextColor={'#000'}
                            style={styles.inputfields}
                            placeholder="Enter your email"
                        />
                        {emailMissing && <Text style={styles.errorMessages}>Please enter your email</Text>}

                        <TextInput
                            onChangeText={text => setPassword(text)}
                            value={password}
                            secureTextEntry={true}
                            placeholder="Enter password"
                            placeholderTextColor={'#000'}
                            style={styles.inputfields}
                        />
                        {passwordMissing && <Text style={styles.errorMessages}>Please enter your password</Text>}
                        {passMismatch && <Text style={styles.errorMessages}>Passwords do not match</Text>}
                        {weakPass && <Text style={styles.errorMessages}>Weak Password. Enter a strong password</Text>}

                        <TextInput
                            onChangeText={text => setConfirmPassword(text)}
                            value={confirmPassword}
                            secureTextEntry={true}
                            placeholderTextColor={'#000'}
                            placeholder="Confirm Password"
                            style={styles.inputfields}
                        />
                        {confirmPassMissing && <Text style={styles.errorMessages}>Please enter confirm password</Text>}
                        {passMismatch && <Text style={styles.errorMessages}>Passwords do not match</Text>}
                        {weakPass && <Text style={styles.errorMessages}>Weak Password. Enter a strong password</Text>}
                        {emailinUseError && <Text style={styles.errorMessages}>That email address is already in use!</Text>}
                    </View>

                    {linkMessageVisible && <Text style={[styles.errorMessages, { marginLeft: 0, width: '70%' }]}>Please verify your email with the link sent to your email.</Text>}


                </View>
                {serverError && <View style={[styles.serverErrorContainer, {}]}>
                    <Animated.Text style={[styles.serverErrorText, animatedStyle, { opacity: serverError ? 1 : 0 }]}>
                        {serverErrorMessage}
                    </Animated.Text>
                </View>}
                <View style={styles.buttonContainer}>
                    {!loading ?
                        <TouchableOpacity style={styles.buttonDesign} onPress={registerButton}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.buttonDesign} disabled={loading}>
                            <ActivityIndicator size={'large'} color={'white'} />
                        </TouchableOpacity>
                    }


                    <View style={styles.registerButtonContainer}>
                        <Text style={styles.registerbuttonText}>Already have an account ? </Text>
                        <TouchableOpacity style={styles.registerbuttonDesign} onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.registerbuttonText, { color: '#D8605B', fontFamily: 'Poppins-Bold', fontSize: scale(15) }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        </KeyboardAwareScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4C27F',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    image: {
        width: scale(287),
        height: scale(215),
    },
    uppertextContainer: {
        alignItems: 'center'
    },
    uppertext: {
        fontFamily: 'Poppins-Regular',
        fontSize: scale(20),
        color: '#000'
    },
    descriptionContainer: {
        marginTop: scale(15),
        width: scale(300)
    },
    descriptionText: {
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        fontSize: scale(13),
        color: '#000'
    },
    buttonContainer: {
        flexDirection: 'column',
        marginTop: scale(7),
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerButtonContainer: {
        marginTop: scale(7),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerbuttonDesign: {},
    registerbuttonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: scale(13),
        alignSelf: 'center',
        color: '#000'
    },
    buttonDesign: {
        backgroundColor: '#D8605B',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: scale(280),
        elevation: 5,
        height: scale(42)
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        color: '#fff',
        marginTop: scale(3),
        fontSize: scale(17)
    },
    image2: {
        width: scale(20),
        height: scale(20),
        marginLeft: 5,
    },
    inputfields: {
        backgroundColor: '#fff',
        width: scale(301),
        // height: scale(50),
        borderRadius: 23,
        fontFamily: 'Poppins-Regular',
        marginTop: scale(10),
        paddingHorizontal: scale(30),
        fontSize: scale(14),
        paddingTop: scale(15)

    },
    errorMessages: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        marginLeft: 20,
        color: '#002B5B',
    },
    serverErrorContainer: {
        width: scale(201),
        alignSelf: 'center',
        // backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginTop: 10
    },
    serverErrorText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: scale(13),
        color: '#000'
    },
});
