import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const PRIMARY_COLOR = "#286660";

function VerificationScreen() {
  const params = useLocalSearchParams();
  const [selectedDocument, setSelectedDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        
        // Validate file size (5MB limit)
        if (file.size && file.size > 5 * 1024 * 1024) {
          Alert.alert("Error", "File size cannot exceed 5MB. Please select a smaller file.");
          return;
        }
        
        setSelectedDocument(file);
        Alert.alert("Success", "Document selected successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
      console.error("Document picker error:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        
        // Validate file size (5MB limit)
        if (image.fileSize && image.fileSize > 5 * 1024 * 1024) {
          Alert.alert("Error", "Image size cannot exceed 5MB. Please select a smaller image.");
          return;
        }
        
        setSelectedImage(image);
        Alert.alert("Success", "Image selected successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error("Image picker error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDocument && !selectedImage) {
      Alert.alert("Error", "Please upload a valid ID document or image");
      return;
    }

    setLoading(true);

    try {
      // Here you would typically upload the document/image to your backend
      // For now, we'll simulate the upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        "Verification Submitted", 
        "Your ID has been submitted for admin review. You will receive a notification once an admin verifies your account. This process typically takes 24-48 hours.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/auth/login")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit verification. Please try again.");
      console.error("Verification submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section - Background Image */}
      <View style={styles.topSection}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Section - Form */}
      <View style={styles.bottomSection}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Account Verification</Text>
          </View>

          <Text style={styles.description}>
            Please upload a valid government-issued ID to verify your account. 
            Your ID will be reviewed by our admin team within 24-48 hours. 
            You will receive a notification once your account is verified.
          </Text>

          {/* Document Upload Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Upload Valid ID</Text>
            
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Feather name="file-text" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>Select Document (PDF/Image)</Text>
            </TouchableOpacity>

            {selectedDocument && (
              <View style={styles.selectedFile}>
                <Feather name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.selectedFileText}>
                  {selectedDocument.name || 'Document selected'}
                </Text>
              </View>
            )}

            <Text style={styles.orText}>OR</Text>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Feather name="camera" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>Take Photo of ID</Text>
            </TouchableOpacity>

            {selectedImage && (
              <View style={styles.selectedFile}>
                <Feather name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.selectedFileText}>
                  Image selected
                </Text>
              </View>
            )}
          </View>

          {/* Accepted ID Types */}
          <View style={styles.idTypesSection}>
            <Text style={styles.sectionTitle}>Accepted ID Types</Text>
            <View style={styles.idTypesList}>
              <View style={styles.idTypeItem}>
                <Feather name="check" size={16} color="#4CAF50" />
                <Text style={styles.idTypeText}>Driver's License</Text>
              </View>
              <View style={styles.idTypeItem}>
                <Feather name="check" size={16} color="#4CAF50" />
                <Text style={styles.idTypeText}>Passport</Text>
              </View>
              <View style={styles.idTypeItem}>
                <Feather name="check" size={16} color="#4CAF50" />
                <Text style={styles.idTypeText}>National ID</Text>
              </View>
              <View style={styles.idTypeItem}>
                <Feather name="check" size={16} color="#4CAF50" />
                <Text style={styles.idTypeText}>Professional License</Text>
              </View>
            </View>
            
            <Text style={styles.fileTypesTitle}>Accepted File Formats</Text>
            <View style={styles.fileTypesList}>
              <View style={styles.fileTypeItem}>
                <Feather name="file-text" size={16} color="#4CAF50" />
                <Text style={styles.fileTypeText}>PDF files</Text>
              </View>
              <View style={styles.fileTypeItem}>
                <Feather name="image" size={16} color="#4CAF50" />
                <Text style={styles.fileTypeText}>JPEG/JPG images</Text>
              </View>
              <View style={styles.fileTypeItem}>
                <Feather name="image" size={16} color="#4CAF50" />
                <Text style={styles.fileTypeText}>PNG images</Text>
              </View>
              <View style={styles.fileTypeItem}>
                <Feather name="info" size={16} color="#FFA500" />
                <Text style={styles.fileTypeText}>Maximum file size: 5MB</Text>
              </View>
            </View>
          </View>

          {/* Privacy Notice */}
          <View style={styles.privacySection}>
            <Text style={styles.privacyTitle}>Privacy & Security</Text>
            <Text style={styles.privacyText}>
              Your ID will be securely stored and encrypted. Our admin team will review your 
              document for verification purposes only. We will never share your information 
              with third parties.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Submitting..." : "Submit for Verification"}
            </Text>
          </TouchableOpacity>

          {/* Verify Later Option */}
          <TouchableOpacity
            style={styles.verifyLaterButton}
            onPress={() => {
              Alert.alert(
                "Verify Later",
                "You can complete verification later from your account settings. Your ID will be reviewed by our admin team within 24-48 hours once submitted. You'll have limited access until verified.",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "Continue",
                    onPress: () => {
                      // Navigate to login with verification pending
                      router.replace("/auth/login");
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.verifyLaterButtonText}>Verify Later</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.9,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    alignItems: 'center',
  },
  description: {
    color: '#bed2d0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  uploadSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  selectedFileText: {
    color: '#4CAF50',
    fontSize: 14,
    marginLeft: 8,
  },
  orText: {
    color: '#bed2d0',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  idTypesSection: {
    marginBottom: 30,
  },
  idTypesList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  idTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  idTypeText: {
    color: '#bed2d0',
    fontSize: 14,
    marginLeft: 10,
  },
  fileTypesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  fileTypesList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  fileTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileTypeText: {
    color: '#bed2d0',
    fontSize: 14,
    marginLeft: 10,
  },
  privacySection: {
    marginBottom: 30,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  privacyText: {
    color: '#bed2d0',
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifyLaterButton: {
    backgroundColor: '#FFA500',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyLaterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 