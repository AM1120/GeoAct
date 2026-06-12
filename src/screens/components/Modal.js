import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { stylesmodal } from "../../styles/stylesmodal";

const CustomModal = ({ visible, onClose, title, children }) => {
    // Si no es visible, no renderizamos nada
    if (!visible) return null;

    return (
        <Modal 
            transparent={true} 
            animationType="fade" 
            visible={visible}
            onRequestClose={onClose} 
        >
            <View style={stylesmodal.modalContainer}>
                <View style={stylesmodal.modalContent}>
                    
                    {/* Cabecera del Modal con Botón de cerrar (La X) */}
                    <View style={stylesmodal.header}>
                        <Text style={stylesmodal.modalTitle}>{title}</Text>
                        <TouchableOpacity 
                            style={stylesmodal.closeButton} 
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Image 
                                source={require("../../../assets/close.png")} 
                                style={stylesmodal.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        style={[stylesmodal.body, { width: '100%' }]} 
                        nestedScrollEnabled={true} // Permite scrolls hijos como tu desplegable
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                    
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;