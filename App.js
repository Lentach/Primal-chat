/**
 * Mój Komunikator - Klient Czatu React Native
 * 
 * Aplikacja łączy się z serwerem Socket.io i umożliwia
 * wysyłanie oraz odbieranie wiadomości w czasie rzeczywistym.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { io } from 'socket.io-client';

// ============================================
// KONFIGURACJA SERWERA
// ============================================
// Dla przeglądarki (Web): http://localhost:3000
// Dla Android Emulatora: http://10.0.2.2:3000
// Dla fizycznego urządzenia: http://TWOJE_IP:3000
const SERVER_URL = 'http://localhost:3000';

// ============================================
// FUNKCJE BEZPIECZEŃSTWA (placeholder na szyfrowanie)
// ============================================

/**
 * Funkcja przygotowująca wiadomość przed wysłaniem.
 * W przyszłości tutaj można dodać szyfrowanie.
 * @param {string} text - Tekst do wysłania
 * @returns {string} - Przetworzony tekst
 */
const prepareMessageForSending = (text) => {
    // TODO: Dodaj szyfrowanie tutaj (np. AES, RSA)
    return text;
};

/**
 * Funkcja przetwarzająca odebraną wiadomość.
 * W przyszłości tutaj można dodać deszyfrowanie.
 * @param {string|object} msg - Odebrana wiadomość
 * @returns {string} - Odszyfrowany tekst
 */
const processIncomingMessage = (msg) => {
    // TODO: Dodaj deszyfrowanie tutaj
    if (typeof msg === 'object' && msg.text) {
        return msg.text;
    }
    return String(msg);
};

// ============================================
// GŁÓWNY KOMPONENT APLIKACJI
// ============================================

export default function App() {
    // Stan aplikacji
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Łączenie...');

    // Referencja do socket.io
    const socketRef = useRef(null);
    const flatListRef = useRef(null);

    // Efekt inicjalizujący połączenie Socket.io
    useEffect(() => {
        console.log('[App] Inicjalizacja połączenia z:', SERVER_URL);

        // Tworzenie połączenia socket
        const socket = io(SERVER_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        // Event: Połączono z serwerem
        socket.on('connect', () => {
            console.log('[Socket] Połączono! ID:', socket.id);
            setConnectionStatus('Połączono ✓');
        });

        // Event: Rozłączono
        socket.on('disconnect', (reason) => {
            console.log('[Socket] Rozłączono:', reason);
            setConnectionStatus('Rozłączono ✗');
        });

        // Event: Błąd połączenia
        socket.on('connect_error', (error) => {
            console.log('[Socket] Błąd połączenia:', error.message);
            setConnectionStatus('Błąd połączenia');
        });

        // Event: Odebrano wiadomość od serwera
        socket.on('odbierz_wiadomosc', (msg) => {
            console.log('[Socket] Odebrano wiadomość:', msg);

            const processedContent = processIncomingMessage(msg);
            const newMessage = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content: processedContent,
                timestamp: new Date().toLocaleTimeString('pl-PL'),
            };

            setMessages((prev) => [...prev, newMessage]);
        });

        // Cleanup przy odmontowaniu komponentu
        return () => {
            console.log('[App] Rozłączanie socket...');
            socket.disconnect();
        };
    }, []);

    // Funkcja wysyłania wiadomości
    const handleSendMessage = () => {
        const trimmedText = messageText.trim();

        if (trimmedText.length === 0) {
            return;
        }

        // Zawsze czyść pole tekstowe
        setMessageText('');

        // Sprawdź połączenie
        if (!socketRef.current || !socketRef.current.connected) {
            console.log('[App] Nie można wysłać - brak połączenia');
            Alert.alert('Brak połączenia z serwerem!', 'Uruchom serwer w terminalu:\ncd serwer\nnpm start');
            return;
        }

        const payload = prepareMessageForSending(trimmedText);
        console.log('[App] Wysyłanie wiadomości:', payload);

        socketRef.current.emit('wyslij_wiadomosc', payload);
    };

    // Renderowanie pojedynczej wiadomości
    const renderMessage = ({ item }) => (
        <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.messageTime}>{item.timestamp}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Nagłówek */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mój Komunikator</Text>
                <Text style={[
                    styles.statusText,
                    { color: connectionStatus.includes('✓') ? '#4CAF50' : '#F44336' }
                ]}>
                    {connectionStatus}
                </Text>
            </View>

            {/* Lista wiadomości */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => {
                    if (flatListRef.current && messages.length > 0) {
                        flatListRef.current.scrollToEnd({ animated: true });
                    }
                }}
            />

            {/* Panel wprowadzania wiadomości */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.textInput}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Wpisz wiadomość..."
                    placeholderTextColor="#888"
                    onSubmitEditing={handleSendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sendButtonText}>Wyślij</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ============================================
// STYLE
// ============================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        backgroundColor: '#075E54',
        padding: 16,
        paddingTop: Platform.OS === 'android' ? 40 : 16,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 12,
        marginTop: 4,
    },
    messagesList: {
        padding: 16,
        flexGrow: 1,
    },
    messageBubble: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
        maxWidth: '80%',
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    messageTime: {
        fontSize: 10,
        color: '#888',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#075E54',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
