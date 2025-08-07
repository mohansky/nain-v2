import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      // console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!");
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View className="items-center">
      <View className="relative">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            accessibilityLabel="Avatar"
            className="w-10 h-10 rounded-xl bg-gray-400 border-gray-500"
            style={[avatarSize, { borderRadius: size / 2 }]}
          />
        ) : (
          <View
            className="w-10 h-10 rounded-xl bg-gray-400 border border-gray-500"
            style={[avatarSize, { borderRadius: size / 2 }]}
          />
        )}
        
        <TouchableOpacity
          className="absolute -top-1 -right-1 bg-primary rounded-full p-2 shadow-lg"
          onPress={uploadAvatar}
          disabled={uploading}
          style={{
            width: size * 0.25,
            height: size * 0.25,
            borderRadius: (size * 0.25) / 2,
          }}
        >
          <Icon 
            name="edit" 
            size={size * 0.12} 
            color="#fff" 
            style={{ alignSelf: 'center' }}
          />
        </TouchableOpacity>

        {uploading && (
          <View
            style={[
              avatarSize,
              {
                borderRadius: size / 2,
                position: "absolute",
                top: 0,
                left: 0,
              },
            ]}
            className="bg-black/50 items-center justify-center"
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    </View>
  );
}
