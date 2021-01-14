import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {
  let [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted == false) {
      alert("Permission to access camera is required for this app to work!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    } 

    };

    let openShareDialogAsync = async () => {
      if(!(await Sharing.isAvailableAsync())) {
        alert(`The image is available for sharing at: ${selectedImage.remoteUri} instead because you're on web`);
        return;
      }
      await Sharing.shareAsync(selectedImage.localUri);
    };

  
  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
            <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
              <Text style={styles.buttonText}>Share this photo!</Text>
            </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.instructions}>
        Press the button below to share a special photo from your phone to friends, family, or loved ones.
      </Text>

      <TouchableOpacity
      style={styles.button}
      onPress={openImagePickerAsync}>
      <Text style={styles.buttonText}>Pick a Photo</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffbc00',
    alignItems: 'center',
    justifyContent: 'center',
  },
   logo: {
     width: 309,
     height: 159,
     marginBottom: 10
   },
    instructions: {
      color: '#8e29fb',
      fontSize: 18,
      marginHorizontal: 15,
      marginBottom:15
    },
     button: {
       backgroundColor: 'turquoise',
       padding:10
     },
      buttonText: {
        fontSize: 20,
        color: '#fff'
      },
      thumbnail: {
        width: 300,
        height: 300,
        marginBottom: 15,
        resizeMode: "cover"
      }
});
