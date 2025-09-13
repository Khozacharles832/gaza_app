import { Image } from 'react-native';
import React, { ComponentProps } from 'react';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const uri = path && path.startsWith('http') ? path : fallback;

  return <Image source={{ uri }} {...imageProps} />;
};

export default RemoteImage;
