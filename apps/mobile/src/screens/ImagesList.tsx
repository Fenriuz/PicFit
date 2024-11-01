import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, FlatList, useWindowDimensions, StyleSheet, Animated } from 'react-native';
import { useImages, useImageUpload } from '../hooks/useImages';
import { ImageCard } from '../components/specific/ImageCard';
import { ErrorView } from '../components/common/ErrorView';
import { UploadArea } from '../components/specific/UploadArea';
import { ImageModal } from '../components/specific/ImageModal';
import { Image as ImageType } from '../types/image';

export const ImagesListScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useImages();

  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();

  const getNumberOfColumns = () => {
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const uploadAreaHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [250, 120],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <ErrorView message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <UploadArea onUpload={uploadImage} isUploading={isUploading} uploadAreaHeight={uploadAreaHeight} />

      <FlatList
        data={data?.pages.flatMap((page) => page.items)}
        renderItem={({ item, index }) => (
          <ImageCard image={item} onPress={() => setSelectedImage(item)} index={index} />
        )}
        keyExtractor={(item) => item.key}
        numColumns={getNumberOfColumns()}
        key={getNumberOfColumns()}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator size="small" style={styles.loader} /> : null
        }
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      />

      <ImageModal image={selectedImage} visible={!!selectedImage} onClose={() => setSelectedImage(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    padding: 16,
  },
});
