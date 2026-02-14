import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LandingPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.content}>
                <Text style={styles.title}>Welcome to BechBikhan</Text>
                <Text style={styles.subtitle}>Your one-stop shop for everything</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.customerButton]}
                        onPress={() => router.push('/customer-login')}
                    >
                        <Text style={styles.buttonText}>I am a Shopper</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.vendorButton]}
                        onPress={() => router.push('/vendor-login')}
                    >
                        <Text style={styles.buttonText}>I am a Vendor</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        width: '100%',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    customerButton: {
        backgroundColor: '#007AFF',
    },
    vendorButton: {
        backgroundColor: '#6200ee',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
