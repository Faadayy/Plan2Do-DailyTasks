import { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, Text, TouchableOpacity, View, Alert, Animated, Vibration, ActivityIndicator } from 'react-native';
import { scale } from '../../utils/dimensions.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import validator from 'validator';
import auth from '@react-native-firebase/auth';



export default function Login({ navigation }) {

    //UsesStates
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [emailMissing, setEmailMissing] = useState(false)
    const [emailMissingPlus, setEmailMissingPlus] = useState(false)
    const [passwordMissing, setPasswordMissing] = useState(false)
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
    const [serverError, setServerError] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState("")
    const [loginError, setLoginError] = useState()
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        clearFields()
    }, [])

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

    const verifyDetails = () => {
        resetErrorMessages()
        if (email && password) {
            if (validator.isEmail(email)) return true
            else setEmailMissingPlus(true)
        } else {
            if (!email) setEmailMissing(true)
            if (!password) setPasswordMissing(true)
        }
        return false
    }

    //Function to clear error messages
    const resetErrorMessages = () => {
        setServerError(false)
        setEmailMissing(false)
        setEmailMissingPlus(false)
        setPasswordMissing(false)
    }

    const loginUser = async () => {
        if (auth().currentUser.emailVerified) {
            clearFields()
            navigation.navigate('DashBoard')
            setLoading(false)
        } else {
            const val = await auth().currentUser.sendEmailVerification()
            setLoginError('Email Address not verified. Please Verify email first via link sent to your email address.');
        }
    }

    const handleLogin = async () => {
        if (verifyDetails()) {
            setLoading(true)
            //An Api request to send user registration email OTP
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    console.log('email verification', auth().currentUser.emailVerified)
                    loginUser()
                })
                .catch(error => {
                    if (error.code === 'auth/user-not-found') {
                        setLoginError('Invalid email or password.');
                    }
                    if (error.code === 'auth/invalid-email') {
                        setLoginError('That email address is invalid!');
                    }
                    if (error.code === 'auth/wrong-password') {
                        setLoginError('Invalid email or password.');
                    }
                });
        }
    }

    //Function to clear user enetered details
    const clearFields = () => {
        setLoginError()
        setEmail("")
        setPassword("")
        setServerErrorMessage("")
    }

    return (
        <KeyboardAwareScrollView
            // style={{ flex: 1, backgroundColor: '#F4C27F' }}
            style={styles.container}
        >
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View >
                        <Image source={require('../../assets/images/Done.png')} style={styles.image} />
                    </View>
                    <View>
                        <View style={styles.uppertextContainer}>
                            <Text style={[styles.uppertext, { marginBottom: scale(-10) }]}>Welcome back </Text>
                            <Text style={[styles.uppertext, { marginBottom: scale(-10) }]}>to </Text>
                            <Text style={[styles.uppertext, { fontSize: scale(30) }]}>Plan2Do</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                        </View>
                    </View>
                    <View>

                        <TextInput
                            onChangeText={text => setEmail(text)}
                            value={email}
                            style={styles.inputfields}
                            placeholder="Enter your email"
                            placeholderTextColor={'#000'}
                        />
                        {emailMissing && <Text style={styles.errorMessages}>Please enter email</Text>}
                        {emailMissingPlus && <Text style={styles.errorMessages}>Please enter a correct email</Text>}
                        <TextInput
                            onChangeText={text => setPassword(text)}
                            value={password}
                            secureTextEntry={true}
                            placeholder="Enter password"
                            placeholderTextColor={'#000'}

                            style={styles.inputfields}
                        />
                        {passwordMissing && <Text style={styles.errorMessages}>Please enter password</Text>}

                    </View>
                    {loginError && <Text style={[styles.errorMessages, { marginLeft: 0, width: '70%' }]}>{loginError}</Text>}
                    {/* {true && <Text style={[styles.errorMessages, { marginLeft: 0, width: '70%' }]}>@bdhvnjbjhvnxkmiuhvbdvkndbhufrndvkbindmlbidnfdkbiufgnodkmbiudgnm</Text>} */}
                </View>
                {serverError && <View style={[styles.serverErrorContainer, {}]}>
                    <Animated.Text style={[styles.serverErrorText, animatedStyle, { opacity: serverError ? 1 : 0 }]}>
                        {serverErrorMessage}
                    </Animated.Text>
                </View>}
                <View style={{ alignSelf: 'flex-end', width: scale(200) }}>
                    <View style={[styles.registerButtonContainer, {}]}>
                        <TouchableOpacity style={[styles.registerbuttonDesign, { alignItems: 'flex-end' }]} onPress={() => { }}>
                            <Text style={[styles.registerbuttonText, {}]}>Forgot Password ?</Text>
                            {/* <Text style={[styles.registerbuttonText, { color: '#D8605B', fontFamily: 'Poppins-Bold', fontSize: scale(15) }]}>Sign Up</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {!loading ?
                        <TouchableOpacity style={styles.buttonDesign} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.buttonDesign} disabled={loading}>
                            <ActivityIndicator size={'large'} color={'white'} />
                        </TouchableOpacity>
                    }
                    <View style={styles.registerButtonContainer}>
                        <Text style={styles.registerbuttonText}>Don’t have an account ? </Text>
                        <TouchableOpacity style={styles.registerbuttonDesign} onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.registerbuttonText, { color: '#D8605B', fontFamily: 'Poppins-Bold', fontSize: scale(15) }]}>Sign Up</Text>
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
        fontSize: scale(17),

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
        fontFamily: 'Poppins_500Medium',
        fontSize: scale(13),
        color: '#000'
    },
});
