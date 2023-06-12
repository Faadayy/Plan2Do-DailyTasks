import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.text}>
                    This Privacy Policy governs the manner in which Plan2Do collects, uses, maintains, and discloses information collected from users of the Plan2Do mobile application.
                </Text>
                <Text style={styles.text}>
                    We are committed to protecting the privacy of our Users and have implemented the necessary measures to ensure the confidentiality and security of their personal information. This Privacy Policy explains how we collect, use, and disclose your personal information in connection with the use of our App.
                </Text>
                <Text style={styles.subTitle}>Information Collection and Use</Text>
                <Text style={styles.text}>
                    We do not collect any personal information from users of our App. The only information that we collect is the data that you enter while using the App, which includes your to-do items, reminders, and notes. This data is stored locally on your device and is not accessible by anyone else.
                </Text>
                <Text style={styles.subTitle}>Log Data</Text>
                <Text style={styles.text}>
                    Like many mobile applications, we collect information that your mobile device sends whenever you use our App. This information may include your device type, operating system, device settings, IP address, and the date and time of your use of the App. We use this information to improve the performance and functionality of the App and to monitor and analyze trends, usage, and activities in connection with the App.
                </Text>
                <Text style={styles.subTitle}>Cookies</Text>
                <Text style={styles.text}>
                    Our App does not use cookies to collect information about our Users.
                </Text>
                <Text style={styles.subTitle}>Third-Party Services</Text>
                <Text style={styles.text}>
                    Our App may use third-party services to help us improve the performance and functionality of the App. These services may collect information about you in accordance with their respective privacy policies. We are not responsible for the privacy practices or content of these third-party services and encourage you to review their privacy policies before using them.
                </Text>
                <Text style={styles.subTitle}>Security</Text>
                <Text style={styles.text}>
                    We have implemented reasonable measures to protect the confidentiality and security of your personal information. However, we cannot guarantee the absolute security of your personal information and assume no liability for any disclosure or unauthorized access to your personal information due to unauthorized third-party activities, hardware or software failure, or other factors beyond our control.
                </Text>
                <Text style={styles.subTitle}>Changes to this Privacy Policy</Text>
                <Text style={styles.text}>
                    We reserve the right to modify or update this Privacy Policy from time to time, and will post the updated Privacy Policy on this page. We encourage you to review this Privacy Policy periodically to stay informed about our information practices and your rights to privacy.
                </Text>
                {/* <Text style={styles.subTitle}>Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions or concerns about this Privacy Policy, please contact us at privacy@mytodoapp.com.
                </Text> */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
        textAlign: 'justify'
    }
});
