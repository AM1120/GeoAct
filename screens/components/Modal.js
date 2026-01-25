import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { stylesmodal } from "../../styles/stylesmodal";

const CustomModal = ({ visible, onClose, title, children }) => {
    // Si no es visible, no renderizamos nada
    if (!visible) return null;

    return (
        <Modal 
            transparent={true} 
            animationType="fade" // 'fade' suele verse más limpio para modales de registro
            visible={visible}
            onRequestClose={onClose} // Requerido para el botón 'atrás' en Android
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
                                source={require("../../assets/close.png")} 
                                style={stylesmodal.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Contenedor del contenido */}
                    <View style={stylesmodal.body}>
                        {children}
                    </View>
                    
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;